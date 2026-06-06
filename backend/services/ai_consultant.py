"""
Google Gemini AI 연동 모듈 (google-genai 최신 SDK 적용).
"""
from google import genai
from app.core.config import settings

# 1. 클라이언트 객체 하나만 생성합니다. (configure는 필요 없습니다)
client = genai.Client(api_key=settings.AI_API_KEY)

async def get_priority_consulting(major: str, job: str, target_company: str) -> str:
    """
    Gemini 모델을 호출하여 맞춤형 자격증 컨설팅 정보를 획득.
    """
    prompt = f"""
    당신은 취업 전문가입니다. 다음 정보를 기반으로 자격증 우선순위를 추천하세요.
    - 전공: {major}, 직무: {job}, 목표기업: {target_company}
    상세한 이유와 혜택을 마크다운 형식으로 답변해 주세요.
    """
    
    # 2. client.models.generate_content를 통해 모델을 호출합니다.
    # gemini-1.5-flash 모델 사용
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt
    )
    
    if response and response.text:
        return response.text
    return "결과를 생성할 수 없습니다."
