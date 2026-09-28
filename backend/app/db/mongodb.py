import logging
from pymongo import MongoClient

from app.core.config import settings

logger = logging.getLogger(__name__)

_client: MongoClient | None = None


def get_client() -> MongoClient:
    global _client
    if _client is None:
        if not settings.MONGO_URI or "<cluster>" in settings.MONGO_URI or "<username>" in settings.MONGO_URI:
            raise ValueError(
                "MONGO_URI contains placeholder values (<cluster>, <username>, <password>). "
                "Please update MONGO_URI in .env with your actual MongoDB connection string."
            )
        _client = MongoClient(
            settings.MONGO_URI,
            serverSelectionTimeoutMS=5000,
        )
    return _client


def get_database():
    return get_client()[settings.MONGO_DB_NAME]


def test_connection():
    client = get_client()
    client.admin.command("ping")
    return True


class _LazyCollection:
    def __init__(self, name: str):
        self._name = name

    def __getattr__(self, item):
        return getattr(get_database()[self._name], item)

    def __getitem__(self, item):
        return get_database()[self._name][item]


documents_collection = _LazyCollection("documents")
conversations_collection = _LazyCollection("conversations")
messages_collection = _LazyCollection("messages")