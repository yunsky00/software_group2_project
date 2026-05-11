"""
Alembic 마이그레이션 등을 위한 모델 통합 모듈.
"""
from app.db.session import Base
from app.models.user import User
from app.models.certificate import Certificate
from app.models.comment import Comment
from app.models.bookmark import Bookmark