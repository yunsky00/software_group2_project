"""
MySQL 연결 및 세션 관리를 담당하는 모듈.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Generator

from app.core.config import settings

# pool_pre_ping: 연결이 끊겼는지 미리 확인하여 DB 에러 방지
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator:
    """
    요청 주기 동안 사용할 데이터베이스 세션을 생성하고 종료 시 반납.

    Yields:
        Session: SQLAlchemy 데이터베이스 세션.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()