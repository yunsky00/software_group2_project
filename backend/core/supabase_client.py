"""
Supabase SDK 초기화 및 토큰 검증 모듈.
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

    Args:
        token: HTTP Authorization 헤더로 전달된 Bearer 토큰.

    Returns:
        검증이 성공하면 사용자(User) 객체를 반환하고, 실패하면 None을 반환.
    """
    try:
        user_response = supabase.auth.get_user(token)
        return user_response.user
    except Exception as e:
        # 인증 실패 상황에 대한 명시적 로깅 (보안 이슈 모니터링)
        logging.warning(f"Supabase token verification failed: {e}")
        return None
