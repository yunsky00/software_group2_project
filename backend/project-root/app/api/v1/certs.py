"""
자격증 관련 API 라우터 모듈.
DB 스키마: certificates(issuer), categories, jobs 테이블 사용.
"""
from fastapi import APIRouter, Request, HTTPException, status
from typing import List
from app.crud import crud_cert
from app.schemas.certificate import CertificateListResponse, CertificateDetailResponse

router = APIRouter()


@router.get("/ranking", response_model=List[CertificateListResponse])
async def get_certificate_ranking() -> List[dict]:
    """
    자격증 목록을 반환 (view_count 없으므로 전체 목록 반환).
    """
    return crud_cert.get_top_ranked(limit=100)


@router.get("/search", response_model=List[CertificateListResponse])
async def search_certificates(
    keyword: str = "",
    category: str = "",
    job_group: str = "",
) -> List[dict]:
    """
    키워드, 카테고리, 직군 기반으로 자격증을 검색.
    """
    return crud_cert.search_certs(keyword=keyword, category=category, job_group=job_group)


@router.get("/{cert_id}", response_model=CertificateDetailResponse)
async def get_certificate_detail(cert_id: int, request: Request) -> dict:
    """
    특정 자격증의 상세 정보를 조회하고 조회 로그를 기록.
    """
    ip_address = request.headers.get("X-Forwarded-For", request.client.host)

    cert = crud_cert.get_and_increase_view(cert_id=cert_id, ip_address=ip_address)
    if cert is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 자격증을 찾을 수 없습니다.",
        )
    return cert