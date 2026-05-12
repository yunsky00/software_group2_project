"""
사용자 즐겨찾기(북마크) 관련 API 라우터 모듈.
"""
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.crud import crud_bookmark
from app.schemas.bookmark import BookmarkResponse

router = APIRouter()


@router.get("/", response_model=List[BookmarkResponse])
def get_my_bookmarks(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> List[BookmarkResponse]:
    """
    로그인한 사용자의 마이페이지에서 확인 가능한 즐겨찾기 자격증 목록을 조회.

    Args:
        db: DB 세션.
        current_user: 인증된 현재 사용자 객체.

    Returns:
        사용자의 즐겨찾기 목록.
    """
    return crud_bookmark.get_user_bookmarks(db, user_id=current_user.id)


@router.post("/{cert_id}", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
def create_bookmark(
    cert_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> BookmarkResponse:
    """
    특정 자격증을 사용자의 즐겨찾기에 추가.

    Args:
        cert_id: 자격증 고유 ID.
        db: DB 세션.
        current_user: 인증된 현재 사용자 객체.

    Returns:
        생성된 북마크 객체.
    """
    bookmark = crud_bookmark.add_bookmark(db, user_id=current_user.id, cert_id=cert_id)
    return bookmark


@router.delete("/{cert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bookmark(
    cert_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> None:
    """
    사용자의 즐겨찾기 목록에서 특정 자격증을 삭제.

    Args:
        cert_id: 삭제할 자격증의 고유 ID.
        db: DB 세션.
        current_user: 인증된 현재 사용자 객체.

    Raises:
        HTTPException: 북마크가 존재하지 않을 때 404 발생.
    """
    success = crud_bookmark.remove_bookmark(db, user_id=current_user.id, cert_id=cert_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="해당 자격증이 즐겨찾기에 없습니다."
        )