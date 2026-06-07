"""
댓글 관련 데이터 검증 스키마 모듈.
DB 스키마: comment 테이블(단수), user_id integer.
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CommentCreate(BaseModel):
    """
    클라이언트가 댓글을 생성할 때 보내는 요청 스키마.
    """
    content: str


class CommentResponse(BaseModel):
    """
    댓글 조회 시 클라이언트에게 반환되는 응답 스키마.
    """
    id: int
    content: str
    created_at: Optional[datetime] = None
    user_id: Optional[int] = None  # integer FK
    cert_id: Optional[int] = None

    model_config = {"from_attributes": True}