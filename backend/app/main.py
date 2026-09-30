import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.db.mongodb import test_connection
from app.api.routes.documents import router as documents_router
from app.api.routes.search import router as search_router
from app.api.routes.chat import router as chat_router
from app.routes.auth import router as auth_router

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Medical Knowledge RAG API",
    description=(
        "Medical knowledge and education "
        "assistant using RAG."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Error handling {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )


app.include_router(documents_router)
app.include_router(search_router)
app.include_router(chat_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "Medical RAG API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/health/db")
def database_health():
    try:
        test_connection()
        return {
            "status": "connected"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
