"""
댓글(커뮤니티) 관련 DB 트랜잭션 모듈.
"""

from app.core.supabase_client import supabase

def get_by_cert(cert_id: int):
    # db 매개변수 삭제!
    # 세션 대신 전역 supabase 클라이언트를 사용하여 쿼리 수행
    response = supabase.table("comment") \
        .select("*") \
        .eq("cert_id", cert_id) \
        .order("created_at", desc=True) \
        .execute()
    return response.data

def create(cert_id: int, user_id: int, content: str):
    # db 매개변수 삭제!
    response = supabase.table("comment").insert({
        "cert_id": cert_id,
        "user_id": user_id,
        "content": content
    }).execute()
    return response.data[0]
