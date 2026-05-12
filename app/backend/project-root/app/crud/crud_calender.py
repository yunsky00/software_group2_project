"""
마감일 캘린더 DB 쿼리 모듈.
"""
from typing import List
from sqlalchemy.orm import Session
from app.models.certificate import Certificate
from datetime import datetime, timedelta


def get_upcoming_certs(db: Session, days: int = 365) -> List[Certificate]:
    """
    오늘 날짜 기준으로 특정 일수 이내에 접수가 마감되는 자격증 목록을 조회.

    Args:
        db: 데이터베이스 세션.
        days: 조회 기한(일). 프로젝트 범위에 맞춰 1년(365일)을 기본값으로 설정.

    Returns:
        마감 기한 조건에 맞는 자격증 목록.
    """
    today = datetime.now()
    end_window = today + timedelta(days=days)

    return db.query(Certificate).filter(
        Certificate.receipt_end_date >= today,
        Certificate.receipt_end_date <= end_window
    ).order_by(Certificate.receipt_end_date.asc()).all()