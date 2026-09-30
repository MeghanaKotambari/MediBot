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

    prompt = f"""You are MediBot, an advanced clinical knowledge and medical education assistant.

Answer the user's question accurately and professionally using ONLY the provided sources.

CORE INSTRUCTIONS:
1. Grounding: Rely strictly on the information in the provided sources. Do not speculate or invent details.
2. Formatting:
   - Format your response with clean, professional Markdown.
   - Use structured sections with concise headings (e.g., `### Overview`, `### Common Symptoms`, `### Clinical Considerations`) when appropriate.
   - For lists, use standard markdown bullets (`- `) and bold key clinical terms (e.g., `- **Increased thirst (polydipsia)**: ...`).
   - Write in clear, empathetic, and professional clinical language.
3. Citations:
   - Cite your sources using bracketed notation like `[Source 1]` or `[Source 1, 2]` after claims or sections supported by those documents.
   - Avoid needlessly repeating identical citation tags at the end of every single sub-bullet if they come from the same reference; cite cleanly and accurately.
   - Only cite sources that were actually provided.
4. Clinical Boundaries:
   - Do not formulate a personal diagnosis or prescribe treatments/dosages to the user directly.
   - Provide objective medical education based on the literature.
   - If the provided sources do not contain sufficient evidence to answer the question, clearly state: "The uploaded clinical documents do not contain sufficient information to answer this question."

SOURCE MATERIAL:
----------------------------
{context}
----------------------------

USER INQUIRY:
{question}
----------------------------

Provide a well-structured, professional medical response based on the source material above:"""

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