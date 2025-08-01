import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from ..ai.ai_analysis import analyze_pet_friendliness
from ..ai.gemini_setup import setup_gemini_api
from ..utils.logger import logger


def test_connection(model):
    try:
        response = model.generate_content("Say hello")
        logger.info("Gemini API connection successful")
        logger.info(f"Test response: {response.text}")
        return True
    except Exception as e:
        logger.error(f"API connection failed: {e}")
        return False


def test_sample_reviews():
    test_reviews = [
        "Great food and they brought water for my dog!",
        "Love this place, very dog-friendly staff",
        "They asked us to leave because of our pet",
        "Amazing pizza, will definitely come back",
        "No pets allowed but the food was decent",
        "My puppy loved the outdoor seating area",
    ]

    try:
        model = setup_gemini_api()
        if not test_connection(model):
            return

        logger.info("Testing AI analysis on sample reviews:")

        for i, review in enumerate(test_reviews, 1):
            logger.info(f"\n--- Test {i} ---")
            logger.info(f"Review: {review}")
            result = analyze_pet_friendliness(review, model)
            logger.info(f"Result: {result}")

    except Exception as e:
        logger.error(f"Test failed: {e}")


if __name__ == "__main__":
    test_sample_reviews()
