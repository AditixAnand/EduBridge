from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.schemas import ChatRequest, ChatResponse
from app.models.models import ChatHistory
from app.services.openai import get_ai_response
from app.services.database import get_db

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest, db: AsyncSession = Depends(get_db)):
    try:
        ai_reply = await get_ai_response(payload.message)

        # Save to DB
        history = ChatHistory(
            user_email="anonymous",   # replace with auth user later
            message=payload.message,
            response=ai_reply,
        )
        db.add(history)
        await db.commit()

        return ChatResponse(response=ai_reply)
    except Exception as exc:
        print(f"[ERROR] {exc}")
        raise HTTPException(status_code=502, detail="AI service error. Please try again.")