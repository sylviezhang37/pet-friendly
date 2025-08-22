from .ai_analysis import analyze_pet_friendliness
from .gemini_setup import setup_gemini_api
from ..common.logger import logger
from ..common.text_utils import is_possible_pet_related


class TextAnalyzer:
    def __init__(self):
        self._model = None

    def _get_model(self):
        if self._model is None:
            self._model = setup_gemini_api()
        return self._model

    def is_pet_related(self, review: str) -> bool:
        # if no pet keywords, skip AI calls to reduce cost
        return is_possible_pet_related(review)

    def is_pet_friendly(self, review: str) -> bool:
        try:
            result = analyze_pet_friendliness(review, self._get_model())
            pet_friendly_value = result.get("is_pet_friendly")

            if pet_friendly_value is None:
                return result.get("is_pet_related", False)

            return pet_friendly_value
        except Exception as e:
            logger.error(f"Pet friendly analysis failed: {e}")
            return False
