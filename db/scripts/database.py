from typing import Set
import pandas as pd
from sqlalchemy import create_engine, text
from .utils.logger import logger
from .api.places_api import PlaceData, ReviewData


class DatabaseManager:
    def __init__(self, connection_string: str):
        self.engine = create_engine(connection_string)

    def verify_extensions(self):
        with self.engine.connect() as conn:
            # Ensure PostGIS extension exists for location queries
            try:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
                conn.commit()
                logger.info("PostGIS extension verified/created")
            except Exception as e:
                logger.warning("Could not create PostGIS extension: %s", e)

            # Ensure uuid extension exists for review IDs
            try:
                conn.execute(
                    text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
                )
                conn.commit()
                logger.info("UUID extension verified/created")
            except Exception as e:
                logger.warning("Could not create UUID extension: %s", e)

        logger.info("Database extensions verified")

    def insert_data(self, places: Set[PlaceData], reviews: Set[ReviewData]):
        try:
            places_df = pd.DataFrame([place.__dict__ for place in places])
            reviews_df = pd.DataFrame([review.__dict__ for review in reviews])

            self._insert_users_from_reviews(reviews_df)
            self._insert_places(places_df)
            self._insert_reviews(reviews_df)
            self._update_place_confirmation_counts()

            logger.info("Data insertion completed successfully")

        except Exception as e:
            logger.error("Error inserting data to database: %s", str(e))
            raise

    def _insert_users_from_reviews(self, reviews_df: pd.DataFrame):
        if reviews_df.empty:
            return

        users_df = reviews_df[["username", "email"]].drop_duplicates()
        users_df["google_id"] = users_df["email"]

        logger.info("Inserting %s users into database", len(users_df))

        with self.engine.connect() as conn:

            for _, user in users_df.iterrows():
                conn.execute(
                    text(
                        """
                        INSERT INTO users (username, email, google_id)
                        VALUES (:username, :email, :google_id)
                        ON CONFLICT (username) DO NOTHING
                    """
                    ),
                    {
                        "username": user["username"],
                        "email": user["email"],
                        "google_id": user["google_id"],
                    },
                )
            conn.commit()

    def _insert_places(self, places_df: pd.DataFrame):
        if places_df.empty:
            return

        logger.info("Inserting %s places into database", len(places_df))

        with self.engine.connect() as conn:

            for _, place in places_df.iterrows():
                conn.execute(
                    text(
                        """
                        INSERT INTO places 
                        (id, name, address, latitude, longitude, business_type, 
                         google_maps_url, allows_pet, pet_friendly, num_confirm, num_deny)
                        VALUES (:id, :name, :address, :latitude, :longitude, :business_type,
                                :google_maps_url, :allows_pet, :pet_friendly, :num_confirm, :num_deny)
                        ON CONFLICT (id) 
                        DO UPDATE SET
                            name = EXCLUDED.name,
                            address = EXCLUDED.address,
                            latitude = EXCLUDED.latitude,
                            longitude = EXCLUDED.longitude,
                            business_type = EXCLUDED.business_type,
                            google_maps_url = EXCLUDED.google_maps_url,
                            allows_pet = EXCLUDED.allows_pet,
                            pet_friendly = EXCLUDED.pet_friendly,
                            updated_at = CURRENT_TIMESTAMP
                    """
                    ),
                    {
                        "id": place["id"],
                        "name": place["name"],
                        "address": place["address"],
                        "latitude": place["latitude"],
                        "longitude": place["longitude"],
                        "business_type": place["business_type"],
                        "google_maps_url": place.get("google_maps_url"),
                        "allows_pet": place.get("allows_pet"),
                        "pet_friendly": place.get("pet_friendly", False),
                        "num_confirm": place.get("num_confirm", 0),
                        "num_deny": place.get("num_deny", 0),
                    },
                )
            conn.commit()

    def _insert_reviews(self, reviews_df: pd.DataFrame):
        if reviews_df.empty:
            return

        logger.info(
            "Inserting %s pet-related reviews into database",
            len(reviews_df),
        )

        with self.engine.connect() as conn:

            for _, review in reviews_df.iterrows():
                user_result = conn.execute(
                    text(
                        """SELECT id FROM users WHERE username = :username LIMIT 1"""
                    ),
                    {"username": review["username"]},
                )

                user_row = user_result.fetchone()
                if user_row:
                    user_id = user_row[0]

                    conn.execute(
                        text(
                            """
                            INSERT INTO reviews 
                            (place_id, user_id, username, pet_friendly, comment)
                            VALUES (:place_id, :user_id, :username, :pet_friendly, :comment)
                        """
                        ),
                        {
                            "place_id": review["place_id"],
                            "user_id": user_id,
                            "username": review["username"],
                            "pet_friendly": review["pet_friendly"],
                            "comment": review["comment"],
                        },
                    )
            conn.commit()

    def _update_place_confirmation_counts(self):
        with self.engine.connect() as conn:
            conn.execute(
                text(
                    """
                    UPDATE places 
                    SET 
                        num_confirm = (
                            SELECT COUNT(*) FROM reviews 
                            WHERE place_id = places.id AND pet_friendly = true
                        ),
                        num_deny = (
                            SELECT COUNT(*) FROM reviews 
                            WHERE place_id = places.id AND pet_friendly = false
                        ),
                        last_contribution_type = (
                            SELECT CASE WHEN pet_friendly THEN 'confirm' ELSE 'deny' END
                            FROM reviews 
                            WHERE place_id = places.id 
                            ORDER BY created_at DESC 
                            LIMIT 1
                        ),
                        updated_at = CURRENT_TIMESTAMP,
                        pet_friendly = (
                            (SELECT COUNT(*) FROM reviews 
                             WHERE place_id = places.id AND pet_friendly = true) > 0
                        )
                    WHERE id IN (SELECT DISTINCT place_id FROM reviews)
                """
                )
            )
            conn.commit()
