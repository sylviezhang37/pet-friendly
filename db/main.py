import os
import logging
from dotenv import load_dotenv
from scripts.seeder import PlacesDataSeeder
from scripts.types import QueryConfig

load_dotenv()

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def generate_grid_queries() -> list[QueryConfig]:
    boroughs = {
        "Manhattan": {
            "bounds": {
                "north": 40.8176,
                "south": 40.7009,
                "east": -73.9442,
                "west": -74.0479,
            },
            "grid_size": 0.035,
        },
        # "Brooklyn": {
        #     "bounds": {
        #         "north": 40.7394,
        #         "south": 40.5755,
        #         "east": -73.8336,
        #         "west": -74.0421,
        #     },
        #     "grid_size": 0.05
        # },
        # "Queens": {
        #     "bounds": {
        #         "north": 40.7958,
        #         "south": 40.5434,
        #         "east": -73.7004,
        #         "west": -73.9626,
        #     },
        #     "grid_size": 0.05
        # },
        # "Bronx": {
        #     "bounds": {
        #         "north": 40.9176,
        #         "south": 40.7854,
        #         "east": -73.7654,
        #         "west": -73.9339,
        #     },
        #     "grid_size": 0.05
        # },
    }

    queries = []
    radius = 1500.0
    place_types = ["restaurant", "bar", "cafe"]

    for borough, data in boroughs.items():
        bounds = data["bounds"]
        grid_size = data["grid_size"]

        lat = bounds["south"]
        while lat <= bounds["north"]:
            lng = bounds["west"]
            while lng <= bounds["east"]:
                for place_type in place_types:
                    queries.append(
                        {
                            "name": f"Pet-friendly {place_type}s in {borough} - Grid {len(queries)+1}",
                            "textQuery": f"pet friendly {place_type}",
                            "includedType": place_type,
                            "locationBias": {
                                "circle": {
                                    "center": {
                                        "latitude": lat,
                                        "longitude": lng,
                                    },
                                    "radius": radius,
                                }
                            },
                        }
                    )
                lng += grid_size
            lat += grid_size

    return queries


def main():
    API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
    DB_CONNECTION = os.getenv(
        "DATABASE_URL",
        # "postgresql://postgres:password@localhost:5432/petfriendly",
        "postgresql://sylvie@localhost:5432/pf_test_db",
    )

    if not API_KEY:
        raise ValueError(
            "GOOGLE_MAPS_API_KEY environment variable is required"
        )

    query_configs = generate_grid_queries()

    seeder = PlacesDataSeeder(API_KEY, DB_CONNECTION)
    seeder.database.verify_extensions()

    try:
        total_places, total_reviews = seeder.run_query_batch(query_configs)
        logger.info(
            "Seeding completed. Total: %s places, %s reviews",
            total_places,
            total_reviews,
        )
    except Exception as e:
        logger.error("Seeding failed: %s", str(e))
        raise


if __name__ == "__main__":
    main()
