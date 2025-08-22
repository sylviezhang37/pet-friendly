from typing import Set
from datetime import datetime
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from common.logger import logger
from places_api import PlaceData, ReviewData
from .models import Base, User, Place, Review


class DatabaseManager:
    def __init__(self, connection_string: str):
        self.engine = create_engine(connection_string)
        self.Session = sessionmaker(bind=self.engine)
        Base.metadata.bind = self.engine

    def verify_extensions(self):
        with self.engine.connect() as conn:
            # PostGIS extension
            try:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
                conn.commit()
                logger.info("PostGIS extension verified/created")
            except Exception as e:
                logger.warning("Could not create PostGIS extension: %s", e)

            # uuid extension
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
        session = self.Session()
        try:
            places_df = pd.DataFrame([place.__dict__ for place in places])
            reviews_df = pd.DataFrame([review.__dict__ for review in reviews])

            if not reviews_df.empty:
                self._bulk_insert_users(session, reviews_df)

            if not places_df.empty:
                self._bulk_insert_places(session, places_df)

            if not reviews_df.empty:
                self._bulk_insert_reviews(session, reviews_df)

            self._update_place_confirmation_counts(session)

            session.commit()
            logger.info("Data insertion completed successfully")

        except Exception as e:
            session.rollback()
            logger.error("Error inserting data to database: %s", str(e))
            raise
        finally:
            session.close()

    def _bulk_insert_users(self, session, reviews_df: pd.DataFrame):
        users_df = reviews_df[["username", "email"]].drop_duplicates()
        users_df = users_df.copy()
        users_df["google_id"] = users_df["email"]

        logger.info("Processing %s unique users", len(users_df))

        existing_usernames = set(session.query(User.username).all())
        existing_usernames = {u[0] for u in existing_usernames}

        new_users_df = users_df[~users_df["username"].isin(existing_usernames)]

        if not new_users_df.empty:
            user_records = new_users_df.to_dict("records")
            session.bulk_insert_mappings(User, user_records)
            logger.info("Inserted %s new users", len(new_users_df))

    def _bulk_insert_places(self, session, places_df: pd.DataFrame):
        logger.info("Processing %s places", len(places_df))

        existing_place_ids = set(session.query(Place.id).all())
        existing_place_ids = {p[0] for p in existing_place_ids}

        new_places_df = places_df[~places_df["id"].isin(existing_place_ids)]
        existing_places_df = places_df[
            places_df["id"].isin(existing_place_ids)
        ]

        if not new_places_df.empty:
            new_places_clean = new_places_df.copy()
            new_places_clean["allows_pet"] = new_places_clean[
                "allows_pet"
            ].fillna(False)
            new_places_clean["pet_friendly"] = new_places_clean[
                "pet_friendly"
            ].fillna(False)
            new_places_clean["num_confirm"] = new_places_clean[
                "num_confirm"
            ].fillna(0)
            new_places_clean["num_deny"] = new_places_clean["num_deny"].fillna(
                0
            )

            place_records = new_places_clean.to_dict("records")
            session.bulk_insert_mappings(Place, place_records)
            logger.info("Inserted %s new places", len(new_places_clean))

        if not existing_places_df.empty:
            for _, place_data in existing_places_df.iterrows():
                session.query(Place).filter(
                    Place.id == place_data["id"]
                ).update(
                    {
                        "name": place_data["name"],
                        "address": place_data["address"],
                        "latitude": place_data["latitude"],
                        "longitude": place_data["longitude"],
                        "business_type": place_data["business_type"],
                        "google_maps_url": place_data.get("google_maps_url"),
                        "allows_pet": place_data.get("allows_pet", False),
                        "pet_friendly": place_data.get("pet_friendly", False),
                        "updated_at": datetime.utcnow(),
                    }
                )
            logger.info("Updated %s existing places", len(existing_places_df))

    def _bulk_insert_reviews(self, session, reviews_df: pd.DataFrame):
        logger.info("Processing %s pet-related reviews", len(reviews_df))

        users_query = session.query(User.username, User.id).all()
        users_map_df = pd.DataFrame(
            users_query, columns=["username", "user_id"]
        )

        reviews_with_ids = reviews_df.merge(
            users_map_df, on="username", how="inner"
        )

        if reviews_with_ids.empty:
            logger.warning("No reviews could be matched with users")
            return

        existing_reviews = session.query(Review.place_id, Review.user_id).all()
        existing_combinations = set(existing_reviews)

        def is_new_review(row):
            return (
                row["place_id"],
                row["user_id"],
            ) not in existing_combinations

        new_reviews_df = reviews_with_ids[
            reviews_with_ids.apply(is_new_review, axis=1)
        ]

        if not new_reviews_df.empty:
            review_records = new_reviews_df[
                ["place_id", "user_id", "username", "pet_friendly", "comment"]
            ].to_dict("records")

            session.bulk_insert_mappings(Review, review_records)
            logger.info("Inserted %s new reviews", len(review_records))
        else:
            logger.info("No new reviews to insert")

    def _update_place_confirmation_counts(self, session):
        reviews_query = session.query(
            Review.place_id, Review.pet_friendly, Review.created_at
        ).all()

        if not reviews_query:
            return

        reviews_agg_df = pd.DataFrame(
            reviews_query, columns=["place_id", "pet_friendly", "created_at"]
        )

        confirmation_counts = (
            reviews_agg_df.groupby("place_id")
            .agg(
                {
                    "pet_friendly": [
                        lambda x: (x is True).sum(),
                        lambda x: (x is False).sum(),
                        lambda x: x.any(),
                    ]
                }
            )
            .round(0)
            .astype(int)
        )

        confirmation_counts.columns = [
            "num_confirm",
            "num_deny",
            "has_positive",
        ]
        confirmation_counts = confirmation_counts.reset_index()

        latest_reviews = reviews_agg_df.loc[
            reviews_agg_df.groupby("place_id")["created_at"].idxmax()
        ][["place_id", "pet_friendly"]]

        latest_reviews["last_contribution_type"] = latest_reviews[
            "pet_friendly"
        ].map({True: "confirm", False: "deny"})

        place_updates = confirmation_counts.merge(
            latest_reviews[["place_id", "last_contribution_type"]],
            on="place_id",
        )

        for _, row in place_updates.iterrows():
            session.query(Place).filter(Place.id == row["place_id"]).update(
                {
                    "num_confirm": int(row["num_confirm"]),
                    "num_deny": int(row["num_deny"]),
                    "pet_friendly": bool(row["has_positive"]),
                    "last_contribution_type": row["last_contribution_type"],
                    "updated_at": datetime.utcnow(),
                }
            )

        logger.info(
            "Updated confirmation counts for %s places", len(place_updates)
        )
