"""
즐겨찾기(Bookmark) 테이블 모델을 정의하는 모듈.
"""
from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base


class Bookmark(Base):
    """
    사용자가 즐겨찾기한 자격증 정보를 관리하는 테이블 모델.
    """
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cert_id = Column(Integer, ForeignKey("certificates.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="bookmarks")
    certificate = relationship("Certificate", back_populates="bookmarks")