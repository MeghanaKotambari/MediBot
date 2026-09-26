from pinecone import Pinecone

from app.core.config import settings


pc = Pinecone(
    api_key=settings.PINECONE_API_KEY
)


def get_index():

    return pc.Index(
        settings.PINECONE_INDEX_NAME
    )


def store_chunks(chunks: list[dict], batch_size: int = 100):
    if not chunks:
        return

    index = get_index()

    vectors = [
        {
            "id": f"{chunk['document_name']}_{chunk['chunk_id']}",
            "values": chunk["embedding"],
            "metadata": {
                "text": chunk["text"],
                "page_number": chunk["page_number"],
                "document_name": chunk["document_name"],
            },
        }
        for chunk in chunks
    ]

    for i in range(0, len(vectors), batch_size):
        batch = vectors[i : i + batch_size]
        index.upsert(
            vectors=batch,
            namespace="medical-documents",
        )