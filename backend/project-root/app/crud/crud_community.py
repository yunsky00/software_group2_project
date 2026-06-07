"""
댓글(커뮤니티) 관련 Supabase 쿼리 모듈.
DB 스키마: comment 테이블(단수), user_id는 integer FK.
"""
import logging
from typing import List, Dict, Any, Optional
from app.core.supabase_client import supabase

logger = logging.getLogger(__name__)


def get_user_id_by_email(email: str) -> Optional[int]:
    """
    이메일로 users 테이블에서 user_id(integer)를 조회.
    """
    try:
        response = (
            supabase.table("users")
            .select("id")
            .eq("email", email)
            .maybe_single()
            .execute()
        )
        return response.data["id"] if response.data else None
    except Exception as e:
        logger.error(f"user_id 조회 실패 (email={email}): {e}")
        return None


def get_by_cert(cert_id: int) -> List[Dict[str, Any]]:
    """
    특정 자격증에 달린 댓글을 최신순으로 조회.

    Args:
        cert_id: 자격증 고유 ID.

    Returns:
        최신순으로 정렬된 댓글 목록.
    """
    try:
        response = (
            supabase.table("comment")   # DB 테이블명은 단수
            .select("*")
            .eq("cert_id", cert_id)
            .order("created_at", desc=True)
            .execute()
        )
        return response.data or []
    except Exception as e:
        logger.error(f"댓글 조회 실패 (cert_id={cert_id}): {e}")
        return []


def create(cert_id: int, email: str, content: str) -> Optional[Dict[str, Any]]:
    """
    새로운 댓글을 작성하여 Supabase에 저장.

    Args:
        cert_id: 댓글을 남길 자격증 ID.
        email: 댓글을 작성하는 사용자 이메일.
        content: 작성할 댓글 내용.

    Returns:
        생성된 댓글 딕셔너리. 오류 발생 시 None.
    """
    user_id = get_user_id_by_email(email)
    if user_id is None:
        logger.error(f"댓글 생성 실패: 사용자를 찾을 수 없음 (email={email})")
        return None

    try:
        response = (
            supabase.table("comment")   # DB 테이블명은 단수
            .insert({"cert_id": cert_id, "user_id": user_id, "content": content})
            .execute()
        )
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"댓글 생성 실패 (cert_id={cert_id}, email={email}): {e}")
        return None