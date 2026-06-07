"""
즐겨찾기 관련 데이터 검증 스키마 모듈.
DB 스키마: bookmarks(user_id integer, category_type, category_id).
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any


class BookmarkResponse(BaseModel):
    """
    즐겨찾기 조회 시 클라이언트에게 반환되는 응답 스키마.
    """
    id: int
    user_id: int
    cert_id: int            # category_id를 cert_id로 매핑
    created_at: datetime
    certificate: Optional[Any] = None  # 조인된 자격증 정보

    model_config = {"from_attributes": True}