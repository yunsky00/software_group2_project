"""
공공데이터(Q-Net) 연동 모듈.
"""
import httpx


async def fetch_latest_schedules() -> None:
    """
    공공데이터포털 Open API를 호출하여 최신 자격증 일정을 DB에 업데이트.
    향후 외부 API 스펙에 맞춰 개발되어야 하는 부분.
    """
    pass