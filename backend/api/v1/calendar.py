"""
캘린더 및 접수 임박(D-day) 자격증 조회 API 라우터 모듈.
"""
from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime
from app.crud import crud_calendar

router = APIRouter()

@router.get("/upcoming")
def get_deadlines(days: int = 365) -> List[Dict[str, Any]]:
    """접수 마감이 임박한 자격증 리스트를 계산하여 반환."""
    schedules = crud_calendar.get_upcoming_certs(days)
    result = []
    today = datetime.now().date()

    for sched in schedules:
        end_date = datetime.strptime(sched["application_end"], "%Y-%m-%d").date()
        d_day = (end_date - today).days
        
        result.append({
            "id": sched["id"],
            "name": sched["certificates"]["name"],
            "application_end": sched["application_end"],
            "d_day": d_day
        })
    return result
