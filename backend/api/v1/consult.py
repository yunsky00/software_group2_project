"""
AI 컨설팅 관련 엔드포인트를 제공하는 라우터 모듈.
결과물을 테이블에 캐싱하고, 마이페이지에서 다시 볼 수 있는 기능을 지원합니다.
"""
from fastapi import APIRouter, Depends, Query, HTTPException, status
from typing import List, Dict, Any
from app.api import deps
from app.services import ai_consultant
from app.core.supabase_client import supabase

router = APIRouter()

@router.post("/priority", status_code=status.HTTP_201_CREATED)
async def create_ai_consulting(
    major: str = Query(..., description="사용자 전공"),
    job: str = Query(..., description="희망 직무"),
    target_company: str = Query(..., description="목표 기업 군"),
    current_user: dict = Depends(deps.get_current_user)
) -> dict:
    """
    새로운 AI 직무 맞춤형 로드맵을 생성하고 결과를 데이터베이스에 저장(캐싱)합니다.
    """
    try:
        # 1. Gemini API를 통해 로드맵 텍스트 생성
        result_text = await ai_consultant.get_priority_consulting(major, job, target_company)

        # 2. 비용 절감 및 다시 보기를 위해 입력값과 출력 결과물을 로그 테이블에 영구 저장
        supabase.table("ai_recommendation_logs").insert({
            "user_id": current_user.id,  # Supabase Auth의 고유 식별자(또는 이메일 연동 ID)
            "major": major,
            "desired_job": job,
            "target_company": target_company,
            "roadmap_content": result_text
        }).execute()

        return {"consulting_result": result_text}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"AI 컨설팅 생성 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/history", response_model=List[Dict[str, Any]])
def get_consulting_history(current_user: dict = Depends(deps.get_current_user)):
    """
    [마이페이지 용] 사용자가 과거에 받았던 추천 로드맵 다시 보기 목록을 조회합니다.
    Gemini API를 재호출하지 않으므로 비용과 속도 측면에서 효율적입니다.
    """
    response = supabase.table("ai_recommendation_logs") \
        .select("*") \
        .eq("user_id", current_user.id) \
        .order("created_at", desc=True) \
        .execute()
    
    return response.data
