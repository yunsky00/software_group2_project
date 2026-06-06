"""
마감일 캘린더 DB 쿼리 모듈.
"""
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.core.supabase_client import supabase

def get_upcoming_certs(days: int = 365) -> List[Dict[str, Any]]:
    """접수 마감이 임박한 자격증 시험 일정을 조회합니다."""
    today = datetime.now().date().isoformat()
    end_window = (datetime.now().date() + timedelta(days=days)).isoformat()

    response = supabase.table("exam_schedules") \
        .select("*, certificates(name)") \
        .gte("application_end", today) \
        .lte("application_end", end_window) \
        .order("application_start") \
        .execute()
    
    return response.data
