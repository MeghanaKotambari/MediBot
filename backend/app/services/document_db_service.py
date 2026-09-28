from datetime import datetime, timezone

from app.db.mongodb import documents_collection


def save_document(
    document_name: str,
    pages: int,
    chunks: int,
):

    document = {
        "document_name": document_name,
        "pages": pages,
        "chunks": chunks,
        "created_at": datetime.now(timezone.utc),
    }

    result = documents_collection.insert_one(
        document
    )

    return {
        "id": str(result.inserted_id),
        "document_name": document_name,
        "pages": pages,
        "chunks": chunks,
        "created_at": document["created_at"],
    }