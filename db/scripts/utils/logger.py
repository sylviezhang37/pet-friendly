import logging
import os
from datetime import datetime
from typing import Optional


class Logger:
    _instance: Optional["Logger"] = None
    _logger: Optional[logging.Logger] = None

    def __new__(cls) -> "Logger":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._setup_logger()
        return cls._instance

    def _setup_logger(self) -> None:
        logs_dir = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), "logs"
        )
        os.makedirs(logs_dir, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_file = os.path.join(logs_dir, f"db_operations_{timestamp}.log")

        self._logger = logging.getLogger("db_singleton")
        self._logger.setLevel(logging.INFO)

        if not self._logger.handlers:
            file_handler = logging.FileHandler(log_file)
            file_handler.setLevel(logging.INFO)

            console_handler = logging.StreamHandler()
            console_handler.setLevel(logging.INFO)

            formatter = logging.Formatter(
                "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            )
            file_handler.setFormatter(formatter)
            console_handler.setFormatter(formatter)

            self._logger.addHandler(file_handler)
            self._logger.addHandler(console_handler)

    def get_logger(self) -> logging.Logger:
        return self._logger

    def info(self, message: str, *args) -> None:
        self._logger.info(message, *args)

    def warning(self, message: str, *args) -> None:
        self._logger.warning(message, *args)

    def error(self, message: str, *args) -> None:
        self._logger.error(message, *args)

    def debug(self, message: str, *args) -> None:
        self._logger.debug(message, *args)

    def critical(self, message: str, *args) -> None:
        self._logger.critical(message, *args)


logger = Logger()
