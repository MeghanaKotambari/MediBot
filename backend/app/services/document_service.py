import logging
from pathlib import Path
from uuid import uuid4

from app.services.pdf_service import extract_pages
from app.services.chunk_service import create_chunks
from app.services.embedding_service import (
    generate_document_embedding,
)
from app.services.vector_service import store_chunks
from app.services.document_db_service import save_document

logger = logging.getLogger(__name__)


def process_document(
    pdf_path: str,
    user_id: str,
):

    # --------------------------------
    # 1. Extract PDF
    # --------------------------------

    pages = extract_pages(pdf_path)

    # --------------------------------
    # 2. Create meaningful chunks
    # --------------------------------

    chunks = create_chunks(pages)

    document_name = Path(pdf_path).name
    document_id = str(uuid4())

    # --------------------------------
    # 3. Generate embeddings
    # --------------------------------

    for chunk in chunks:
        chunk["embedding"] = generate_document_embedding(
            text=chunk["text"],
            title=document_name,
        )

        chunk["document_name"] = document_name
        chunk["user_id"] = user_id
        chunk["document_id"] = document_id

    # --------------------------------
    # 4. Store in Pinecone
    # --------------------------------

    store_chunks(chunks)

    # --------------------------------
    # 5. Save in MongoDB
    # --------------------------------

    try:
        document_record = save_document(
            user_id=user_id,
            document_name=document_name,
            pages=len(pages),
            chunks=len(chunks),
        )
        database_id = document_record["id"]
    except Exception as e:
        logger.warning("Could not save document metadata to MongoDB: %s", e)
        database_id = None

    return {
        "document_id": document_id,
        "document_name": document_name,
        "pages": len(pages),
        "chunks": len(chunks),
        "database_id": database_id,
    }
