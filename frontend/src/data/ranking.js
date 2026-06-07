export const rankingTabs = ['일간', '주간', '월간'];

export const rankingStats = {
  '일간': [
    { label: '최다 검색', value: '컴퓨터활용능력 1급', sublabel: '오늘의 인기', tone: 'orange' },
    { label: '최대 상승', value: '위험물산업기사', sublabel: '급상승 중', tone: 'blue' },
    { label: '총 검색수', value: '12,500', sublabel: '오늘 전체 검색', tone: 'violet' },
  ],
  '주간': [
    { label: '최다 검색', value: '정보처리기사', sublabel: 'TOP 검색 자격증', tone: 'orange' },
    { label: '최대 상승', value: 'SQLD', sublabel: '검색량 상승폭', tone: 'blue' },
    { label: '총 검색수', value: '90,840', sublabel: '이번 주 전체 검색', tone: 'violet' },
  ],
  '월간': [
    { label: '최다 검색', value: '공인중개사', sublabel: '이번 달 최강자', tone: 'orange' },
    { label: '최대 상승', value: '전기기사', sublabel: '상승세 유지', tone: 'blue' },
    { label: '총 검색수', value: '380,200', sublabel: '이번 달 전체 검색', tone: 'violet' },
  ]
};

export const rankingData = {
  '일간': [
    { id: 'com-1', rank: 1, change: '+1', trend: 'up', categoryLabel: '국가기술', searches: 850, name: '컴퓨터활용능력 1급' },
    { id: 'sql-d', rank: 2, change: '+5', trend: 'up', categoryLabel: '민간자격', searches: 720, name: 'SQLD (SQL 개발자)' },
    { id: 'elec-eng', rank: 3, change: '-1', trend: 'down', categoryLabel: '국가기술', searches: 680, name: '전기기사' },
    { id: 'gen-mach', rank: 4, change: '+2', trend: 'up', categoryLabel: '국가기술', searches: 510, name: '일반기계기사' },
    { id: 'web-design', rank: 5, change: '0', trend: 'neutral', categoryLabel: '국가기술', searches: 490, name: '웹디자인기능사' },
    { id: 'counselor', rank: 6, change: '+3', trend: 'up', categoryLabel: '국가전문', searches: 450, name: '직업상담사 2급' },
    { id: 'social-worker', rank: 7, change: '-1', trend: 'down', categoryLabel: '국가전문', searches: 420, name: '사회복지사 1급' },
  ],
  '주간': [
    { id: 'info-eng', rank: 1, change: '+2', trend: 'up', categoryLabel: '국가기술', searches: 3421, name: '정보처리기사' },
    { id: 'big-data', rank: 2, change: '+1', trend: 'up', categoryLabel: '국가전문', searches: 2985, name: '빅데이터 분석기사' },
    { id: 'arch-eng', rank: 3, change: '-2', trend: 'down', categoryLabel: '국가기술', searches: 2650, name: '건축기사' },
    { id: 'safety-eng', rank: 4, change: '+3', trend: 'up', categoryLabel: '국가기술', searches: 2210, name: '산업안전기사' },
    { id: 'tax-2', rank: 5, change: '-1', trend: 'down', categoryLabel: '국가공인', searches: 2150, name: '전산세무 2급' },
    { id: 'logistics', rank: 6, change: '+2', trend: 'up', categoryLabel: '국가전문', searches: 1980, name: '물류관리사' },
    { id: 'gas-eng', rank: 7, change: '0', trend: 'neutral', categoryLabel: '국가기술', searches: 1850, name: '가스기사' },
  ],
  '월간': [
    { id: 'real-estate', rank: 1, change: '0', trend: 'neutral', categoryLabel: '국가전문', searches: 15400, name: '공인중개사' },
    { id: 'electric-eng', rank: 2, change: '+1', trend: 'up', categoryLabel: '국가기술', searches: 12100, name: '전기기사' },
    { id: 'housing-manager', rank: 3, change: '-1', trend: 'down', categoryLabel: '국가전문', searches: 11800, name: '주택관리사보' },
    { id: 'damage-eval', rank: 4, change: '+5', trend: 'up', categoryLabel: '국가전문', searches: 9200, name: '손해평가사' },
    { id: 'tour-guide', rank: 5, change: '-1', trend: 'down', categoryLabel: '국가전문', searches: 8700, name: '관광통역안내사' },
    { id: 'fire-eng', rank: 6, change: '+2', trend: 'up', categoryLabel: '국가기술', searches: 8100, name: '소방설비기사' },
    { id: 'office-auto', rank: 7, change: '0', trend: 'neutral', categoryLabel: '국가기술', searches: 7600, name: '사무자동화산업기사' },
  ]
};