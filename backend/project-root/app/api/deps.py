"""
API 의존성(Dependency) 모듈.
자체 users 테이블 기반 JWT 토큰 검증.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.supabase_client import supabase

security = HTTPBearer()


def get_current_user(
    res: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Supabase Auth 토큰을 검증하여 현재 유저 정보를 반환.

    Args:
        res: Authorization 헤더에서 추출된 Bearer 토큰 정보.

    Returns:
        Supabase user 객체 (id, email 등 포함).

    Raises:
        HTTPException: 토큰이 유효하지 않으면 401 에러 반환.
    """
    try:
        user_response = supabase.auth.get_user(res.credentials)
        user = user_response.user
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="인증 토큰이 유효하지 않습니다.",
            )
        return user
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 토큰이 유효하지 않습니다.",
        )