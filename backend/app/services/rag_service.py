from app.services.retrieval_service import search_documents
from app.services.llm_service import generate_answer


def generate_rag_response(
    question: str,
    top_k: int = 3,
):

    # -----------------------------
    # 1. Retrieve relevant chunks
    # -----------------------------

    results = search_documents(
        query=question,
        top_k=top_k,
    )

    # -----------------------------
    # 2. Prepare context
    # -----------------------------

    context_parts = []

    sources = []

    for match in results.matches:

        text = match.metadata.get("text", "")
        page_number = match.metadata.get("page_number")
        document_name = match.metadata.get("document_name")

        context_parts.append(
            f"""
Document: {document_name}
Page: {page_number}

Content:
{text}
"""
        )

        sources.append(
            {
                "document": document_name,
                "page": page_number,
                "score": match.score,
            }
        )

    context = "\n\n".join(context_parts)

    # -----------------------------
    # 3. Generate answer
    # -----------------------------

    answer = generate_answer(
        question=question,
        context=context,
    )

    # -----------------------------
    # 4. Return answer + sources
    # -----------------------------

    return {
        "answer": answer,
        "sources": sources,
    }