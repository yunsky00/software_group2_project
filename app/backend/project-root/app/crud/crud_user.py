"""
사용자 DB 트랜잭션을 처리하는 모듈.
"""
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User


def get_user_by_supabase_uid(db: Session, supabase_uid: str) -> Optional[User]:
    """
    Supabase 고유 식별자를 사용하여 특정 사용자를 조회.

    Args:
        db: 연결된 데이터베이스 세션.
        supabase_uid: Supabase Auth에서 제공하는 유저 ID.

    Returns:
        조회된 사용자 객체. 없을 경우 None을 반환.
    """
    return db.query(User).filter(User.supabase_uid == supabase_uid).first()


def create_user(db: Session, supabase_uid: str, email: str, nickname: str = "사용자") -> User:
    """
    새로운 사용자를 데이터베이스에 등록.

    Args:
        db: 데이터베이스 세션.
        supabase_uid: Supabase에서 발급받은 유저 ID.
        email: 사용자의 이메일 주소.
        nickname: 닉네임 (기본값: "사용자").

    Returns:
        생성된 사용자 객체.
    """
    db_user = User(
        supabase_uid=supabase_uid,
        email=email,
        nickname=nickname
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user