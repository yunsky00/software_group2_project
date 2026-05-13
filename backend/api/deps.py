"""
API 엔드포인트에서 공통으로 사용되는 의존성(인증, DB세션) 모듈.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.supabase_client import verify_supabase_token
from app.crud import crud_user
from app.models.user import User

# Bearer 토큰 추출기 설정
security = HTTPBearer()


def get_current_user(
    res: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    현재 요청의 헤더에서 JWT를 검증하여 유효한 사용자를 반환.

    Args:
        res: 클라이언트의 Bearer 토큰 정보.
        db: DB 세션.

    Raises:
        HTTPException: 토큰이 유효하지 않거나(401), 로컬 DB에 사용자가 없을 때(404).

    Returns:
        User: 인증된 유저 객체.
    """
    user_data = verify_supabase_token(res.credentials)
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 토큰이 유효하지 않습니다."
        )

    user = crud_user.get_user_by_supabase_uid(db, supabase_uid=user_data.id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="동기화되지 않은 사용자입니다. 회원가입 절차가 필요합니다."
        )
    return user