"""
AI 자격증 컨설팅 API 라우터 모듈.
DB 스키마: ai_recommendation_logs(user_id integer FK).
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from app.api import deps
from app.crud import crud_consult
from app.services import ai_consultant

router = APIRouter()


@router.get("/priority")
async def get_ai_consulting(
    major: str = Query(..., description="사용자 전공"),
    job: str = Query(..., description="희망 직무"),
    target_company: str = Query(..., description="목표 기업 군"),
    current_user: dict = Depends(deps.get_current_user),
) -> dict:
    """
    사용자의 전공·직무·목표 기업 정보를 바탕으로 Gemini AI 자격증 컨설팅을 제공.
    컨설팅 결과는 ai_recommendation_logs 테이블에 저장됨.
    """
    try:
        result_text = await ai_consultant.get_priority_consulting(
            major=major,
            job=job,
            target_company=target_company,
        )

        crud_consult.save_recommendation_log(
            email=current_user.email,
            major=major,
            desired_job=job,
            target_company=target_company,
            roadmap_content=result_text,
        )

        return {"consulting_result": result_text}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI 컨설팅 중 오류 발생: {str(e)}",
        )
