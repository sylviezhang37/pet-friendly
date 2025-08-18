import time
import json
import os
from datetime import datetime
from typing import List

from .types import QueryConfig
from .api.places_api import PlacesAPI
from .database import DatabaseManager
from .utils.logger import logger
from .api.places_api import PlaceData, ReviewData


class PlacesDataSeeder:
    def __init__(
        self,
        api_key: str,
        db_connection_string: str,
        use_test_data: bool = False,
        backup_dir: str = "cleaned_data",
    ):
        self.places_api = PlacesAPI(api_key, use_test_data)
        self.database = DatabaseManager(db_connection_string)
        self.backup_dir = backup_dir
        os.makedirs(backup_dir, exist_ok=True)

    def run_query_batch(self, query_configs: List[QueryConfig]):
        all_places = set()
        all_reviews = set()

        for i, query_config in enumerate(query_configs, 1):
            logger.info(
                "Processing query %s/%s: %s",
                i,
                len(query_configs),
                query_config.get("name", "Unnamed"),
            )

            places, reviews = self.places_api.fetch_places_paginated(
                query_config
            )
            all_places.update(places)
            all_reviews.update(reviews)

            if i < len(query_configs):
                logger.info("\nWaiting before next query...")
                time.sleep(5)

        timestamp = self._save_data(all_places, all_reviews)
        self._load_and_insert(timestamp)

        return len(all_places), len(all_reviews)

    def _save_data(self, places, reviews):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        places_file = os.path.join(self.backup_dir, f"places_{timestamp}.json")
        reviews_file = os.path.join(
            self.backup_dir, f"reviews_{timestamp}.json"
        )

        with open(places_file, "w") as f:
            json.dump(
                [place.__dict__ for place in places], f, indent=2, default=str
            )

        with open(reviews_file, "w") as f:
            json.dump(
                [review.__dict__ for review in reviews],
                f,
                indent=2,
                default=str,
            )

        logger.info("Data saved to %s and %s", places_file, reviews_file)
        return timestamp

    def _load_and_insert(self, timestamp):
        places_file = os.path.join(self.backup_dir, f"places_{timestamp}.json")
        reviews_file = os.path.join(
            self.backup_dir, f"reviews_{timestamp}.json"
        )

        with open(places_file, "r") as f:
            places_data = json.load(f)

        with open(reviews_file, "r") as f:
            reviews_data = json.load(f)

        places = {PlaceData(**place) for place in places_data}
        reviews = {ReviewData(**review) for review in reviews_data}

        self.database.insert_data(places, reviews)
        logger.info(
            "Successfully inserted data: %s places, %s reviews",
            len(places),
            len(reviews),
        )
