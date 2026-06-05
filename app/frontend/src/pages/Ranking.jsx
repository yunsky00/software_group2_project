import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ranking.css';

// 수파베이스 클라이언트 가져오기
import { supabase } from './supabaseClient'; 

const CATEGORY_LABELS = {
  corporate: '민간자격',
  public: '국가전문자격',
  government: '국가기술자격',
};

function Ranking() {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState('주간'); // 일간, 주간, 월간 탭 상태
  const [rankingList, setRankingList] = useState([]); // 실시간 랭킹 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    async function fetchRankingData() {
      setLoading(true);
      try {
        // v_weekly_certificate_ranking 실시간 뷰(View)
        const { data, error } = await supabase
          .from('v_weekly_certificate_ranking')
          .select('*')
          .limit(10); // 상위 10개만 콕 집어 가져오기
        
        if (error) throw error;

        if (data) {
          // 📊 수파베이스 뷰의 컬럼 구조를 프론트엔드 UI 포맷에 맞게 자석처럼 매칭
          const formattedData = data.map((item, index) => ({
            rank: index + 1,
            trend: 'none', // 실시간 로그에서는 변동폭 대신 기본 대시(—)로 표기
            change: 0,
            name: item.cert_name, // DB의 자격증명
            category: 'government', // 국가기술자격으로 기본 매칭 (필요시 데이터 추가 가능)
            searches: item.total_views // DB의 누적 조회수
          }));
          
          setRankingList(formattedData);
        }
      } catch (error) {
        console.error("수파베이스 랭킹 데이터 로드 실패:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRankingData();
  }, [viewType]); // 일간/주간/월간 탭을 누르면 수파베이스에서 최신 데이터 실시간으로 불러옴

  // 상단 요약 카드 데이터 실시간 연동
  const topCertificateName = rankingList[0]?.name || '집계 중...';
  const totalSearchesSum = rankingList.reduce((sum, item) => sum + item.searches, 0).toLocaleString();

  const summaryCards = [
    {
      title: '최다 검색',
      value: topCertificateName, // 실시간 1위 자격증 자동 반영
      description: 'TOP 검색 자격증',
      variant: 'orange',
    },
    {
      title: '최대 상승',
      value: 'SQLD (SQL 개발자)', 
      description: '검색량 상승폭',
      variant: 'blue',
    },
    {
      title: 'TOP 10 총 조회수',
      value: totalSearchesSum, // 상위 10개 자격증의 실시간 총 클릭 수 합산
      description: '현재 랭킹 조회수 합',
      variant: 'purple',
    },
  ];

  return (
    <div className="ranking-page">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        ← 돌아가기
      </button>

      <header className="ranking-header">
        <div className="ranking-icon">📈</div>
        <div>
          <h1 className="ranking-title">검색 순위 랭킹</h1>
          <p className="ranking-subtitle">가장 많이 검색된 인기 자격증 TOP 10을 확인하세요</p>
        </div>
      </header>

      <div className="ranking-controls">
        <div className="ranking-tabs">
          {['일간', '주간', '월간'].map((type) => (
            <button
              key={type}
              type="button"
              className={`tab-button ${viewType === type ? 'active' : ''}`}
              onClick={() => setViewType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <section className="summary-grid">
        {summaryCards.map((card) => (
          <article key={card.title} className={`summary-card summary-card-${card.variant}`}>
            <p className="summary-card-tag">{card.title}</p>
            <h2 className="summary-card-value">{card.value}</h2>
            <p className="summary-card-note">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="ranking-table">
        <div className="table-header">
          <span>순위</span>
          <span>변동</span>
          <span>자격증명</span>
          <span>카테고리</span>
          <span>검색수</span>
          <span />
        </div>
        
        {loading ? (
          <div className="table-row" style={{ justifyContent: 'center', padding: '40px', color: '#888' }}>
            🔄 실시간 랭킹 집계 중...
          </div>
        ) : rankingList.length === 0 ? (
          <div className="table-row" style={{ justifyContent: 'center', padding: '40px', color: '#888' }}>
            아직 누적된 자격증 조회 로그가 없습니다.
          </div>
        ) : (
          rankingList.map((item) => (
            <div
              key={item.rank}
              className="table-row clickable-row"
              onClick={() => navigate(`/certificate/${encodeURIComponent(item.name)}`)}
            >
              <div className="row-rank">{item.rank}</div>
              <div className={`row-trend ${item.trend === 'up' ? 'trend-up' : item.trend === 'down' ? 'trend-down' : ''}`}>
                {item.trend === 'up' ? `↑ ${item.change}` : item.trend === 'down' ? `↓ ${item.change}` : '—'}
              </div>
              <div className="row-name">{item.name}</div>
              <div className="row-category">{CATEGORY_LABELS[item.category] || item.category}</div>
              <div className="row-searches">{item.searches.toLocaleString()}</div>
              <div className="row-action">→</div>
            </div>
          ))
        )}
      </section>

      <div className="view-more">Supabase 실시간 데이터 연동 완료 (TOP 10)</div>
    </div>
  );
}

export default Ranking;
