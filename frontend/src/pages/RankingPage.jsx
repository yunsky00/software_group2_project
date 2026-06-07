import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { rankingData, rankingStats, rankingTabs } from '../data/ranking';

function RankingPage() {
  const [tab, setTab] = useState('주간');

  return (
    <div className="page-stack ranking-page">
      <Link to="/" className="back-link">← 돌아가기</Link>

      <section className="ranking-page__header">
        <div className="ranking-page__title">
          <span className="ranking-page__icon">📈</span>
          <div>
            <h1>검색 순위 랭킹</h1>
            <p>가장 많이 검색된 인기 자격증 TOP 100을 확인하세요</p>
          </div>
        </div>
      </section>

      <div className="filter-row filter-row--compact">
        {rankingTabs.map((item) => (
          <button
            key={item}
            type="button"
            className={`chip chip--tab${tab === item ? ' chip--active chip--orange' : ''}`}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="card-grid card-grid--three">
        {rankingStats.map((item) => (
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

        {rankingData.map((item) => (
          <Link key={item.id} to={`/certifications/${item.id}`} className="ranking-board__row">
            <strong>{item.rank}</strong>
            <span className={`ranking-trend ranking-trend--${item.trend}`}>
              {item.trend === 'up' ? `↑ ${item.change.replace('+', '')}` : `↓ ${item.change.replace('-', '')}`}
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
