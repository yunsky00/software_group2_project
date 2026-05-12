"""
자격증별 사용자 댓글 및 팁 공유 기능을 제공하는 API 라우터 모듈.
"""
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.crud import crud_community
from app.schemas.comment import CommentResponse, CommentCreate

router = APIRouter()


@router.get("/{cert_id}/comments", response_model=List[CommentResponse])
def read_comments(
    cert_id: int,
    db: Session = Depends(deps.get_db)
) -> List[CommentResponse]:
    """
    특정 자격증에 등록된 모든 댓글 목록을 최신순으로 조회.

    Args:
        cert_id: 자격증 고유 ID.
        db: DB 세션.

    Returns:
        조회된 댓글 객체 리스트.
    """
    return crud_community.get_by_cert(db, cert_id=cert_id)


@router.post("/{cert_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    cert_id: int,
    comment_in: CommentCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> CommentResponse:
    """
    로그인한 사용자가 특정 자격증 페이지에 댓글(팁)을 작성.

    Args:
        cert_id: 자격증 고유 ID.
        comment_in: 작성할 댓글 내용 스키마.
        db: DB 세션.
        current_user: 인증된 현재 사용자 객체.

    Returns:
        생성된 댓글 객체.
    """
    return crud_community.create(
        db,
        cert_id=cert_id,
        user_id=current_user.id,
        content=comment_in.content
    )