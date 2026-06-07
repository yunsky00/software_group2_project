"""
캘린더/D-day 관련 데이터 검증 스키마 모듈.
"""
from pydantic import BaseModel
from datetime import date


class DeadlineResponse(BaseModel):
    """
    접수 마감일이 임박한 자격증 목록 응답 스키마.
    """
    id: int
    name: str
    receipt_end_date: date
    d_day: int

    model_config = {"from_attributes": True}