from google import genai
from google.genai import types
from google.genai import errors
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.core.config import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type(errors.APIError),
    reraise=True,
)
def _embed_content_with_retry(contents: str | list[str], task_type: str, title: str | None = None):
    config_args = {
        "task_type": task_type,
        "output_dimensionality": settings.GEMINI_EMBEDDING_DIMENSION,
    }
    if title:
        config_args["title"] = title

    return client.models.embed_content(
        model=settings.GEMINI_EMBEDDING_MODEL,
        contents=contents,
        config=types.EmbedContentConfig(**config_args),
    )


def generate_document_embedding(
    text: str,
    title: str | None = None,
) -> list[float]:

    if title is None:
        title = "Medical document"

    result = _embed_content_with_retry(
        contents=text,
        task_type="RETRIEVAL_DOCUMENT",
        title=title,
    )

    return result.embeddings[0].values


def generate_document_embeddings(
    texts: list[str],
    title: str | None = None,
    batch_size: int = 64,
) -> list[list[float]]:

    if not texts:
        return []

    if title is None:
        title = "Medical document"

    all_embeddings: list[list[float]] = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        result = _embed_content_with_retry(
            contents=batch,
            task_type="RETRIEVAL_DOCUMENT",
            title=title,
        )
        for emb in result.embeddings:
            all_embeddings.append(emb.values)

    return all_embeddings


def generate_query_embedding(
    query: str,
) -> list[float]:

    result = _embed_content_with_retry(
        contents=query,
        task_type="RETRIEVAL_QUERY",
    )

    return result.embeddings[0].values