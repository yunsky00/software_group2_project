"""
이메일 발송 관련 비즈니스 로직 모듈.
"""
from sqlalchemy.orm import Session
import logging


def send_d7_alarm_email(db: Session) -> None:
    """
    사용자가 즐겨찾기 한 자격증 중 시험 접수까지 7일 남은 항목에 대해 알림 메일을 발송.

    회원가입 시 사용한 이메일로 알람 전송을 처리하기 위한 서비스 계층 함수.
    실제 운영 환경에서는 SMTP 또는 외부 메일 API를 사용.

    Args:
        db: 데이터베이스 세션.
    """
    # TODO: 1. Bookmark 테이블과 Certificate 테이블을 Join하여 D-7인 항목 조회
    # TODO: 2. 해당 Bookmark를 소유한 User 이메일을 수집하여 SMTP 발송
    logging.info("D-7 마감 임박 알림 메일 발송 프로세스를 시작합니다.")