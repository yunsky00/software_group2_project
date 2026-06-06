"""
사용자 즐겨찾기(북마크) 관련 API 라우터 모듈.
"""
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from app.api import deps
from app.crud import crud_bookmark

router = APIRouter()

@router.get("/")
def get_my_bookmarks(current_user: dict = Depends(deps.get_current_user)):
    """마이페이지 즐겨찾기 자격증 목록 조회."""
    # Supabase Auth의 user meta data에서 커스텀 user_id를 가져오거나 매핑하는 로직 필요
    user_email = current_user.email
    return crud_bookmark.get_user_bookmarks(user_id=user_email)

@router.post("/{cert_id}", status_code=status.HTTP_201_CREATED)
def create_bookmark(cert_id: int, current_user: dict = Depends(deps.get_current_user)):
    return crud_bookmark.add_bookmark(user_id=current_user.email, cert_id=cert_id)

@router.delete("/{cert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bookmark(cert_id: int, current_user: dict = Depends(deps.get_current_user)):
    success = crud_bookmark.remove_bookmark(user_id=current_user.email, cert_id=cert_id)
    if not success:
        raise HTTPException(status_code=404, detail="해당 자격증이 즐겨찾기에 없습니다.")
