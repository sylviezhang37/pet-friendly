import os
from dotenv import load_dotenv
from ..common.logger import logger
import google.generativeai as genai


def setup_gemini_api(api_key=None):
    load_dotenv()

    if api_key is None:
        api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("GEMINI_API_KEY required")

    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-2.5-pro")
