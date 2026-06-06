"""
사용자 DB 트랜잭션을 처리하는 모듈. (Supabase Client 사용)
"""
from typing import Optional, Dict, Any
from app.core.supabase_client import supabase

def get_user_by_supabase_uid(supabase_uid: str) -> Optional[Dict[str, Any]]:
    """Supabase 고유 식별자를 사용하여 특정 사용자를 조회."""
    response = supabase.table("users").select("*").eq("email", supabase_uid).execute()
    return response.data[0] if response.data else None

def create_user(email: str, nickname: str = "사용자") -> Dict[str, Any]:
    """새로운 사용자를 데이터베이스에 등록."""
    response = supabase.table("users").insert({
        "email": email,
        "nickname": nickname
    }).execute()
    return response.data[0]
