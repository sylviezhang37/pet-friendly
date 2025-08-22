import re
import time
from typing import Set

PET_RELATED_WORDS: Set[str] = {
    "dog",
    "dogs",
    "puppy",
    "puppies",
    "canine",
    "pup",
    "pups",
    "cat",
    "cats",
    "kitten",
    "kittens",
    "feline",
    "kitty",
    "pet",
    "pets",
    "animal",
    "animals",
    "leash",
    "collar",
    "harness",
    "treats",
    "food",
    "bowl",
    "bark",
    "barking",
    "meow",
    "meowing",
    "fur",
    "paws",
    "tail",
    "veterinarian",
    "vet",
    "groomer",
    "grooming",
    "petfriendly",
    "pet-friendly",
    "dogfriendly",
    "dog-friendly",
    "catfriendly",
    "cat-friendly",
    "furry",
    "furball",
}

PET_RELATED_PHRASES: Set[str] = {
    "bring my dog",
    "brought my dog",
    "with my dog",
    "my dog loved",
    "dog friendly",
    "pet friendly",
    "pets welcome",
    "dogs welcome",
    "cats allowed",
    "pets allowed",
    "dog park",
    "dog run",
    "pet store",
    "pet shop",
    "animal hospital",
    "vet clinic",
    "dog walker",
    "pet sitter",
    "dog grooming",
    "cat grooming",
    "service animal",
    "emotional support",
    "therapy dog",
    "no pets",
    "no dogs",
    "no cats",
    "pets not allowed",
    "dogs not allowed",
    "cats not allowed",
}


def is_possible_pet_related(text: str) -> bool:
    """
    Quick check to see if text might be pet-related before expensive AI analysis.
    Returns True if the text contains any pet-related words or phrases.
    """
    if not text:
        return False

    text_lower = text.lower()
    return contains_pet_phrases(text_lower) or contains_pet_words(text_lower)


def contains_pet_phrases(text: str) -> bool:
    """Check if text contains any pet-related phrases."""
    return any(phrase in text for phrase in PET_RELATED_PHRASES)


def contains_pet_words(text: str) -> bool:
    """Check if text contains any pet-related words."""
    words = re.findall(r"\b\w+\b", text.lower())
    return any(word in PET_RELATED_WORDS for word in words)


def clean_username(author_name: str) -> str:
    """Clean and normalize author names for usernames."""
    if not author_name:
        return f"user_{int(time.time())}"

    username = re.sub(r"[^a-zA-Z0-9\s]", "", author_name.lower())
    username = re.sub(r"\s+", "_", username.strip())

    if not username:
        username = f"user_{int(time.time())}"

    return username[:25]
