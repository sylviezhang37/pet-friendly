import os
from dotenv import load_dotenv
from scripts.seeder import PlacesDataSeeder
from scripts.types import QueryConfig
from scripts.utils.constants import BOROUGHS
from scripts.utils.logger import logger

load_dotenv()


def generate_grid_queries() -> list[QueryConfig]:
    queries = []
    boroughs = BOROUGHS
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
                                    "radius": 1000,
                                }
                            },
                        }
                    )
                lng += grid_size
            lat += grid_size

    return queries


def main():
    API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
    DB_CONNECTION = os.getenv("DATABASE_URL")

    if not API_KEY:
        raise ValueError(
            "GOOGLE_MAPS_API_KEY environment variable is required"
        )

    query_configs = generate_grid_queries()

    seeder = PlacesDataSeeder(API_KEY, DB_CONNECTION, use_test_data=True)
    seeder.database.verify_extensions()

    try:
        total_places, total_reviews = seeder.run_query_batch(query_configs)
        logger.info(f"Seeded: {total_places} places, {total_reviews} reviews")
    except Exception as e:
        logger.error(f"Seeding failed: {str(e)}")
        raise


if __name__ == "__main__":
    main()
