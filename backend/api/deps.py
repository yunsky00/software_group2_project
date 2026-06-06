"""
FastAPI 의존성 주입(Dependency Injection) 모듈.
Supabase Auth 토큰 검증을 통해 현재 로그인한 사용자 정보를 식별합니다.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.supabase_client import verify_supabase_token

security = HTTPBearer()

def get_current_user(res: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    클라이언트가 전송한 Bearer JWT 토큰을 Supabase Auth를 통해 검증합니다.
    인증 성공 시 Supabase의 유저 객체(id, email 등 포함)를 반환합니다.
    """
    user_data = verify_supabase_token(res.credentials)
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 토큰이 만료되었거나 유효하지 않습니다."
        )
    # user_data 내부에 email, id(UUID) 등이 포함되어 있습니다.
    return user_data
