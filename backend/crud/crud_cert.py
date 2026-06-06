"""
자격증 관련 DB 트랜잭션 모듈.
"""
from typing import List, Dict, Any
from app.core.supabase_client import supabase

def get_top_ranked(limit: int = 10) -> List[Dict[str, Any]]:
    """
    총 누적 조회수(view_count) 기준 상위 자격증 랭킹 조회.
    DB에 저장된 숫자를 바로 정렬하여 가져오므로 속도가 매우 빠릅니다.
    """
    response = supabase.table("certificates") \
        .select("*") \
        .order("view_count", desc=True) \
        .limit(limit) \
        .execute()
    return response.data

def increment_view_count(cert_id: int) -> None:
    """
    자격증의 총 조회수(view_count)를 1 증가시킵니다.
    """
    # 현재 조회수를 가져옴
    cert = supabase.table("certificates").select("view_count").eq("id", cert_id).execute()
    
    if cert.data:
        current_count = cert.data[0].get("view_count", 0)
        # 조회수 + 1 업데이트
        supabase.table("certificates").update({"view_count": current_count + 1}).eq("id", cert_id).execute()
