-- 데이터베이스 생성 및 포트 3308 사용
CREATE DATABASE spec_moa DEFAULT CHARACTER SET utf8mb4;
USE spec_moa;

-- 유저 테이블 (비밀번호 암호화 저장)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- SHA-256/bcrypt 암호화
    major VARCHAR(50),               -- 전공
    interest_group ENUM('대기업', '공기업', '공무원'), -- 1차 분류
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 자격증 정보 테이블 (Open API)
CREATE TABLE certifications (
    cert_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),            -- 직무 분류
    exam_date DATE,                  -- 시험 일정
    fee INT,                         -- 응시료
    pass_rate FLOAT,                 -- 합격률
    is_active_api BOOLEAN DEFAULT TRUE -- API 연동 상태 확인
);

-- 관심 자격증 및 알림 설정
CREATE TABLE user_favorites (
    fav_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    cert_id INT,
    is_muted BOOLEAN DEFAULT FALSE,  -- 오늘 하루 보지 않기 (0시 초기화 대상)
    last_muted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (cert_id) REFERENCES certifications(cert_id)
);
