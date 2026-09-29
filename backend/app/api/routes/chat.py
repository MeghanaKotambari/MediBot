import logging
import uuid
from fastapi import APIRouter
from pydantic import BaseModel

from app.services.rag_service import generate_rag_response
from app.services.chat_db_service import (
    create_conversation,
    save_message,
)
from app.services.chat_db_service import (
    create_conversation,
    save_message,
    get_conversation_messages,
    format_conversation_history,
)

from app.services.query_service import (
    rewrite_question,
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
        conversation_id = create_conversation()

    # Get conversation history
    messages = get_conversation_messages(
        conversation_id
    )

    history = format_conversation_history(
        messages
    )

    # Rewrite follow-up question
    search_query = rewrite_question(
        question=request.question,
        conversation_history=history,
    )

    # Run RAG using rewritten query
    result = generate_rag_response(
        question=search_query,
        top_k=request.top_k,
    )

    # Save user message
    save_message(
        conversation_id=conversation_id,
        role="user",
        content=request.question,
    )

    # Save assistant message
    save_message(
        conversation_id=conversation_id,
        role="assistant",
        content=result["answer"],
        sources=result["sources"],
    )

    return {
        "conversation_id": conversation_id,
        "question": request.question,
        "search_query": search_query,
        "answer": result["answer"],
        "sources": result["sources"],
    }

    