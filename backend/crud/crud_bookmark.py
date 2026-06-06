"""
즐겨찾기(Bookmark) 관련 DB 트랜잭션 모듈.
"""
from typing import List, Dict, Any
from app.core.supabase_client import supabase

def get_user_bookmarks(user_id: int) -> List[Dict[str, Any]]:
    """특정 사용자가 등록한 즐겨찾기 목록과 연관된 자격증 정보를 함께 조회."""
    # Supabase의 외래키 연동 기능(Joins)을 활용해 한 번의 쿼리로 자격증 정보까지 가져옵니다.
    response = supabase.table("bookmarks") \
        .select("*, certificates(*)") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .execute()
    return response.data

def add_bookmark(user_id: int, cert_id: int) -> Dict[str, Any]:
    """자격증을 사용자의 즐겨찾기에 추가. 중복 삽입을 방지합니다."""
    existing = supabase.table("bookmarks") \
        .select("*") \
        .eq("user_id", user_id) \
        .eq("cert_id", cert_id) \
        .execute()
    
    if existing.data:
        return existing.data[0]

    response = supabase.table("bookmarks").insert({
        "user_id": user_id,
        "cert_id": cert_id
    }).execute()
    return response.data[0]

def remove_bookmark(user_id: int, cert_id: int) -> bool:
    """사용자의 즐겨찾기에서 자격증을 삭제."""
    response = supabase.table("bookmarks") \
        .delete() \
        .eq("user_id", user_id) \
        .eq("cert_id", cert_id) \
        .execute()
    return len(response.data) > 0
