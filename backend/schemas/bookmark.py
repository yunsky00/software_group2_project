"""
즐겨찾기 관련 데이터 검증 스키마 모듈.
"""
from pydantic import BaseModel
from datetime import datetime
from app.schemas.certificate import CertificateListResponse


class BookmarkResponse(BaseModel):
    """
    즐겨찾기 조회 시 클라이언트에게 반환되는 응답 스키마.
    """
    id: int
    user_id: int
    cert_id: int
    created_at: datetime
    certificate: CertificateListResponse  # 조인된 자격증 정보 포함

    class Config:
        from_attributes = True
