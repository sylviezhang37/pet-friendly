from datetime import datetime
from typing import List, Dict, Tuple
import os
import json
import time
import logging
import requests

from .types import QueryConfig
from .utils import (
    clean_username,
    determine_pet_friendly_sentiment,
    is_pet_related,
)

logger = logging.getLogger(__name__)


class PlacesAPI:
    def __init__(self, api_key: str, use_test_data: bool = False):
        self.api_key = api_key
        self.use_test_data = use_test_data
        self.base_url = "https://places.googleapis.com/v1/places:searchText"
        self.fields = [
            "places.id",
            "places.displayName",
            "places.allowsDogs",
            "places.types",
            "places.formattedAddress",
            "places.location",
            "places.reviews",
            "nextPageToken",
        ]

    def fetch_places_paginated(
        self, query_config: QueryConfig
    ) -> Tuple[List[Dict], List[Dict]]:
        all_places = []
        all_reviews = []
        next_page_token = None
        page_count = 0

        logger.info(
            "Fetching data for query: %s",
            query_config.get("textQuery", "Unknown"),
        )

        while True:
            if self.use_test_data:
                with open(
                    os.path.join(os.path.dirname(__file__), "test.json"), "r"
                ) as f:
                    data = json.load(f)
            else:
                payload = {"textQuery": query_config["textQuery"]}

                if "includedType" in query_config:
                    payload["includedType"] = query_config["includedType"]

                if "locationBias" in query_config:
                    payload["locationBias"] = query_config["locationBias"]

                if next_page_token:
                    payload["pageToken"] = next_page_token

                response = requests.post(
                    f"{self.base_url}?fields={','.join(self.fields)}",
                    headers={
                        "X-Goog-Api-Key": self.api_key,
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    json=payload,
                    timeout=10,
                )

                response.raise_for_status()
                data = response.json()

            page_count += 1
            logger.info("Fetched page %s", page_count)

            if "places" in data:
                for place in data["places"]:
                    place_data = self._extract_place_data(place)
                    all_places.append(place_data)

                    if "reviews" in place:
                        for review in place["reviews"]:
                            review_data = self._extract_review_data(
                                review, place["id"]
                            )

                            if review_data["is_pet_related"]:
                                all_reviews.append(review_data)

            next_page_token = data.get("nextPageToken")
            if not next_page_token:
                break

            time.sleep(2.5)

        logger.info(
            "Completed fetching: %s places, %s reviews",
            len(all_places),
            len(all_reviews),
        )
        return all_places, all_reviews

    def _extract_place_data(self, place: Dict) -> Dict:
        """Extract and normalize place data"""
        return {
            "id": place.get("id"),
            "name": place.get("displayName", {}).get("text"),
            "address": place.get("formattedAddress"),
            "latitude": place.get("location", {}).get("latitude"),
            "longitude": place.get("location", {}).get("longitude"),
            "business_type": self._get_primary_business_type(
                place.get("types", [])
            ),
            "google_maps_url": place.get("googleMapsUri"),
            "allows_pet": place.get("allowsDogs"),
            "pet_friendly": place.get("allowsDogs", False),
            "num_confirm": 0,
            "num_deny": 0,
            "last_contribution_type": None,
        }

    def _extract_review_data(self, review: Dict, place_id: str) -> Dict:
        """Extract and normalize review data"""
        review_text = review.get("text", {}).get("text", "")
        author_name = review.get("authorAttribution", {}).get(
            "displayName", ""
        )

        username = clean_username(author_name)
        email = f"{username}@email.com"

        return {
            "place_id": place_id,
            "username": username,
            "email": email,
            "pet_friendly": determine_pet_friendly_sentiment(review_text),
            "comment": review_text,
            "is_pet_related": is_pet_related(review_text),
            "fetched_at": datetime.now(),
        }

    def _get_primary_business_type(self, types: List[str]) -> str:
        return types[0] if types else "establishment"
