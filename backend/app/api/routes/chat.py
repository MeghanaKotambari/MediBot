import logging
import uuid
from fastapi import APIRouter
from pydantic import BaseModel

from app.services.rag_service import generate_rag_response
from app.services.chat_db_service import (
    create_conversation,
    save_message,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


class ChatRequest(BaseModel):
    question: str
    top_k: int = 3
    conversation_id: str | None = None


@router.post("/")
def chat(request: ChatRequest):

    conversation_id = request.conversation_id

    if not conversation_id:
        try:
            conversation_id = create_conversation()
        except Exception as e:
            logger.warning("Could not create conversation in MongoDB: %s. Generating fallback ID.", e)
            conversation_id = str(uuid.uuid4())

    result = generate_rag_response(
        question=request.question,
        top_k=request.top_k,
    )

    try:
        save_message(
            conversation_id=conversation_id,
            role="user",
            content=request.question,
        )

        save_message(
            conversation_id=conversation_id,
            role="assistant",
            content=result["answer"],
            sources=result["sources"],
        )
    except Exception as e:
        logger.warning("Could not save messages to MongoDB: %s", e)

    return {
        "conversation_id": conversation_id,
        "answer": result["answer"],
        "sources": result["sources"],
    }