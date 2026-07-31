from fastapi import APIRouter
from app.models.schemas import HealthResponse
from app.config import settings

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthResponse)
async def health_check():
    """Quick liveness check – useful for deployment pipelines."""
    return HealthResponse(status="ok", api_key_loaded=bool(settings.OPENAI_API_KEY))