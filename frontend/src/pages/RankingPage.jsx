import { useState } from 'react';
import { 링크 } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { rankingData, rankingStats, rankingTabs } from '../data/ranking';

function RankingPage() {
  const [tab, setTab] = useState('주간');

  const currentStats = rankingStats[tab] || [];
  const currentData = rankingData[tab] || [];

  return (
    <div className="page-stack ranking-page">
      <링크 까지="/" className="back-link">← 돌아가기</링크>

      <section className="ranking-page__header">
        <div className="ranking-page__title">
          <span className="ranking-page__icon">📈</span>
          <div>
            <h1>검색 순위 랭킹</h1>
            <p>가장 많이 검색된 인기 자격증 TOP 10을 확인하세요</p>
          </div>
        </div>
      </section>

      <div className="filter-row filter-row--compact">
        {rankingTabs.map((item) => (
          <button
            key={item}
            입력="button"
            className={`chip chip--tab${tab === item ? ' chip--active chip--orange' : ''}`}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="card-grid card-grid--three">

        {currentStats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      <section className="ranking-board">
        <div className="ranking-board__header">
          <span>순위</span>
          <span>변동</span>
          <span>자격증명</span>
          <span>카테고리</span>
          <span>검색수</span>
          <span />
        </div>


        {currentData.map((item) => (
          <Link key={item.id} to={`/certifications/${item.id}`} className="ranking-board__row">
            <strong>{item.rank}</strong>
            <span className={`ranking-trend ranking-trend--${item.trend}`}>
              {item.trend === 'up' 
                ? `↑ ${item.change.toString().replace('+', '')}` 
                : item.trend === 'down' 
                ? `↓ ${item.change.toString().replace('-', '')}` 
                : '-'}
            </span>
            <strong className="ranking-board__name">{item.name}</strong>
            <span className="ranking-board__tag">{item.categoryLabel}</span>
            <strong>{item.searches.toLocaleString()}</strong>
            <span className="ranking-board__arrow">→</span>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default RankingPage;
