"""
이메일 알림 서비스 모듈.
DB 스키마: notification_logs 테이블이 없으므로 로깅만 처리.
D-7 알람: 즐겨찾기한 자격증 중 접수 마감이 정확히 7일 남은 항목 대상 이메일 발송.
"""
import logging
from datetime import datetime, timedelta, timezone
from app.core.supabase_client import supabase

logger = logging.getLogger(__name__)


async def _mock_send_mail(email: str, cert_name: str) -> None:
    """
    실제 메일 발송 플레이스홀더.
    추후 SMTP 또는 외부 메일 서비스(SendGrid 등)로 교체 필요.
    """
    logger.info(f"[메일 발송 시뮬레이션] 수신자: {email}, 자격증: {cert_name}")


async def trigger_d7_alarm() -> None:
    """
    접수 마감(application_end)이 정확히 7일 남은 자격증을 즐겨찾기한 유저에게 알림 메일 발송.

    처리 흐름:
        1. exam_schedules에서 D-7 해당 일정 조회.
        2. bookmarks에서 해당 자격증을 즐겨찾기한 유저 조회.
        3. users 테이블에서 유저 이메일 조회.
        4. 각 유저에게 알림 메일 발송.
    """
    try:
        target_date = (datetime.now(timezone.utc).date() + timedelta(days=7)).isoformat()

        # D-7에 해당하는 시험 접수 마감 일정 조회
        schedule_response = (
            supabase.table("exam_schedules")
            .select("certificate_id, certificates(name)")
            .eq("application_end", target_date)
            .execute()
        )
        rows = schedule_response.data or []

        if not rows:
            logger.info("D-7 해당 자격증 없음. 알람 발송 생략.")
            return

        cert_ids = [row["certificate_id"] for row in rows]
        cert_names = {row["certificate_id"]: (row.get("certificates") or {}).get("name", "") for row in rows}

        # 해당 자격증을 즐겨찾기한 유저 조회 (category_type='certificate')
        bookmark_response = (
            supabase.table("bookmarks")
            .select("user_id, category_id")
            .in_("category_id", cert_ids)
            .eq("category_type", "certificate")
            .execute()
        )

        for row in bookmark_response.data or []:
            user_id = row.get("user_id")
            cert_id = row.get("category_id")

            if not user_id:
                continue

            # 유저 이메일 조회
            user_response = (
                supabase.table("users")
                .select("email")
                .eq("id", user_id)
                .maybe_single()
                .execute()
            )
            email = (user_response.data or {}).get("email")

            if not email:
                continue

            cert_name = cert_names.get(cert_id, "")
            await _mock_send_mail(email=email, cert_name=cert_name)

    except Exception as e:
        logger.error(f"D-7 알람 트리거 실패: {e}")
