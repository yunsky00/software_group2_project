"""
인증 관련 API 엔드포인트.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from app.api import deps
from app.crud import crud_user
from app.schemas.user import UserResponse

router = APIRouter()

@router.post("/sync", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def sync_user(current_user: dict = Depends(deps.get_current_user)) -> UserResponse:
    """
    Supabase 인증 토큰을 기반으로 로컬 테이블(users)에 사용자 정보를 동기화.
    """
    email = current_user.email
    user = crud_user.get_user_by_supabase_uid(supabase_uid=email)

    if user is None:
        user = crud_user.create_user(email=email)

    return user
