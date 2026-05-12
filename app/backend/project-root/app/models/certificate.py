"""
자격증(Certificate) 테이블 모델을 정의하는 모듈.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.orm import relationship
from app.db.session import Base


class Certificate(Base):
    """
    자격증 상세 정보 및 시험 일정을 관리하는 테이블 모델.
    """
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True, nullable=False)
    agency = Column(String(100), nullable=True)  # 주관 기관 (프로젝트 요구사항 반영)

    category = Column(String(50), index=True)  # 대기업/공기업/공무원 등
    job_group = Column(String(50), index=True) # 희망 직무

    closest_exam_date = Column(DateTime)       # 가장 가까운 다음 시험 날짜
    receipt_start_date = Column(DateTime)      # 시험 접수 시작일
    receipt_end_date = Column(DateTime)        # 시험 접수 마감일
    fee = Column(Integer)                      # 응시료
    pass_rate = Column(Float)                  # 합격률 (%)
    exam_time = Column(String(50))             # 시험 시간
    yearly_schedule = Column(Text)             # 해당 연도의 전체적인 시험 일정
    subjects = Column(Text)                    # 시험 과목
    benefits = Column(Text)                    # 취득 혜택
    related_jobs = Column(Text)                # 관련 직무
    yearly_applicants = Column(Integer)        # 연간 응시자 수

    view_count = Column(Integer, default=0)    # 인기 랭킹용 조회수 카운트

    # 역참조 관계 설정
    comments = relationship("Comment", back_populates="certificate")
    bookmarks = relationship("Bookmark", back_populates="certificate")