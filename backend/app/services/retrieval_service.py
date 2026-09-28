from app.services.embedding_service import (
    generate_query_embedding,
)

from app.services.vector_service import (
    get_index,
)


def search_documents(
    query: str,
    top_k: int = 5,
):

    # Convert question to embedding
    query_embedding = (
        generate_query_embedding(query)
    )

    # Get Pinecone index
    index = get_index()

    # Search
    results = index.query(
        namespace="medical-documents",
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
    )

    return results