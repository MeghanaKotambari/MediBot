import logging
from google import genai
from google.genai.errors import APIError
from fastapi import HTTPException

from app.core.config import settings

logger = logging.getLogger(__name__)

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)

# Ordered list of models to try if the primary model is unavailable or overloaded
FALLBACK_MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.8-flash",
    "gemini-3.6-flash",
]


def generate_answer(
    question: str,
    context: str,
) -> str:

    prompt = f"""
You are a medical knowledge and education assistant.

Answer the user's question using ONLY the provided sources.

IMPORTANT RULES:

1. Use only information contained in the provided sources.
2. Do not invent or hallucinate information.
3. Every factual claim should be supported by a source.
4. Cite sources using [Source 1], [Source 2], etc.
5. Only cite a source when it actually supports the claim.
6. Do not create source numbers that are not provided.
7. If the provided sources do not contain enough information,
   clearly say that the documents do not contain enough information.
8. Do not diagnose the user.
9. Do not prescribe medication.
10. Do not provide personalized treatment plans.
11. Keep the answer educational and clear.
12. Do not claim to be a doctor.

SOURCE MATERIAL:
----------------------------

{context}

----------------------------

USER QUESTION:

{question}

----------------------------

Answer the question using the source material.

Include citations such as [Source 1] or [Source 2]
after the relevant statements.
"""

    # Build unique candidate models list starting with configured model
    candidate_models = [settings.GEMINI_LLM_MODEL]
    for model in FALLBACK_MODELS:
        if model not in candidate_models:
            candidate_models.append(model)

    last_error = None
    for model_name in candidate_models:
        try:
            # Using client.chats.create avoids direct AFC warning on Models.generate_content
            chat = client.chats.create(model=model_name)
            response = chat.send_message(prompt)
            if response and response.text:
                return response.text
        except APIError as e:
            logger.warning("Gemini model %s failed with status %s: %s", model_name, getattr(e, "code", None), e)
            last_error = e
            continue
        except Exception as e:
            logger.warning("Gemini model %s encountered error: %s", model_name, e)
            last_error = e
            continue

    logger.error("All Gemini candidate models failed. Last error: %s", last_error)
    raise HTTPException(
        status_code=503,
        detail="The AI model service is temporarily experiencing high demand. Please try again shortly.",
    )