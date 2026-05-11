"""
캘린더 및 접수 임박(D-day) 자격증 조회 API 라우터 모듈.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime
from app.api import deps
from app.crud import crud_calendar
from app.schemas.calendar import DeadlineResponse
from app.services.email_service import send_d7_alarm_email

router = APIRouter()


@router.get("/upcoming", response_model=List[DeadlineResponse])
def get_deadlines(
    days: int = 365, 
    db: Session = Depends(deps.get_db)
) -> List[Dict[str, Any]]:
    """
    접수 마감이 임박한 자격증 리스트를 조회. (해당 연도 1년 내)

    Args:
        days: 조회할 미래 날짜 기한. 기본 365일.
        db: 데이터베이스 세션.

    Returns:
        계산된 D-day를 포함한 자격증 응답 리스트.
    """
    certs = crud_calendar.get_upcoming_certs(db, days)
    result = []
    today = datetime.now()
    
    for cert in certs:
        # 안전한 연산을 위해 date()로 추출하여 날짜 차이 계산
        d_day = (cert.receipt_end_date.date() - today.date()).days
        result.append({
            "id": cert.id,
            "name": cert.name,
            "receipt_end_date": cert.receipt_end_date,
            "d_day": d_day
        })
    return result


@router.post("/trigger-alarms")
def trigger_deadline_alarms(db: Session = Depends(deps.get_db)) -> dict:
    """
    (배치/수동) 접수 마감이 정확히 7일(D-7) 남은 즐겨찾기 자격증 알림 메일을 전송.
    해당 엔드포인트는 스케줄러(cron) 등에 의해 매일 호출됨을 가정.
    """
    # 실제로는 즐겨찾기 테이블과 조인하여 D-7 인 사용자를 식별 후 발송.
    # 이 부분은 명세에 따라 이메일 발송 기능을 연동한 서비스 래퍼임.
    send_d7_alarm_email(db)
    return {"message": "D-7 알람 메일 발송 로직이 실행되었습니다."}