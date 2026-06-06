"""
AI 추천 로그 관련 Supabase 쿼리 모듈.
DB 스키마: ai_recommendation_logs(user_id integer FK).
"""
import logging
from typing import Optional, Dict, Any
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


def save_recommendation_log(
    email: str,
    major: str,
    desired_job: str,
    target_company: str,
    roadmap_content: str,
) -> Optional[Dict[str, Any]]:
    """
    AI 자격증 추천 결과를 ai_recommendation_logs 테이블에 저장.

    Args:
        email: 현재 로그인한 사용자 이메일.
        major: 사용자 전공.
        desired_job: 희망 직무.
        target_company: 목표 기업 군.
        roadmap_content: AI가 생성한 추천 결과 텍스트.

    Returns:
        저장된 로그 딕셔너리. 오류 발생 시 None.
    """
    user_id = get_user_id_by_email(email)

    try:
        response = (
            supabase.table("ai_recommendation_logs")
            .insert({
                "user_id": user_id,  # 비로그인 시 None 허용
                "major": major,
                "desired_job": desired_job,
                "target_company": target_company,
                "roadmap_content": roadmap_content,
            })
            .execute()
        )
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"AI 추천 로그 저장 실패 (email={email}): {e}")
        return None