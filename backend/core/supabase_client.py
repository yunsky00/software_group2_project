"""
Supabase SDK 초기화 및 전역 클라이언트 모듈.
모든 데이터베이스 접근은 이 클라이언트를 통해 이루어집니다.
"""
import logging
from typing import Optional, Any
from supabase import create_client, Client
from app.core.config import settings

# 전역 Supabase 클라이언트 생성
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def verify_supabase_token(token: str) -> Optional[Any]:
    """
    클라이언트에서 전달받은 JWT 토큰의 유효성을 검증.
    """
    try:
        user_response = supabase.auth.get_user(token)
        return user_response.user
    except Exception as e:
        logging.warning(f"Supabase token verification failed: {e}")
        return None
