"""
캘린더 및 접수 임박(D-day) 자격증 조회 API 라우터 모듈.
DB 스키마: exam_schedules(application_end) 컬럼 사용.
"""
from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime, timezone
from app.crud import crud_calendar
from app.schemas.calendar import DeadlineResponse
from app.services.email_service import trigger_d7_alarm

router = APIRouter()


@router.get("/upcoming", response_model=List[DeadlineResponse])
async def get_deadlines(days: int = 365) -> List[Dict[str, Any]]:
    """
    접수 마감이 임박한 자격증 리스트를 조회. (해당 연도 1년 내)
    """
    certs = crud_calendar.get_upcoming_certs(days=days)
    result = []
    today = datetime.now(timezone.utc).date()

    for cert in certs:
        receipt_end = cert.get("receipt_end_date")
        if isinstance(receipt_end, str):
            from datetime import date
            receipt_end = date.fromisoformat(receipt_end)

        d_day = (receipt_end - today).days
        result.append({
            "id": cert["id"],
            "name": cert["name"],
            "receipt_end_date": receipt_end,
            "d_day": d_day,
        })

    return result


@router.post("/trigger-alarms")
async def trigger_deadline_alarms() -> dict:
    """
    (배치/수동) D-7 알림 메일 발송.
    """
    await trigger_d7_alarm()
    return {"message": "D-7 알람 메일 발송 로직이 실행되었습니다."}
