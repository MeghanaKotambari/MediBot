from app.services.retrieval_service import search_documents
from app.services.llm_service import generate_answer


def generate_rag_response(
    question: str,
    top_k: int = 3,
):

    # --------------------------------
    # 1. Retrieve relevant chunks
    # --------------------------------

    results = search_documents(
        query=question,
        top_k=top_k,
    )

    # --------------------------------
    # 2. Prepare context + sources
    # --------------------------------

    context_parts = []
    sources = []

    for index, match in enumerate(results.matches, start=1):

        text = match.metadata.get("text", "")
        page_number = match.metadata.get("page_number")
        document_name = match.metadata.get("document_name")

        # Create a source ID
        source_id = index

        context_parts.append(
            f"""
[Source {source_id}]
Document: {document_name}
Page: {page_number}

Content:
{text}
"""
        )

        sources.append(
            {
                "id": source_id,
                "document": document_name,
                "page": page_number,
                "score": round(match.score, 4),
            }
        )

    context = "\n\n".join(context_parts)

    # --------------------------------
    # 3. Generate grounded answer
    # --------------------------------

    answer = generate_answer(
        question=question,
        context=context,
    )

    # --------------------------------
    # 4. Return answer + sources
    # --------------------------------

    return {
        "answer": answer,
        "sources": sources,
    }