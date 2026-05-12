"""
Google Gemini AI 연동 모듈.
"""
import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.AI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')


async def get_priority_consulting(major: str, job: str, target_company: str) -> str:
    """
    Gemini 모델을 호출하여 맞춤형 자격증 컨설팅 정보를 획득.

    Args:
        major: 전공.
        job: 희망 직무.
        target_company: 목표 기업 유형.

    Returns:
        AI가 생성한 답변(Markdown 형식).
    """
    prompt = f"""
    당신은 취업 전문가입니다. 다음 정보를 기반으로 자격증 우선순위를 추천하세요.
    - 전공: {major}, 직무: {job}, 목표기업: {target_company}
    상세한 이유와 혜택을 마크다운 형식으로 답변해 주세요.
    """
    
    response = await model.generate_content_async(prompt)
    if response:
        return response.text
    return "결과를 생성할 수 없습니다."