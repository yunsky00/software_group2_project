"""
인증 관련 API 엔드포인트를 정의하는 모듈.
Supabase Auth와 로컬 MySQL 데이터베이스 간의 사용자 정보 동기화를 처리.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.core.supabase_client import verify_supabase_token
from app.crud import crud_user
from app.schemas.user import UserResponse

router = APIRouter()


@router.post("/sync", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def sync_user(
    res: deps.HTTPAuthorizationCredentials = Depends(deps.security),
    db: Session = Depends(deps.get_db)
) -> UserResponse:
    """
    Supabase 인증 토큰을 기반으로 로컬 데이터베이스에 사용자 정보를 동기화.
    최초 로그인 시 사용자 레코드를 생성하고, 이미 존재하는 경우 기존 정보를 반환.

    Args:
        res: 헤더로부터 추출된 Bearer 토큰 정보.
        db: 데이터베이스 세션 객체.

    Returns:
        동기화 또는 생성된 사용자 데이터 객체.

    Raises:
        HTTPException: 토큰 인증 실패 시 401 에러를 반환.
    """
    user_data = verify_supabase_token(res.credentials)
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 토큰이 유효하지 않거나 만료되었습니다."
        )

    uid: str = user_data.id
    email: str = user_data.email

    user = crud_user.get_user_by_supabase_uid(db, supabase_uid=uid)

    if user is None:
        user = crud_user.create_user(db, supabase_uid=uid, email=email)

    return user