"""
자격증 상세 조회 및 랭킹 엔드포인트 모듈.
어뷰징 방지 로직과 총 누적 조회수 기반 랭킹을 제공합니다.
"""
from fastapi import APIRouter, Depends, Request, HTTPException
from typing import List, Dict, Any
from datetime import datetime, timedelta, timezone
from app.api import deps
from app.core.supabase_client import supabase
from app.crud import crud_cert

router = APIRouter()

@router.get("/ranking")
def get_certificate_ranking(limit: int = 10) -> List[Dict[str, Any]]:
    """
    총 누적 조회수(view_count) 기준으로 자격증 랭킹을 반환합니다.
    """
    return crud_cert.get_top_ranked(limit)

@router.get("/{cert_id}")
def get_certificate_detail(
    cert_id: int, 
    request: Request, 
    current_user: dict = Depends(deps.get_current_user)
):
    """
    자격증 상세 정보를 조회하면서, 어뷰징을 방지하여 총 조회수를 증가시킵니다.
    """
    # 1. 자격증 기본 정보 조회
    cert_response = supabase.table("certificates").select("*").eq("id", cert_id).execute()
    if not cert_response.data:
        raise HTTPException(status_code=404, detail="존재하지 않는 자격증입니다.")
    
    # 2. 어뷰징 방지 검증 (5분 이내 동일 유저 조회 확인)
    client_ip = request.client.host
    five_minutes_ago = (datetime.now(timezone.utc) - timedelta(minutes=5)).isoformat()
    
    existing_log = supabase.table("certificate_view_logs") \
        .select("id") \
        .eq("certificate_id", cert_id) \
        .eq("user_id", current_user.id) \
        .gte("viewed_at", five_minutes_ago) \
        .execute()
    
    # 3. 최근 5분 이내 기록이 없다면 로그 기록 및 총 조회수 증가
    if not existing_log.data:
        # 로그 기록 (어뷰징 방지용)
        supabase.table("certificate_view_logs").insert({
            "certificate_id": cert_id,
            "user_id": current_user.id,
            "ip_address": client_ip
        }).execute()
        
        # 총 조회수 1 증가 (DB 반영)
        crud_cert.increment_view_count(cert_id)
        
        # 클라이언트에 반환할 데이터에도 즉시 반영된 조회수를 보여줌
        cert_response.data[0]["view_count"] = cert_response.data[0].get("view_count", 0) + 1
        
    return cert_response.data[0]
