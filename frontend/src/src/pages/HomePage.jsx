import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoryMeta, certifications } from '../data/certifications';

const categoryCards = [
  { key: 'corporate', subtitle: '삼성, LG, 현대 등', tone: 'blue' },
  { key: 'public', subtitle: '한전, 도로공사 등', tone: 'violet' },
  { key: 'government', subtitle: '행정직, 기술직 등', tone: 'pink' },
];

const featureCards = [
  {
    to: '/ranking',
    icon: '📈',
    title: '검색 순위 랭킹',
    description: '가장 많이 검색된 인기 자격증 TOP 100',
  },
  {
    to: '/recommendation',
    icon: '🎯',
    title: '직무 맞춤 추천',
    description: 'AI 기반 개인 맞춤형 자격증 추천',
  },
  {
    to: '/schedule',
    icon: '🗓️',
    title: 'D-day 시험일정 캘린더',
    description: '다가오는 시험 일정과 접수 마감일 관리',
  },
];

function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return certifications.filter((item) =>
      [item.name, item.field, item.organization, ...item.keywords].join(' ').toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <div className="page-stack">
      <section className="home-hero">
        <span className="hero-badge">스펙모아</span>
        <h1>취업과 커리어를 위한 맞춤형 자격증 추천</h1>
        <p>
          복잡한 자격증 정보를 한눈에 보고, 구직자의 목표에 어울리는 직무 맞춤형 커리어 가이드를
          제공합니다.
        </p>

        <div className="home-search">
          <label className="search-field search-field--hero">
            <span className="search-field__icon">⌕</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="자격증 이름, 직무, 키워드로 검색해보세요..."
            />
          </label>

          {query && (
            <div className="search-results home-search-results">
              {searchResults.length > 0 ? (
                searchResults.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="search-results__item"
                    onClick={() => navigate(`/certifications/${item.id}`)}
                  >
                    <strong>{item.name}</strong>
                    <span>{item.field} · {item.organization}</span>
                  </button>
                ))
              ) : (
                <div className="search-results__empty">검색 결과가 없습니다.</div>
              )}
            </div>
          )}
        </div>

        <h2 className="home-section-title">빠른 카테고리 선택</h2>

        <div className="home-category-grid">
          {categoryCards.map((card) => (
            <button
              key={card.key}
              type="button"
              className={`home-category-card home-category-card--${card.tone}`}
              onClick={() => navigate(`/category/${card.key}`)}
            >
              <span className="home-category-card__icon">{categoryMeta[card.key].icon}</span>
              <strong>{categoryMeta[card.key].title}</strong>
              <p>{card.subtitle}</p>
            </button>
          ))}
        </div>

        <div className="home-feature-grid">
          {featureCards.map((item) => (
            <Link key={item.to} to={item.to} className="home-feature-card">
              <span className="home-feature-card__icon">{item.icon}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
