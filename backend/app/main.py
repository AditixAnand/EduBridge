import os
from contextlib import asynccontextmanager
 
from fastapi import FastAPI

from openai import AsyncOpenAI
from dotenv import load_dotenv
from app.middleware.cors import cors
from app.routes import health,chat
from app.services.openai import init_client
 
# ---------------------------------------------------------------------------
# 1. Load environment variables
# ---------------------------------------------------------------------------
load_dotenv()
 
api_key = os.getenv("OPENAI_API_KEY")
 
# ---------------------------------------------------------------------------
# 2. Async OpenAI client  (created once, reused across requests)
# ---------------------------------------------------------------------------
client: AsyncOpenAI | None = None
 
from app.services.database import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create DB tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    init_client()
    yield
    await engine.dispose()  # clean up DB pool on shutdown

# ---------------------------------------------------------------------------
# 3. App factory
# ---------------------------------------------------------------------------
app = FastAPI(
    title="EduBridge AI Backend",
    description="Async AI-powered backend for the EduBridge learning platform.",
    version="2.0.0",
    lifespan=lifespan,
)
 
# ---------------------------------------------------------------------------
# 4. CORS  – tighten `allow_origins` before going to production
# ---------------------------------------------------------------------------

cors(app)


app.include_router(health.router)
app.include_router(chat.router)