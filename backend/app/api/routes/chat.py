from app.services.chat_db_service import get_user_conversations
import logging
import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.security import get_current_user
from app.services.rag_service import generate_rag_response
from app.services.chat_db_service import (
    create_conversation,
    get_user_conversation,
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
def chat(
    request: ChatRequest,
    current_user=Depends(get_current_user),
):

    user_id = str(current_user["_id"])

    # --------------------------------
    # Get or create conversation
    # --------------------------------

    if request.conversation_id:
        conversation = get_user_conversation(
            conversation_id=request.conversation_id,
            user_id=user_id,
        )

        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found",
            )

        conversation_id = request.conversation_id
    else:
        title = request.question.strip()
        if len(title) > 42:
            title = title[:42] + "..."
        conversation_id = create_conversation(
            user_id=user_id,
            title=title,
        )

    # --------------------------------
    # Get previous messages
    # --------------------------------

    messages = get_conversation_messages(
        conversation_id
    )

    history = format_conversation_history(
        messages
    )

    # --------------------------------
    # Rewrite question
    # --------------------------------

    search_query = rewrite_question(
        question=request.question,
        conversation_history=history,
    )

    # --------------------------------
    # RAG
    # --------------------------------

    result = generate_rag_response(
        question=search_query,
        user_id=user_id,
        top_k=request.top_k,
    )

    # --------------------------------
    # Save user message
    # --------------------------------

    save_message(
        conversation_id=conversation_id,
        role="user",
        content=request.question,
    )

    # --------------------------------
    # Save AI response
    # --------------------------------

    save_message(
        conversation_id=conversation_id,
        role="assistant",
        content=result["answer"],
        sources=result["sources"],
    )

    from app.services.chat_db_service import update_conversation_timestamp
    update_conversation_timestamp(conversation_id)

    return {
        "conversation_id": conversation_id,
        "question": request.question,
        "search_query": search_query,
        "answer": result["answer"],
        "sources": result["sources"],
    }

@router.get("/history")
def get_chat_history(
    current_user=Depends(get_current_user),
):
    user_id = str(current_user["_id"])

    conversations = get_user_conversations(
        user_id
    )

    return [
        {
            "id": str(conversation["_id"]),
            "title": conversation.get("title", "Consultation"),
            "created_at": conversation.get("created_at"),
            "updated_at": conversation.get("updated_at"),
        }
        for conversation in conversations
    ]

@router.get("/{conversation_id}/messages")
def get_messages(
    conversation_id: str,
    current_user=Depends(get_current_user),
):
    user_id = str(current_user["_id"])
    conversation = get_user_conversation(conversation_id, user_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = get_conversation_messages(conversation_id, limit=50)

    return [
        {
            "role": m.get("role"),
            "content": m.get("content"),
            "sources": m.get("sources", []),
            "timestamp": m.get("created_at").strftime("%H:%M") if m.get("created_at") else None,
        }
        for m in messages
    ]
    
    