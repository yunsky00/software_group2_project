"""
환경 변수 및 설정을 관리하는 모듈.
"""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    .env 파일의 값을 로드하여 관리. 
    SQLAlchemy가 제거되었으므로 DATABASE_URL은 제외합니다.
    """
    AI_API_KEY: str
    SUPABASE_URL: str
    SUPABASE_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
