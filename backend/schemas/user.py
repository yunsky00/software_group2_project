"""
사용자 관련 데이터 검증 스키마 모듈.
"""
from pydantic import BaseModel
from typing import Optional


class UserResponse(BaseModel):
    """
    클라이언트에게 응답으로 내려가는 사용자 데이터 스키마.
    """
    id: int
    supabase_uid: str
    email: str
    nickname: Optional[str] = None

    class Config:
        from_attributes = True
