from app.services.embedding_service import (
    generate_query_embedding,
)

from app.services.vector_service import (
    get_index,
)


def search_documents(
    query: str,
    user_id: str | None = None,
    top_k: int = 5,
):

    query_embedding = generate_query_embedding(
        query
    )

    index = get_index()

    query_kwargs = {
        "namespace": "medical-documents",
        "vector": query_embedding,
        "top_k": top_k,
        "include_metadata": True,
    }

    if user_id:
        query_kwargs["filter"] = {
            "user_id": {
                "$eq": str(user_id)
            }
        }

    results = index.query(**query_kwargs)

    return results