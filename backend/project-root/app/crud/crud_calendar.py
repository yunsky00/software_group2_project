"""
마감일 캘린더 Supabase 쿼리 모듈.
DB 스키마: exam_schedules(application_end) 컬럼 사용.
"""
import logging
from typing import List, Dict, Any
from datetime import datetime, timedelta, timezone
from app.core.supabase_client import supabase

logger = logging.getLogger(__name__)


def get_upcoming_certs(days: int = 365) -> List[Dict[str, Any]]:
    """
    접수 마감(application_end)이 오늘 이후이고 days일 이내인 시험 일정을 조회.
    certificates 테이블에서 자격증 이름을 조인하여 반환.

    Args:
        days: 조회할 미래 날짜 범위 (기본 365일).

    Returns:
        자격증 이름 및 접수 마감일을 포함한 시험 일정 목록.
    """
    try:
        today = datetime.now(timezone.utc).date()
        end_window = today + timedelta(days=days)

        response = (
            supabase.table("exam_schedules")
            .select("id, application_end, certificates(name)")
            .gte("application_end", today.isoformat())
            .lte("application_end", end_window.isoformat())
            .order("application_end", desc=False)
            .execute()
        )

        result = []
        for row in response.data or []:
            cert_info = row.get("certificates") or {}
            result.append({
                "id": row["id"],
                "name": cert_info.get("name", ""),
                "receipt_end_date": row["application_end"],  # API 응답은 기존 필드명 유지
            })
        return result

    except Exception as e:
        logger.error(f"캘린더 일정 조회 실패: {e}")
        return []