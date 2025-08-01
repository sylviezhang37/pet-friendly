from .ai_analysis import analyze_pet_friendliness
from .gemini_setup import setup_gemini_api
from ..utils.logger import logger
from ..utils.text_utils import is_possible_pet_related


class TextAnalyzer:
    def __init__(self):
        self._model = None

    def _get_model(self):
        if self._model is None:
            self._model = setup_gemini_api()
        return self._model

    def is_pet_related(self, review: str) -> bool:
        # Quick filter first - if no pet keywords, skip expensive AI call
        if not is_possible_pet_related(review):
            return False
            
        try:
            result = analyze_pet_friendliness(review, self._get_model())
            return result.get("is_pet_related", False)
        except Exception as e:
            logger.error(f"Pet related analysis failed: {e}")
            return False

    def is_pet_friendly(self, review: str) -> bool:
        try:
            result = analyze_pet_friendliness(review, self._get_model())
            pet_friendly_value = result.get("is_pet_friendly")

            # Handle null case - if unclear, default to True if pet_related
            if pet_friendly_value is None:
                return result.get("is_pet_related", False)

            return pet_friendly_value
        except Exception as e:
            logger.error(f"Pet friendly analysis failed: {e}")
            return False
