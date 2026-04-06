import { useState } from 'react';
import { rankingData } from '../data/ranking';
import './Ranking.css';

function Ranking() {
  // 뷰 유형을 상태로 관리합니다. 실제 필터는 UI 중심으로 동작합니다.
  const [viewType, setViewType] = useState('일간');

  // 상단 요약카드에 사용할 더미 데이터
  const summaryCards = [
    { title: '최다 검색 자격증', value: '정보처리기사' },
    { title: '최대 상승 자격증', value: '정보보안기사' },
    { title: '총 검색수', value: '29,845' },
  ];

  return (
    <div className="ranking-page">
      {/* 페이지 제목과 간단한 설명 */}
      <header className="ranking-header">
        <h1 className="ranking-title">검색 순위 랭킹</h1>
        <p className="ranking-subtitle">최근 검색 트렌드를 한눈에 확인하세요.</p>
      </header>

      {/* 일간/주간/월간 필터 버튼 */}
      <div className="ranking-filters">
        {['일간', '주간', '월간'].map((type) => (
          <button
            key={type}
            type="button"
            className={`filter-button ${viewType === type ? 'active' : ''}`}
            onClick={() => setViewType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 요약 카드 */}
      <section className="summary-grid">
        {summaryCards.map((card) => (
          <article key={card.title} className="summary-card">
            <p className="summary-card-title">{card.title}</p>
            <p className="summary-card-value">{card.value}</p>
          </article>
        ))}
      </section>

      {/* 랭킹 리스트 */}
      <section className="ranking-list">
        {rankingData.map((item) => (
          <article key={item.rank} className="ranking-item">
            <div className="ranking-item-rank">{item.rank}</div>
            <div className="ranking-item-name">{item.name}</div>
            <div className="ranking-item-category">{item.category}</div>
            <div className="ranking-item-searches">{item.searches.toLocaleString()}회</div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Ranking;
