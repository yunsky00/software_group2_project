"""
스펙모아 프로젝트의 애플리케이션 진입점(Entry Point) 모듈.
Uvicorn 서버를 사용하여 FastAPI 앱을 실행.
"""
import uvicorn


def main() -> None:
    """
    Uvicorn을 통해 FastAPI 애플리케이션을 실행.
    """
    # app 모듈 안의 main.py에 위치한 'app' 객체를 실행.
    # reload=True 옵션으로 코드 변경 시 서버가 자동 재시작.
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)


if __name__ == "__main__":
    main()