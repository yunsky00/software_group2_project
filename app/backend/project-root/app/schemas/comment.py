"""
댓글 관련 데이터 검증 스키마 모듈.
"""
from pydantic import BaseModel
from datetime import datetime


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
    created_at: datetime
    user_id: int
    cert_id: int

    class Config:
        from_attributes = True