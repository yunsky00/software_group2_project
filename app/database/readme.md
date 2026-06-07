1. DB 환경 설정 (Database Environment)

DBMS: MySQL 8.0
Port: 3308 (보안 및 포트 충돌 방지를 위한 설정)
Character Set: utf8mb4 (이모지 및 다국어 지원)
2. 데이터베이스 스키마 (ERD 및 구조) 2.1 주요 테이블 정의

  테이블명                설명                                       주요 컬럼
   users             사용자 계정 정보          "email(Unique), password(Encrypted), major, interest_group"
certifications       자격증 메타데이터         "name, category, exam_date, fee, pass_rate"
user_favorites     관심 목록 및 알림 설정      "user_id, cert_id, is_muted, last_muted_at"
2.2 주요 설계 원칙 보안 및 데이터 보호

비밀번호 관리: bcrypt 라이브러리를 활용하여 단방향 암호화 후 저장하며, 원문 비밀번호는 어떠한 경우에도 DB에 노출되지 않음.
접근 제어: 외부망 직접 접속을 차단하고, 서버 애플리케이션을 통해서만 3308 포트로 데이터에 접근 가능.
예외 처리 및 가용성

데이터 캐싱: 공공 데이터 API 장애 발생 시, certifications 테이블에 저장된 가장 최신 데이터를 응답하여 서비스 연속성을 보장함.
알림 초기화: is_muted 필드는 매일 오전 00:00시를 기준으로 초기화되어 사용자에게 매일 새로운 D-day 알림을 제공함.

3. 백엔드 연동 가이드 (Backend Integration)

Connection Config:
const dbConfig = {
    host: 'localhost',
    port: 3308,
    user: 'your_user',
    password: '2026comup',
    database: 'spec_moa'
};