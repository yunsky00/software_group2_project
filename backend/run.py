"""
스펙모아 프로젝트의 애플리케이션 진입점(Entry Point) 모듈.
Uvicorn 서버를 사용하여 FastAPI 앱을 실행.
"""
import os
import uvicorn


def main() -> None:
    """
    Uvicorn을 통해 FastAPI 애플리케이션을 실행.

    환경변수:
        APP_ENV  : 실행 환경. "development"이면 reload=True (기본값: "development")
        APP_HOST : 바인딩 호스트 (기본값: "0.0.0.0")
        APP_PORT : 바인딩 포트   (기본값: 8000)
    """
    env = os.getenv("APP_ENV", "development")
    host = os.getenv("APP_HOST", "0.0.0.0")
    port = int(os.getenv("APP_PORT", "8000"))
    is_dev = env == "development"

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=is_dev,   # 개발 환경에서만 코드 변경 시 자동 재시작
    )


if __name__ == "__main__":
    main()
