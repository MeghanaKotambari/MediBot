from pathlib import Path

from app.services.pdf_service import extract_pages
from app.services.chunk_service import create_chunks
from app.services.embedding_service import (
    generate_document_embeddings,
)
from app.services.vector_service import store_chunks


def process_document(pdf_path: str):

    # --------------------------------
    # 1. Extract PDF text
    # --------------------------------

    pages = extract_pages(pdf_path)

    # --------------------------------
    # 2. Create chunks
    # --------------------------------

    chunks = create_chunks(pages)

    if not chunks:
        return {
            "document_name": Path(pdf_path).name,
            "pages": len(pages),
            "chunks": 0,
        }

    document_name = Path(pdf_path).name

    # --------------------------------
    # 3. Generate embeddings (batched)
    # --------------------------------

    texts = [chunk["text"] for chunk in chunks]
    embeddings = generate_document_embeddings(
        texts=texts,
        title=document_name,
    )

    for chunk, embedding in zip(chunks, embeddings):
        chunk["embedding"] = embedding
        chunk["document_name"] = document_name

    # --------------------------------
    # 4. Store in Pinecone
    # --------------------------------

    store_chunks(chunks)

    return {
        "document_name": document_name,
        "pages": len(pages),
        "chunks": len(chunks),
    }