from pydantic_settings import BaseSettings,SettingsConfigDict

class Settings(BaseSettings):
    OPENAI_API_KEY : str
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    MAX_TOKENS: int = 512
    TEMPERATURE: float = 0.7
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/edubridge"

    model_config = SettingsConfigDict(env_file='.env')

settings = Settings()  