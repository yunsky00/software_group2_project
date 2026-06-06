"""
자격증 관련 데이터 검증 스키마 모듈.
"""
from pydantic import BaseModel
from datetime import date
from typing import Optional, List

class CertificateListResponse(BaseModel):
    id: int
    name: str
    agency: Optional[str] = None
    category: str
    job_group: str
    fee: Optional[str] = None
    pass_rate: Optional[str] = None
    view_count: int

    class Config:
        from_attributes = True

class ExamScheduleResponse(BaseModel):
    id: int
    turn: str
    application_start: Optional[date] = None
    application_end: Optional[date] = None
    exam_date: Optional[date] = None
    announcement_date: Optional[date] = None

    class Config:
        from_attributes = True

class CertificateDetailResponse(CertificateListResponse):
    exam_time: Optional[int] = None
    subjects: Optional[str] = None
    benefits: Optional[str] = None
    related_jobs: Optional[str] = None
    yearly_applicants: Optional[int] = None
    schedules: List[ExamScheduleResponse] = []
