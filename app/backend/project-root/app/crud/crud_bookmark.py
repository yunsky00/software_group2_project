"""
즐겨찾기(Bookmark) 관련 DB 트랜잭션 모듈.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.bookmark import Bookmark


def get_user_bookmarks(db: Session, user_id: int) -> List[Bookmark]:
    """
    특정 사용자가 등록한 즐겨찾기 목록을 조회.

    Args:
        db: 데이터베이스 세션.
        user_id: 사용자 ID.

    Returns:
        해당 사용자의 즐겨찾기 목록.
    """
    return db.query(Bookmark).filter(Bookmark.user_id == user_id).order_by(Bookmark.created_at.desc()).all()


def add_bookmark(db: Session, user_id: int, cert_id: int) -> Optional[Bookmark]:
    """
    자격증을 사용자의 즐겨찾기에 추가.

    Args:
        db: 데이터베이스 세션.
        user_id: 사용자 ID.
        cert_id: 자격증 ID.

    Returns:
        생성된 즐겨찾기 객체 또는 이미 존재하는 경우 기존 객체.
    """
    # 중복 북마크 방지 확인
    existing = db.query(Bookmark).filter(
        Bookmark.user_id == user_id, 
        Bookmark.cert_id == cert_id
    ).first()
    
    if existing is not None:
        return existing

    new_bookmark = Bookmark(user_id=user_id, cert_id=cert_id)
    db.add(new_bookmark)
    db.commit()
    db.refresh(new_bookmark)
    return new_bookmark


def remove_bookmark(db: Session, user_id: int, cert_id: int) -> bool:
    """
    사용자의 즐겨찾기에서 자격증을 삭제.

    Args:
        db: 데이터베이스 세션.
        user_id: 사용자 ID.
        cert_id: 자격증 ID.

    Returns:
        삭제 성공 여부(True/False).
    """
    bookmark = db.query(Bookmark).filter(
        Bookmark.user_id == user_id, 
        Bookmark.cert_id == cert_id
    ).first()
    
    if bookmark is not None:
        db.delete(bookmark)
        db.commit()
        return True
    return False