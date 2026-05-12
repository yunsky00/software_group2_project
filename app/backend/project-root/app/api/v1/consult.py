"""
Gemini AI를 활용하여 사용자 맞춤형 자격증 컨설팅을 제공하는 API 라우터 모듈.
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from app.api import deps
from app.models.user import User
from app.services import ai_consultant

router = APIRouter()


@router.get("/priority")
async def get_ai_consulting(
    major: str = Query(..., description="사용자 전공"),
    job: str = Query(..., description="희망 직무"),
    target_company: str = Query(..., description="목표 기업 군"),
    current_user: User = Depends(deps.get_current_user)
) -> dict:
    """
    사용자의 전공, 직무 정보를 분석하여 AI가 자격증 우선순위를 추천.

    Args:
        major: 사용자의 전공.
        job: 사용자가 희망하는 직무.
        target_company: 사용자가 목표로 하는 기업 유형.
        current_user: 유효한 토큰을 통해 인증된 사용자 객체.

    Returns:
        AI가 생성한 컨설팅 결과 문자열.

    Raises:
        HTTPException: AI 생성 실패 시 500 에러 발생.
    """
    try:
        result_text = await ai_consultant.get_priority_consulting(
            major=major,
            job=job,
            target_company=target_company
        )
        return {"consulting_result": result_text}
    except Exception as e:
        # 광범위한 예외를 피하라는 권장 사항에 따라 HTTPException을 명시적으로 발생
        raise HTTPException(status_code=500, detail=f"AI 컨설팅 중 오류 발생: {str(e)}")