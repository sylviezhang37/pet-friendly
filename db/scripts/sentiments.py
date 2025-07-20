import time
import re
from .utils.constants import (
    NEGATIVE_PHRASES,
    EXCLUSION_KEYWORDS,
    PET_RELATED_WORDS,
    PET_RELATED_PHRASES,
)


def is_pet_friendly(text: str) -> bool:
    if not text or any(phrase in text.lower() for phrase in NEGATIVE_PHRASES):
        return False
    return True


def is_pet_related(text: str) -> bool:
    if not text or contains_exclusion_keywords(text):
        return False

    text_lower = text.lower()
    return contains_pet_phrases(text_lower) or contains_pet_words(text_lower)


def contains_exclusion_keywords(text: str) -> bool:
    return any(keyword in text for keyword in EXCLUSION_KEYWORDS)


def contains_pet_phrases(text: str) -> bool:
    return any(phrase in text for phrase in PET_RELATED_PHRASES)


def contains_pet_words(text: str) -> bool:
    # Split on whitespace and remove punctuation for better word matching
    words = re.findall(r"\b\w+\b", text.lower())
    return any(word in PET_RELATED_WORDS for word in words)


def clean_username(author_name: str) -> str:
    if not author_name:
        return f"user_{int(time.time())}"

    username = re.sub(r"[^a-zA-Z0-9\s]", "", author_name.lower())
    username = re.sub(r"\s+", "_", username.strip())

    if not username:
        username = f"user_{int(time.time())}"

    return username[:25]
