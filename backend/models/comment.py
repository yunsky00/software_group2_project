"""
댓글(Comment) 테이블 모델을 정의하는 모듈.
"""
from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base


class Comment(Base):
    """
    사용자가 자격증 페이지에 남기는 댓글(팁 공유 커뮤니티) 테이블 모델.
    """
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"))
    cert_id = Column(Integer, ForeignKey("certificates.id"))

    user = relationship("User", back_populates="comments")
    certificate = relationship("Certificate", back_populates="comments")