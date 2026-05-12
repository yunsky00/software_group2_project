"""
FastAPI 애플리케이션의 메인 설정 모듈.
CORS 설정 및 각 기능별 API 라우터를 등록하고 전역 예외 처리를 수행.
"""
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# v1 API 라우터 임포트
from app.api.v1 import certs, auth, consult, community, calendar, bookmarks

# FastAPI 앱 객체 생성
app = FastAPI(title="SpecMoa Backend", description="스펙모아 프로젝트 백엔드 API")

# CORS 미들웨어 설정 (프론트엔드와 통신 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록 (URL 접두사와 태그 지정)
app.include_router(certs.router, prefix="/api/v1/certs", tags=["Certs"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(consult.router, prefix="/api/v1/consult", tags=["AI"])
app.include_router(community.router, prefix="/api/v1/community", tags=["Community"])
app.include_router(calendar.router, prefix="/api/v1/calendar", tags=["Calendar"])
app.include_router(bookmarks.router, prefix="/api/v1/bookmarks", tags=["Bookmarks"])


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    애플리케이션 전역에서 발생하는 처리되지 않은 예외를 핸들링.

    Args:
        request: 실패한 HTTP 요청 객체.
        exc: 발생한 예외 객체.

    Returns:
        JSONResponse: 500 상태 코드와 에러 메시지를 포함한 응답.
    """
    logging.error(f"Global Error handling request {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "내부 서버 오류가 발생했습니다."}
    )