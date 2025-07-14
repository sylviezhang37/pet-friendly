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

    query_configs: list[QueryConfig] = [
        {
            "name": "Pet-friendly restaurants NYC",
            "textQuery": "pet friendly restaurants in new york city",
            "includedType": "restaurant",
        },
    ]

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
