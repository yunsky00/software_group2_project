"""
자격증(Certificate) 관련 Supabase 쿼리 모듈.
DB 스키마: certificates(category_id FK, job_id FK, issuer), categories, jobs 테이블 사용.
"""
import logging
from typing import List, Dict, Any, Optional
from app.core.supabase_client import supabase

logger = logging.getLogger(__name__)


def get_top_ranked(limit: int = 100) -> List[Dict[str, Any]]:
    """
    certificates 테이블에서 자격증 목록을 조회.
    categories, jobs 테이블을 조인하여 이름 반환.
    view_count 컬럼이 없으므로 id 기준 정렬.

    Args:
        limit: 반환할 최대 개수 (기본 100).

    Returns:
        자격증 목록.
    """
    try:
        response = (
            supabase.table("certificates")
            .select("id, name, issuer, fee, pass_rate, categories(name), jobs(name)")
            .limit(limit)
            .execute()
        )

        result = []
        for row in response.data or []:
            result.append({
                "id": row["id"],
                "name": row["name"],
                "issuer": row["issuer"],
                "category": (row.get("categories") or {}).get("name", ""),
                "job_group": (row.get("jobs") or {}).get("name", ""),
                "fee": row.get("fee"),
                "pass_rate": row.get("pass_rate"),
            })
        return result
    except Exception as e:
        logger.error(f"랭킹 조회 실패: {e}")
        return []


def get_and_increase_view(cert_id: int, ip_address: str, user_id: Optional[int] = None) -> Optional[Dict[str, Any]]:
    """
    자격증 상세 정보를 조회하고 조회 로그를 기록.
    categories, jobs, exam_schedules, exam_subjects, certificate_benefits 조인.

    Args:
        cert_id: 자격증 고유 ID.
        ip_address: 클라이언트 IP 주소.
        user_id: 로그인 사용자 ID (비로그인 시 None).

    Returns:
        자격증 상세 정보 딕셔너리. 존재하지 않으면 None.
    """
    try:
        # 자격증 기본 정보 조회
        cert_response = (
            supabase.table("certificates")
            .select(
                "*, "
                "categories(name), "
                "jobs(name), "
                "exam_schedules(id, turn, application_start, application_end, exam_date, announcement_date), "
                "exam_subjects(subject_name, sort_order), "
                "certificate_benefits(benefit_text)"
            )
            .eq("id", cert_id)
            .maybe_single()
            .execute()
        )
        cert = cert_response.data
        if not cert:
            return None

        # 조회 로그 기록
        try:
            supabase.table("certificate_view_logs").insert({
                "certificate_id": cert_id,
                "user_id": user_id,
                "ip_address": ip_address,
            }).execute()
        except Exception as log_err:
            logger.warning(f"조회 로그 기록 실패 (cert_id={cert_id}): {log_err}")

        # 응답 데이터 정제
        result = {
            "id": cert["id"],
            "name": cert["name"],
            "issuer": cert["issuer"],
            "description": cert.get("description"),
            "fee": cert.get("fee"),
            "pass_rate": cert.get("pass_rate"),
            "exam_time": cert.get("exam_time"),
            "official_url": cert.get("official_url"),
            "category": (cert.get("categories") or {}).get("name", ""),
            "job_group": (cert.get("jobs") or {}).get("name", ""),
            "exam_schedules": cert.get("exam_schedules") or [],
            "subjects": [
                s["subject_name"]
                for s in sorted(
                    cert.get("exam_subjects") or [],
                    key=lambda x: x.get("sort_order") or 0
                )
            ],
            "benefits": [
                b["benefit_text"]
                for b in (cert.get("certificate_benefits") or [])
            ],
        }
        return result

    except Exception as e:
        logger.error(f"자격증 상세 조회 실패 (cert_id={cert_id}): {e}")
        return None


def search_certs(keyword: str = "", category: str = "", job_group: str = "") -> List[Dict[str, Any]]:
    """
    키워드, 카테고리, 직군 조건으로 자격증을 검색.
    category, job_group은 categories/jobs 테이블의 name 기준으로 검색.

    Args:
        keyword: 자격증 이름 부분 일치 검색.
        category: 카테고리 이름 (예: 대기업, 공기업, 공무원).
        job_group: 직군 이름 (예: 소프트웨어 개발).

    Returns:
        검색 조건에 맞는 자격증 목록.
    """
    try:
        query = supabase.table("certificates").select(
            "id, name, issuer, fee, pass_rate, categories(name), jobs(name)"
        )

        if keyword:
            query = query.ilike("name", f"%{keyword}%")

        response = query.execute()
        rows = response.data or []

        result = []
        for row in rows:
            cat_name = (row.get("categories") or {}).get("name", "")
            job_name = (row.get("jobs") or {}).get("name", "")

            # 카테고리/직군 필터는 조인 후 파이썬에서 처리
            if category and cat_name != category:
                continue
            if job_group and job_name != job_group:
                continue

            result.append({
                "id": row["id"],
                "name": row["name"],
                "issuer": row["issuer"],
                "category": cat_name,
                "job_group": job_name,
                "fee": row.get("fee"),
                "pass_rate": row.get("pass_rate"),
            })
        return result

    except Exception as e:
        logger.error(f"자격증 검색 실패 (keyword={keyword}): {e}")
        return []