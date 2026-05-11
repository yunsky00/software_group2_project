"""
사용자(User) 테이블 모델을 정의하는 모듈.
"""
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base


class User(Base):
    """
    사용자 계정 정보 테이블 모델.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    supabase_uid = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True)
    nickname = Column(String(50), nullable=True)

    # 역참조 관계 설정
    comments = relationship("Comment", back_populates="user")
    bookmarks = relationship("Bookmark", back_populates="user")