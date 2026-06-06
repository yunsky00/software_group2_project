"""
사용자 관련 데이터 검증 스키마 모듈.
"""
from pydantic import BaseModel
from typing import Optional


class UserResponse(BaseModel):
    """
    클라이언트에게 응답으로 내려가는 사용자 데이터 스키마.
    user_profiles 테이블의 컬럼과 일치.
    """
    id: int            # user_profiles 테이블의 PK (정수)
    supabase_uid: str  # Supabase Auth UUID
    email: str
    nickname: Optional[str] = None

    model_config = {"from_attributes": True}