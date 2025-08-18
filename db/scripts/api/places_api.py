from typing import List, Dict, Set, Tuple
import os
import json
import time
import requests
from dataclasses import dataclass

from ..types import QueryConfig
from ..utils.text_utils import clean_username
from ..ai.text_analyzer import TextAnalyzer

from ..utils.logger import logger


@dataclass(frozen=True)
class PlaceData:
    id: str
    name: str
    address: str
    latitude: float
    longitude: float
    business_type: str
    google_maps_url: str
    allows_pet: bool
    pet_friendly: bool
    num_confirm: int
    num_deny: int
    last_contribution_type: str

    def __hash__(self):
        return hash(self.id)


@dataclass(frozen=True)
class UserData:
    username: str
    email: str

    def __hash__(self):
        return hash(self.username)


@dataclass(frozen=True)
class ReviewData:
    place_id: str
    username: str
    email: str
    pet_friendly: bool
    comment: str
    is_pet_related: bool

    def __hash__(self):
        return hash((self.place_id, self.username))


class PlacesAPI:
    def __init__(self, api_key: str, use_test_data: bool = False):
        self.api_key = api_key
        self.use_test_data = use_test_data
        self.text_analyzer = TextAnalyzer()
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
    ) -> Tuple[Set[PlaceData], Set[ReviewData]]:
        all_places = set()
        all_reviews = set()
        next_page_token = None
        page_count = 0

        logger.info(
            "Fetching data for query: %s",
            query_config.get("textQuery", "Unknown"),
        )

        while True:
            if self.use_test_data:
                with open(
                    os.path.join(
                        os.path.dirname(__file__), "../tests/sample.json"
                    ),
                    "r",
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
                    all_places.add(place_data)

                    if "reviews" in place:
                        for review in place["reviews"]:
                            pet_related_review = (
                                self._extract_pet_related_review_data(
                                    review, place["id"]
                                )
                            )

                            if pet_related_review:
                                all_reviews.add(pet_related_review)
                                # Break after first pet-related review for testing
                                return all_places, all_reviews

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

    def _extract_place_data(self, place: Dict) -> PlaceData:
        google_id = place.get("id")
        return PlaceData(
            id=google_id,
            name=place.get("displayName", {}).get("text"),
            address=place.get("formattedAddress"),
            latitude=place.get("location", {}).get("latitude"),
            longitude=place.get("location", {}).get("longitude"),
            business_type=self._get_primary_business_type(
                place.get("types", [])
            ),
            google_maps_url=f"https://www.google.com/maps/place/?q=place_id:{google_id}",
            allows_pet=place.get("allowsDogs", False),
            pet_friendly=place.get("allowsDogs", False),
            num_confirm=0,
            num_deny=0,
            last_contribution_type=None,
        )

    def _extract_pet_related_review_data(
        self, review: Dict, place_id: str
    ) -> ReviewData | None:
        review_text = review.get("text", {}).get("text", "")
        if not self.text_analyzer.is_pet_related(review_text):
            return None

        author_name = review.get("authorAttribution", {}).get(
            "displayName", ""
        )
        username = clean_username(author_name)

        return ReviewData(
            place_id=place_id,
            username=username,
            email=f"{username}@email.com",
            pet_friendly=self.text_analyzer.is_pet_friendly(review_text),
            comment=review_text,
            is_pet_related=True,
        )

    def _get_primary_business_type(self, types: List[str]) -> str:
        return types[0] if types else "establishment"
