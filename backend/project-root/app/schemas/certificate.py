"""
자격증 관련 데이터 검증 스키마 모듈.
DB에서 categories, jobs를 조인한 후 문자열로 변환하여 반환.
"""
from pydantic import BaseModel
from datetime import date
from typing import Optional, List


class CertificateListResponse(BaseModel):
    """
    자격증 목록/랭킹 조회 시 반환되는 축약 스키마.
    """
    id: int
    name: str
    issuer: Optional[str] = None   # DB 컬럼명 issuer
    category: Optional[str] = None  # categories.name 조인값
    job_group: Optional[str] = None  # jobs.name 조인값
    fee: Optional[str] = None
    pass_rate: Optional[str] = None

    model_config = {"from_attributes": True}


class ExamScheduleResponse(BaseModel):
    """
    시험 일정 상세 스키마.
    """
    id: int
    turn: str
    application_start: Optional[date] = None
    application_end: Optional[date] = None
    exam_date: Optional[date] = None
    announcement_date: Optional[date] = None

    model_config = {"from_attributes": True}


class CertificateDetailResponse(BaseModel):
    """
    자격증 상세 정보 스키마.
    exam_schedules, subjects(list), benefits(list) 포함.
    """
    id: int
    name: str
    issuer: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    job_group: Optional[str] = None
    fee: Optional[str] = None
    pass_rate: Optional[str] = None
    exam_time: Optional[int] = None
    official_url: Optional[str] = None
    subjects: List[str] = []
    benefits: List[str] = []
    exam_schedules: List[ExamScheduleResponse] = []

    model_config = {"from_attributes": True}