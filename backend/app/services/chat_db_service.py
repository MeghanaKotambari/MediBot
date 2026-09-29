from datetime import datetime, timezone

from bson import ObjectId

from app.db.mongodb import (
    conversations_collection,
    messages_collection,
)


def create_conversation(
    user_id: str = "anonymous",
):

    conversation = {
        "user_id": user_id,
        "title": "New conversation",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    result = conversations_collection.insert_one(
        conversation
    )

    return str(result.inserted_id)


def save_message(
    conversation_id: str,
    role: str,
    content: str,
    sources: list | None = None,
):

    try:
        conv_id = ObjectId(conversation_id)
    except Exception:
        conv_id = conversation_id

    message = {
        "conversation_id": conv_id,
        "role": role,
        "content": content,
        "sources": sources or [],
        "created_at": datetime.now(timezone.utc),
    }

    result = messages_collection.insert_one(
        message
    )

    return str(result.inserted_id)

def get_conversation_messages(
    conversation_id: str,
    limit: int = 10,
):
    messages = messages_collection.find(
        {
            "conversation_id": ObjectId(
                conversation_id
            )
        }
    ).sort(
        "created_at",
        1
    ).limit(limit)

    return list(messages)

def format_conversation_history(
    messages: list,
) -> str:

    history = []

    for message in messages:

        role = message["role"]
        content = message["content"]

        history.append(
            f"{role.upper()}: {content}"
        )

    return "\n".join(history)