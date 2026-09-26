from app.services.embedding_service import generate_query_embedding
from app.services.vector_service import get_index


def search_documents(
    query: str,
    top_k: int = 5,
):
    """
    Convert the user's question into an embedding
    and search Pinecone for the most relevant chunks.
    """

    # 1. Convert question into vector
    query_embedding = generate_query_embedding(query)

    # 2. Get Pinecone index
    index = get_index()

    # 3. Search Pinecone
    results = index.query(
        namespace="medical-documents",
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
    )

    return results