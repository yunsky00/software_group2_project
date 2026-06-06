"""
인증 관련 API 엔드포인트.
Supabase Auth 토큰을 검증하고 users 테이블과 동기화.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from app.api import deps
from app.crud import crud_user
from app.schemas.user import UserResponse

router = APIRouter()


@router.post("/sync", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def sync_user(
    current_user: dict = Depends(deps.get_current_user),
) -> UserResponse:
    """
    Supabase 인증 토큰을 기반으로 users 테이블에 사용자 정보를 동기화.
    최초 로그인 시 사용자 레코드를 생성하고, 이미 존재하는 경우 기존 정보를 반환.

    Args:
        current_user: 검증된 Supabase 유저 객체 (id, email 포함).

    Returns:
        동기화 또는 생성된 사용자 데이터.

    Raises:
        HTTPException: 유저 정보 처리 중 오류 발생 시 500 에러 반환.
    """
    email: str = current_user.email

    user = crud_user.get_user_by_email(email)

    if user is None:
        user = crud_user.create_user(email=email)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="사용자 정보를 처리하는 중 오류가 발생했습니다.",
        )

    return user
