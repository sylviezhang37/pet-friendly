import time
import logging
from typing import List

from .types import QueryConfig
from .places_api import PlacesAPI
from .database import DatabaseManager

logger = logging.getLogger(__name__)


class PlacesDataSeeder:
    def __init__(
        self,
        api_key: str,
        db_connection_string: str,
        use_test_data: bool = False,
    ):
        self.places_api = PlacesAPI(api_key, use_test_data)
        self.database = DatabaseManager(db_connection_string)

    def run_query_batch(self, query_configs: List[QueryConfig]):
        all_places = []
        all_reviews = []

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
            all_places.extend(places)
            all_reviews.extend(reviews)

            print("breaking...!")
            break

            if i < len(query_configs):
                logger.info("Waiting before next query...")
                time.sleep(5)

        self.database.insert_data(all_places, all_reviews)

        return len(all_places), len(all_reviews)
