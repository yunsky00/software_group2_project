"""
자격증 관련 데이터 검증 스키마 모듈.
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CertificateListResponse(BaseModel):
    """
    목록 조회용 자격증 응답 스키마.
    """
    id: int
    name: str
    agency: Optional[str] = None
    category: str
    job_group: str
    closest_exam_date: Optional[datetime] = None
    fee: Optional[int] = None
    pass_rate: Optional[float] = None
    view_count: int

    class Config:
        from_attributes = True


class CertificateDetailResponse(CertificateListResponse):
    """
    상세 페이지 조회용 전체 자격증 응답 스키마.
    """
    receipt_start_date: Optional[datetime] = None
    receipt_end_date: Optional[datetime] = None
    exam_time: Optional[str] = None
    yearly_schedule: Optional[str] = None
    subjects: Optional[str] = None
    benefits: Optional[str] = None
    related_jobs: Optional[str] = None
    yearly_applicants: Optional[int] = None