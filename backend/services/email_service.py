import logging
from datetime import datetime, timedelta, timezone
from app.core.supabase_client import supabase

logger = logging.getLogger(__name__)

async def send_notification_with_log(
    user_id: int | None,
    email: str,
    notification_type: str,
    send_mail_function: callable
):
    """
    이메일 중복 발송 체크 및 로그 기록 함수.
    (notification_logs 테이블이 DB에 추가되어야 합니다.)
    """
    try:
        five_minutes_ago = (datetime.now(timezone.utc) - timedelta(minutes=5)).isoformat()

        response = supabase.table("notification_logs") \
            .select("id") \
            .eq("email", email) \
            .eq("notification_type", notification_type) \
            .eq("status", "SUCCESS") \
            .gte("sent_at", five_minutes_ago) \
            .execute()

        if response.data:
            logger.info(f"[발송 차단] {email} 님에게 최근 5분 이내에 알림이 발송되었습니다.")
            return {"success": False, "reason": "DUPLICATE_PREVENTION"}

        try:
            await send_mail_function(email)
        except Exception as mail_error:
            supabase.table("notification_logs").insert({
                "user_id": user_id,
                "email": email,
                "notification_type": notification_type,
                "status": "FAILED",
                "error_message": str(mail_error)
            }).execute()
            return {"success": False, "reason": "MAIL_SERVER_ERROR"}

        supabase.table("notification_logs").insert({
            "user_id": user_id,
            "email": email,
            "notification_type": notification_type,
            "status": "SUCCESS",
        }).execute()

        return {"success": True}

    except Exception as global_error:
        logger.error(f"알림 시스템 전체 로직 에러: {str(global_error)}")
        return {"success": False, "reason": "SYSTEM_CRASH"}
