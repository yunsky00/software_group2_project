"""
댓글(커뮤니티) 관련 DB 트랜잭션 모듈.
"""
from typing import List
from sqlalchemy.orm import Session
from app.models.comment import Comment


def get_by_cert(db: Session, cert_id: int) -> List[Comment]:
    """
    해당 자격증에 달린 댓글을 최신순으로 가져옴.

    Args:
        db: 데이터베이스 세션.
        cert_id: 댓글을 조회할 자격증의 ID.

    Returns:
        조회된 댓글 목록.
    """
    return db.query(Comment).filter(Comment.cert_id == cert_id).order_by(Comment.created_at.desc()).all()


def create(db: Session, cert_id: int, user_id: int, content: str) -> Comment:
    """
    새로운 댓글을 작성하여 데이터베이스에 저장.

    Args:
        db: 데이터베이스 세션.
        cert_id: 댓글을 남길 자격증 ID.
        user_id: 댓글을 작성하는 사용자 ID.
        content: 작성할 댓글 내용.

    Returns:
        생성된 댓글 객체.
    """
    db_comment = Comment(cert_id=cert_id, user_id=user_id, content=content)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment