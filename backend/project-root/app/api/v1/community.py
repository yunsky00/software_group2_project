"""
자격증별 사용자 댓글 및 팁 공유 기능을 제공하는 API 라우터 모듈.
DB 스키마: comment 테이블(단수), user_id integer FK.
"""
from typing import List
from fastapi import APIRouter, Depends, status
from app.api import deps
from app.crud import crud_community
from app.schemas.comment import CommentResponse, CommentCreate

router = APIRouter()


@router.get("/{cert_id}/comments", response_model=List[CommentResponse])
async def read_comments(cert_id: int) -> List[CommentResponse]:
    """
    특정 자격증에 등록된 모든 댓글 목록을 최신순으로 조회.
    """
    return crud_community.get_by_cert(cert_id=cert_id)


@router.post(
    "/{cert_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_comment(
    cert_id: int,
    comment_in: CommentCreate,
    current_user: dict = Depends(deps.get_current_user),
) -> CommentResponse:
    """
    로그인한 사용자가 특정 자격증 페이지에 댓글(팁)을 작성.
    """
    email: str = current_user.email
    return crud_community.create(
        cert_id=cert_id,
        email=email,
        content=comment_in.content,
    )