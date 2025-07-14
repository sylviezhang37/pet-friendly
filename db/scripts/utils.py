import time
import re


def clean_username(author_name: str) -> str:
    if not author_name:
        return f"user_{int(time.time())}"

    username = re.sub(r"[^a-zA-Z0-9\s]", "", author_name.lower())
    username = re.sub(r"\s+", "_", username.strip())

    if not username:
        username = f"user_{int(time.time())}"

    return username[:25]


def determine_pet_friendly_sentiment(text: str) -> bool:
    if not text:
        return True

    text_lower = text.lower()

    negative_phrases = [
        "not pet friendly",
        "no pets",
        "no dogs",
        "pets not allowed",
        "don't allow pets",
        "pets aren't allowed",
        "not allowed",
        "refused",
        "kicked out",
        "asked to leave",
    ]

    if any(phrase in text_lower for phrase in negative_phrases):
        return False

    if is_pet_related(text):
        return True

    return True


def is_pet_related(text: str) -> bool:
    """Check if review text contains pet-related keywords"""
    if not text:
        return False

    pet_keywords = {
        "dog",
        "dogs",
        "puppy",
        "pup",
        "canine",
        "cat",
        "cats",
        "kitten",
        "feline",
        "pet",
        "pets",
        "animal",
        "animals",
        "leash",
        "pet-friendly",
        "pet friendly",
        "bring your dog",
        "dog menu",
        "pup cup",
    }

    text_lower = text.lower()
    return any(keyword in text_lower for keyword in pet_keywords)
