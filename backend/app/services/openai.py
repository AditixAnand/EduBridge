from openai import AsyncOpenAI
from app.config import settings
 
# Single client instance reused across all requests
client: AsyncOpenAI | None = None
 
 
def init_client() -> None:
    """Called once at app startup via lifespan."""
    global client
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not set. Add it to your .env file.")
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
 
 
async def get_ai_response(user_message: str) -> str:
    """Send a message to OpenAI and return the assistant's reply."""
    completion = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant for EduBridge, "
                    "an online learning platform."
                ),
            },
            {"role": "user", "content": user_message},
        ],
        max_tokens=settings.MAX_TOKENS,
        temperature=settings.TEMPERATURE,
    )
    return completion.choices[0].message.content.strip()