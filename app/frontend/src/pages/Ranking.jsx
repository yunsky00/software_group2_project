import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rankingData } from '../data/ranking';
import './Ranking.css';

const CATEGORY_LABELS = {
  corporate: '민간자격',
  public: '국가전문자격',
  government: '국가기술자격',
};

function Ranking() {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState('주간');

  const summaryCards = [
    {
      title: '최다 검색',
      value: '정보처리기사',
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
      title: '총 검색수',
      value: '90,840',
      description: '이번 주 전체 검색',
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
          <p className="ranking-subtitle">가장 많이 검색된 인기 자격증 TOP 100을 확인하세요</p>
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
        {rankingData.map((item) => (
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
        ))}
      </section>

      <div className="view-more">더 보기 (100위까지)</div>
    </div>
  );
}

export default Ranking;
