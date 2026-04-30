const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // 비밀번호 암호화
const app = express();

app.use(express.json());

// 3308 포트 및 DB 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '본인비밀번호',
    database: 'spec_moa',
    port: 3308 
});

// 맞춤형 자격증 추천 API
app.get('/api/recommend/:userId', (req, res) => {
    const userId = req.params.userId;
    
    // 유저 전공/직군 기반 추천
    const query = `
        SELECT c.* FROM certifications c
        JOIN users u ON u.interest_group = c.category
        WHERE u.user_id = ?
        ORDER BY c.pass_rate DESC LIMIT 5`;

    db.query(query, [userId], (err, results) => {
        if (err) {
            // API/DB 오류 시 로컬 캐시 메시지
            return res.status(500).json({ 
                message: "데이터 로드 실패. 기존 캐시 데이터 표시.",
                data: [] 
            });
        }
        res.json(results);
    });
});

// 알림 해제 및 0시 초기화 로직 (기본 개념적 구현만)
app.post('/api/mute-notification', (req, res) => {
    const { userId, certId } = req.body;
    const query = "UPDATE user_favorites SET is_muted = TRUE, last_muted_at = NOW() WHERE user_id = ? AND cert_id = ?";
    
    db.query(query, [userId, certId], (err) => {
        if (err) throw err;
        res.json({ message: "오늘 하루 알림을 표시하지 않습니다." });
    });
});

app.listen(3000, () => {
    console.log('스펙모아 서버 구동 중 (Port: 3000, DB Port: 3308)');
});
