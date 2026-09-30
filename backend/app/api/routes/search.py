from fastapi import APIRouter, Depends

from app.core.security import get_optional_current_user
from app.services.retrieval_service import search_documents


router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


@router.get("")
@router.get("/")
def search(
    query: str,
    top_k: int = 5,
    current_user=Depends(get_optional_current_user),
):
    user_id = str(current_user["_id"]) if current_user and "_id" in current_user else None

    results = search_documents(
        query=query,
        user_id=user_id,
        top_k=top_k,
    )

    matches = []

    for match in getattr(results, "matches", []):
        metadata = match.metadata or {}
        matches.append(
            {
                "score": match.score,
                "text": metadata.get("text"),
                "page_number": metadata.get("page_number"),
                "document_name": metadata.get("document_name"),
            }
        )

    return {
        "query": query,
        "matches": matches,
        "results": matches,
    }