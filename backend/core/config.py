"""
환경 변수 및 설정을 관리하는 모듈.
Supabase 전용으로 운영하므로 DATABASE_URL은 사용하지 않음.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    .env 파일의 값을 로드하여 파이썬 변수로 관리하는 클래스.
    타입 힌트를 통해 변수의 타입이 올바른지 검증.
    """
    AI_API_KEY: str
    SUPABASE_URL: str
    SUPABASE_KEY: str

    class Config:
        env_file = ".env"


# 전역에서 사용할 수 있도록 설정 객체 인스턴스화
settings = Settings()
