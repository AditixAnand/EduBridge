# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

from pydantic import BaseModel,Field


class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="The user's message to the AI assistant.",
        examples=["Hello,what's up?"],
    )
 
 
class ChatResponse(BaseModel):
    response: str = Field(..., description="The AI assistant's reply.")
 
 
class HealthResponse(BaseModel):
    status: str
    api_key_loaded: bool