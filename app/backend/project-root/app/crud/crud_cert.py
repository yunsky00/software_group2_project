"""
자격증 DB 쿼리 및 로직을 처리하는 모듈.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.certificate import Certificate


def search_certificates(
    db: Session,
    category: str,
    job_group: Optional[str] = None,
    keyword: Optional[str] = None
) -> List[Certificate]:
    """
    조건(분류, 직무, 검색어)에 맞는 자격증을 검색.

    Args:
        db: 데이터베이스 세션.
        category: 1차 분류 (대기업/공기업/공무원).
        job_group: 2차 분류(직무).
        keyword: 검색할 자격증 이름 키워드.

    Returns:
        검색된 자격증 목록.
    """
    query = db.query(Certificate).filter(Certificate.category == category)

    if job_group is not None:
        query = query.filter(Certificate.job_group == job_group)
    if keyword is not None:
        query = query.filter(Certificate.name.contains(keyword))

    return query.all()


def get_top_ranked(db: Session, limit: int = 100) -> List[Certificate]:
    """
    조회수(view_count)가 가장 높은 인기 자격증 랭킹을 조회.

    Args:
        db: 데이터베이스 세션.
        limit: 상위 몇 개를 가져올지 지정 (요구사항 반영: 100개).

    Returns:
        인기 자격증 목록.
    """
    return db.query(Certificate).order_by(Certificate.view_count.desc()).limit(limit).all()


def get_and_increase_view(db: Session, cert_id: int) -> Optional[Certificate]:
    """
    특정 자격증 상세 정보를 가져옴과 동시에 조회수를 1 증가.

    Args:
        db: 데이터베이스 세션.
        cert_id: 조회할 자격증의 식별자 ID.

    Returns:
        조회된 자격증 객체. 없을 경우 None 반환.
    """
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if cert is not None:
        cert.view_count += 1
        db.commit()
        db.refresh(cert)
    return cert