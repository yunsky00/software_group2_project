"""
자격증별 사용자 댓글 및 팁 공유 기능을 제공하는 API 라우터 모듈.
SQLAlchemy 세션 의존성을 제거하고 Supabase Client를 직접 사용하도록 수정되었습니다.
"""
from typing import List
from fastapi import APIRouter, Depends, status
from app.api import deps
from app.crud import crud_community
from app.schemas.comment import CommentResponse, CommentCreate

router = APIRouter()

@router.get("/{cert_id}/comments", response_model=List[CommentResponse])
def read_comments(
    cert_id: int
) -> List[CommentResponse]:
    """
    특정 자격증에 등록된 모든 댓글 목록을 최신순으로 조회.
    Supabase 클라이언트를 통해 데이터를 직접 가져옵니다.
    """
    # db: Session 의존성 제거됨
    return crud_community.get_by_cert(cert_id=cert_id)


@router.post("/{cert_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    cert_id: int,
    comment_in: CommentCreate,
    current_user: dict = Depends(deps.get_current_user)
) -> CommentResponse:
    """
    로그인한 사용자가 특정 자격증 페이지에 댓글(팁)을 작성.
    Supabase 인증 정보를 사용합니다.
    """
    # db 파라미터 제거, current_user는 이제 dict(Supabase user 객체)입니다.
    return crud_community.create(
        cert_id=cert_id,
        user_id=current_user.id,  # Supabase User ID 사용
        content=comment_in.content
    )
