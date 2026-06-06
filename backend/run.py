"""
스펙모아 프로젝트의 애플리케이션 진입점(Entry Point) 모듈.
Uvicorn 서버를 사용하여 FastAPI 앱을 실행.
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)