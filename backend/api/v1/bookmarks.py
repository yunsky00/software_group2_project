"""
사용자 즐겨찾기(북마크) 관련 API 라우터 모듈.
DB 스키마에 맞게 email 기반으로 user_id를 조회하여 처리.
"""
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from app.api import deps
from app.crud import crud_bookmark
from app.schemas.bookmark import BookmarkResponse

router = APIRouter()


@router.get("/", response_model=List[BookmarkResponse])
async def get_my_bookmarks(
    current_user: dict = Depends(deps.get_current_user),
) -> List[BookmarkResponse]:
    """
    로그인한 사용자의 즐겨찾기 자격증 목록을 조회.
    """
    email: str = current_user.email
    return crud_bookmark.get_user_bookmarks(email=email)


@router.post("/{cert_id}", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
async def create_bookmark(
    cert_id: int,
    current_user: dict = Depends(deps.get_current_user),
) -> BookmarkResponse:
    """
    특정 자격증을 사용자의 즐겨찾기에 추가.
    """
    email: str = current_user.email
    bookmark = crud_bookmark.add_bookmark(email=email, cert_id=cert_id)
    if bookmark is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="즐겨찾기 추가 중 오류가 발생했습니다.",
        )
    return bookmark


@router.delete("/{cert_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bookmark(
    cert_id: int,
    current_user: dict = Depends(deps.get_current_user),
) -> None:
    """
    사용자의 즐겨찾기 목록에서 특정 자격증을 삭제.
    """
    email: str = current_user.email
    success = crud_bookmark.remove_bookmark(email=email, cert_id=cert_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 자격증이 즐겨찾기에 없습니다.",
        )
