import json
from typing import Dict, Any
from .gemini_setup import setup_gemini_api
from ..utils.logger import logger

PROMPT = """
            You are an expert at analyzing business reviews for pet-related information.

            Analyze the following review text and determine:
            1. Whether the review mentions pets or pet-related topics
            2. Whether the review indicates the place is pet-friendly or pet-unfriendly
            3. If unclear, mark as null rather than guessing

            Review Text: "{review}"

            Response Requirements:
            - Return ONLY valid JSON
            - No additional text or explanation outside the JSON
            - Use null for uncertain cases

            Expected JSON format:
            {{
                "is_pet_related": boolean,
                "is_pet_friendly": boolean or null,
                "confidence": "high" | "medium" | "low",
                "reasoning": "brief explanation of decision"
            }}

            Examples:
            - "Dogs are welcome on the patio" → pet_related: true, pet_friendly: true
            - "No pets allowed inside" → pet_related: true, pet_friendly: false  
            - "Great food and service" → pet_related: false, pet_friendly: null
        """


def analyze_pet_friendliness(review: str, model=None) -> Dict[str, Any]:
    if model is None:
        model = setup_gemini_api()

    try:
        response = model.generate_content(
            PROMPT.format(review=review),
            generation_config={
                "temperature": 0.1,
                "response_mime_type": "application/json",
            },
        )
        result = parse_response(response.text)
        logger.info(f"AI analysis: {result}")
        return result
    except Exception as e:
        logger.error(f"AI analysis failed: {e}")
        return create_error_response("Error occurred")


def create_error_response(reason: str) -> Dict[str, Any]:
    return {
        "is_pet_related": False,
        "is_pet_friendly": False,
        "confidence": "low",
        "reasoning": reason,
    }


def parse_response(response_text: str) -> Dict[str, Any]:
    try:
        cleaned = response_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        return json.loads(cleaned.strip())
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse response: {e}")
        return create_error_response("Parse error")
