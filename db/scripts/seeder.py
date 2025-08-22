import time
import json
import os
from datetime import datetime
from typing import List
import glob

from .places_api import PlacesAPI, PlaceData, ReviewData
from .db import DatabaseManager
from .common.types import QueryConfig
from .common.logger import logger


class DataSeeder:
    def __init__(
        self,
        api_key: str,
        db_connection_string: str,
        use_test_data: bool = False,
        backup_dir: str = "cleaned_data",
        processed_dir: str = "processed_data",
    ):
        self.places_api = PlacesAPI(api_key, use_test_data)
        self.database = DatabaseManager(db_connection_string)
        self.backup_dir = backup_dir
        self.processed_dir = processed_dir
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

        self.generate_data_files(all_places, all_reviews)
        self.load_and_insert_from_files()

        return len(all_places), len(all_reviews)

    def generate_data_files(self, places, reviews):
        file_num = self._get_next_file_number()
        places_file = os.path.join(self.backup_dir, f"places_{file_num}.json")
        reviews_file = os.path.join(
            self.backup_dir, f"reviews_{file_num}.json"
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

    def load_and_insert_from_files(self):
        places_files = glob.glob(
            os.path.join(self.backup_dir, "places_*.json")
        )
        reviews_files = glob.glob(
            os.path.join(self.backup_dir, "reviews_*.json")
        )

        total_places = 0
        total_reviews = 0

        # process each pair of files
        file_pairs = zip(sorted(places_files), sorted(reviews_files))

        for places_file, reviews_file in file_pairs:
            try:
                with open(places_file, "r") as f:
                    places_data = json.load(f)
                    places = {PlaceData(**place) for place in places_data}

                with open(reviews_file, "r") as f:
                    reviews_data = json.load(f)
                    reviews = {ReviewData(**review) for review in reviews_data}

                self.database.insert_data(places, reviews)

                total_places += len(places)
                total_reviews += len(reviews)

                logger.info(
                    "File batch inserted: %s (%s places), %s (%s reviews)",
                    os.path.basename(places_file),
                    len(places),
                    os.path.basename(reviews_file),
                    len(reviews),
                )
                break

            except Exception as e:
                logger.error("File batch failed: %s", str(e))
                raise

        logger.info(
            "Successfully inserted all data: %s places, %s reviews",
            total_places,
            total_reviews,
        )

    def _get_next_file_number(self):
        file_num = 0
        while os.path.exists(
            os.path.join(self.processed_dir, f"places_{file_num}.json")
        ):
            file_num += 1
        return file_num
