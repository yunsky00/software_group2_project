"""
사용자 관련 Supabase 쿼리 모듈.
자체 users 테이블을 사용하여 사용자 정보를 관리.
"""
import logging
from typing import Optional, Dict, Any
from app.core.supabase_client import supabase

logger = logging.getLogger(__name__)


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """
    이메일로 users 테이블에서 사용자를 조회.

    Args:
        email: 사용자 이메일 주소.

    Returns:
        조회된 사용자 딕셔너리. 없을 경우 None.
    """
    try:
        response = (
            supabase.table("users")
            .select("id, email, nickname, created_at")
            .eq("email", email)
            .maybe_single()
            .execute()
        )
        return response.data
    except Exception as e:
        logger.error(f"사용자 조회 실패 (email={email}): {e}")
        return None


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """
    ID로 users 테이블에서 사용자를 조회.

    Args:
        user_id: 사용자 ID (integer).

    Returns:
        조회된 사용자 딕셔너리. 없을 경우 None.
    """
    try:
        response = (
            supabase.table("users")
            .select("id, email, nickname, created_at")
            .eq("id", user_id)
            .maybe_single()
            .execute()
        )
        return response.data
    except Exception as e:
        logger.error(f"사용자 조회 실패 (id={user_id}): {e}")
        return None


def create_user(email: str, nickname: str = "사용자") -> Optional[Dict[str, Any]]:
    """
    새로운 사용자를 users 테이블에 등록.
    password는 Supabase Auth에서 관리하므로 빈 문자열로 설정.

    Args:
        email: 사용자의 이메일 주소.
        nickname: 닉네임 (기본값: "사용자").

    Returns:
        생성된 사용자 딕셔너리. 오류 발생 시 None.
    """
    try:
        response = (
            supabase.table("users")
            .insert({
                "email": email,
                "password": "",   # Supabase Auth가 인증 담당
                "nickname": nickname,
            })
            .execute()
        )
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"사용자 생성 실패 (email={email}): {e}")
        return None
