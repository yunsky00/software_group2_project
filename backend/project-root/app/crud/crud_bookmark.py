"""
즐겨찾기(Bookmark) 관련 Supabase 쿼리 모듈.
DB 스키마: bookmarks(user_id integer FK, category_type, category_id).
자격증 북마크의 경우 category_type='certificate', category_id=cert_id로 저장.
"""
import logging
from typing import List, Optional, Dict, Any
from app.core.supabase_client import supabase

logger = logging.getLogger(__name__)

CERT_CATEGORY_TYPE = "certificate"


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


def get_user_bookmarks(email: str) -> List[Dict[str, Any]]:
    """
    특정 사용자가 등록한 자격증 즐겨찾기 목록을 조회.

    Args:
        email: 현재 로그인한 사용자 이메일.

    Returns:
        즐겨찾기 목록 (자격증 정보 포함).
    """
    user_id = get_user_id_by_email(email)
    if user_id is None:
        return []

    try:
        response = (
            supabase.table("bookmarks")
            .select("id, user_id, category_id, category_type, created_at")
            .eq("user_id", user_id)
            .eq("category_type", CERT_CATEGORY_TYPE)
            .order("created_at", desc=True)
            .execute()
        )

        result = []
        for row in response.data or []:
            cert_id = row["category_id"]
            # 자격증 정보 조회
            cert_response = (
                supabase.table("certificates")
                .select("id, name, issuer, fee, pass_rate, categories(name), jobs(name)")
                .eq("id", cert_id)
                .maybe_single()
                .execute()
            )
            cert = cert_response.data or {}
            result.append({
                "id": row["id"],
                "user_id": row["user_id"],
                "cert_id": cert_id,
                "created_at": row["created_at"],
                "certificate": {
                    "id": cert.get("id"),
                    "name": cert.get("name"),
                    "issuer": cert.get("issuer"),
                    "category": (cert.get("categories") or {}).get("name", ""),
                    "job_group": (cert.get("jobs") or {}).get("name", ""),
                    "fee": cert.get("fee"),
                    "pass_rate": cert.get("pass_rate"),
                } if cert else None,
            })
        return result
    except Exception as e:
        logger.error(f"즐겨찾기 조회 실패 (email={email}): {e}")
        return []


def add_bookmark(email: str, cert_id: int) -> Optional[Dict[str, Any]]:
    """
    자격증을 사용자의 즐겨찾기에 추가.
    이미 존재하는 경우 기존 레코드를 반환.

    Args:
        email: 현재 로그인한 사용자 이메일.
        cert_id: 자격증 ID.

    Returns:
        생성 또는 기존 북마크 딕셔너리. 오류 발생 시 None.
    """
    user_id = get_user_id_by_email(email)
    if user_id is None:
        return None

    try:
        # 중복 확인
        existing = (
            supabase.table("bookmarks")
            .select("*")
            .eq("user_id", user_id)
            .eq("category_type", CERT_CATEGORY_TYPE)
            .eq("category_id", cert_id)
            .maybe_single()
            .execute()
        )
        if existing.data:
            return {**existing.data, "cert_id": cert_id}

        # 신규 추가
        response = (
            supabase.table("bookmarks")
            .insert({
                "user_id": user_id,
                "category_type": CERT_CATEGORY_TYPE,
                "category_id": cert_id,
            })
            .execute()
        )
        if response.data:
            return {**response.data[0], "cert_id": cert_id}
        return None

    except Exception as e:
        logger.error(f"즐겨찾기 추가 실패 (email={email}, cert_id={cert_id}): {e}")
        return None


def remove_bookmark(email: str, cert_id: int) -> bool:
    """
    사용자의 즐겨찾기에서 자격증을 삭제.

    Args:
        email: 현재 로그인한 사용자 이메일.
        cert_id: 자격증 ID.

    Returns:
        삭제 성공 시 True, 레코드가 없거나 오류 시 False.
    """
    user_id = get_user_id_by_email(email)
    if user_id is None:
        return False

    try:
        existing = (
            supabase.table("bookmarks")
            .select("id")
            .eq("user_id", user_id)
            .eq("category_type", CERT_CATEGORY_TYPE)
            .eq("category_id", cert_id)
            .maybe_single()
            .execute()
        )
        if not existing.data:
            return False

        supabase.table("bookmarks").delete().eq("user_id", user_id).eq("category_type", CERT_CATEGORY_TYPE).eq("category_id", cert_id).execute()
        return True

    except Exception as e:
        logger.error(f"즐겨찾기 삭제 실패 (email={email}, cert_id={cert_id}): {e}")
        return False