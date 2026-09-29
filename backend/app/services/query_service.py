import logging
from app.services.llm_service import client, FALLBACK_MODELS
from app.core.config import settings

logger = logging.getLogger(__name__)


def rewrite_question(
    question: str,
    conversation_history: str,
) -> str:

    if not conversation_history:
        return question

    prompt = f"""
You are a question rewriting system for a medical
knowledge retrieval application.

Conversation history:

{conversation_history}

Current question:

{question}

Rewrite the current question into a standalone
search query that can be understood without the
conversation history.

Do not answer the question.

Return ONLY the rewritten question.
"""

    candidate_models = [settings.GEMINI_LLM_MODEL]
    for model in FALLBACK_MODELS:
        if model not in candidate_models:
            candidate_models.append(model)

    for model_name in candidate_models:
        try:
            chat = client.chats.create(model=model_name)
            response = chat.send_message(prompt)
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            logger.warning("Query rewrite failed with model %s: %s", model_name, e)
            continue

    logger.warning("All models failed to rewrite question. Falling back to original question.")
    return question