from datetime import datetime, timezone

from bson import ObjectId

from app.db.mongodb import (
    conversations_collection,
    messages_collection,
)


def create_conversation(user_id: str, title: str = "New conversation"):

    conversation = {
        "user_id": ObjectId(user_id),
        "title": title,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    result = conversations_collection.insert_one(
        conversation
    )

    return str(result.inserted_id)


def update_conversation_timestamp(conversation_id: str):
    try:
        conv_id = ObjectId(conversation_id)
        conversations_collection.update_one(
            {"_id": conv_id},
            {"$set": {"updated_at": datetime.now(timezone.utc)}},
        )
    except Exception:
        pass


def get_user_conversation(
    conversation_id: str,
    user_id: str,
):
    try:
        conv_id = ObjectId(conversation_id)
        u_id = ObjectId(user_id)
    except Exception:
        return None

    return conversations_collection.find_one(
        {
            "_id": conv_id,
            "user_id": u_id,
        }
    )


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

        history.append(
            f"{message['role'].upper()}: "
            f"{message['content']}"
        )

    return "\n".join(history)
def get_user_conversations(
    user_id: str,
):

    conversations = conversations_collection.find(
        {
            "user_id": ObjectId(user_id)
        }
    ).sort(
        "updated_at",
        -1
    )

    return list(conversations)