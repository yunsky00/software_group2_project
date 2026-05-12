"""
자격증 정보 조회 및 검색 기능을 제공하는 API 라우터 모듈.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api import deps
from app.crud import crud_cert
from app.schemas.certificate import CertificateListResponse, CertificateDetailResponse

router = APIRouter()


@router.get("/", response_model=List[CertificateListResponse])
def get_certificates(
    category: str = Query(..., description="1차 분류 (대기업/공기업/공무원)"),
    job_group: Optional[str] = Query(None, description="2차 분류 (희망 직무)"),
    keyword: Optional[str] = Query(None, description="검색 키워드"),
    db: Session = Depends(deps.get_db)
) -> List[CertificateListResponse]:
    """
    필터 조건에 맞는 자격증 목록을 검색하여 반환.
    
    Args:
        category: 대기업, 공기업 등 1차 분류.
        job_group: 희망 직무 (선택).
        keyword: 검색어 (선택).
        db: DB 세션.
        
    Returns:
        조건에 부합하는 자격증 축약 정보 목록.
    """
    return crud_cert.search_certificates(
        db, category=category, job_group=job_group, keyword=keyword
    )


@router.get("/ranking", response_model=List[CertificateListResponse])
def get_certificate_ranking(db: Session = Depends(deps.get_db)) -> List[CertificateListResponse]:
    """
    조회수(View Count)를 기준으로 상위 100개의 인기 자격증을 반환.
    
    Args:
        db: DB 세션.
        
    Returns:
        상위 인기 자격증 목록.
    """
    return crud_cert.get_top_ranked(db, limit=100)


@router.get("/{cert_id}", response_model=CertificateDetailResponse)
def get_certificate_detail(
    cert_id: int,
    db: Session = Depends(deps.get_db)
) -> CertificateDetailResponse:
    """
    특정 자격증의 상세 정보를 조회합니다. 조회 시 해당 자격증의 조회수가 1 증가.

    Args:
        cert_id: 조회할 자격증의 고유 ID.
        db: DB 세션.

    Returns:
        자격증 상세 정보.

    Raises:
        HTTPException: 해당 ID의 자격증이 존재하지 않을 경우 404 에러.
    """
    cert = crud_cert.get_and_increase_view(db, cert_id=cert_id)
    if cert is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 자격증 정보를 찾을 수 없습니다."
        )
    return cert