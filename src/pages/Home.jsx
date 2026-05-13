import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const categoryCards = [
    {
      icon: '🏢',
      title: '대기업',
      description: '삼성, LG, 현대 등',
      path: '/category/corporate',
      accent: '#d3e4fe',
      borderColor: '#bdd7fe',
      hoverAccent: '#c8ddfe',
    },
    {
      icon: '🏛️',
      title: '공기업',
      description: '한전, 도로공사 등',
      path: '/category/public',
      accent: '#e9e2fe',
      borderColor: '#ddd1fe',
      hoverAccent: '#e1d7fe',
    },
    {
      icon: '🧑🏻‍💼',
      title: '공무원',
      description: '행정직, 기술직 등',
      path: '/category/government',
      accent: '#fce0ee',
      borderColor: '#f9c9df',
      hoverAccent: '#fbd5e7',
    },
  ];

  const featureCards = [
    {
      icon: '📈',
      title: '검색 순위 랭킹',
      description: '가장 많이 검색된 인기 자격증 TOP 100',
      path: '/ranking',
      accent: '#fef9c3',
    },
    {
      icon: '🎯',
      title: '직무 맞춤 추천',
      description: 'AI 기반 개인 맞춤형 자격증 추천',
      path: '/recommendation',
      accent: '#d1fae5',
    },
    {
      icon: '🗓️',
      title: 'D-day 시험일정 캘린더',
      description: '다가오는 시험 일정과 접수 마감일 관리',
      path: '/schedule',
      accent: '#fee2e2',
    },
  ];

  return (
    <div className="home-container">
      <section className="home-hero">
        <div className="home-badge">
          <span>스펙모아</span>
        </div>
        <h1 className="home-title">취업과 커리어를 위한 맞춤형 자격증 추천</h1>
        <p className="home-subtitle">
          복잡한 자격증 정보를 한눈에 보고, 구직자의 목표에 어울리는 직무 맞춤형 커리어 가이드를 제공합니다.
        </p>
      </section>

      <section className="search-section">
        <div className="search-box">
          <span className="search-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="search-icon-svg"
            >
              <circle
                cx="11"
                cy="11"
                r="6.5"
                stroke="currentColor"
                strokeWidth="2.2"
              />
              <path
                d="M16 16L20 20"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="자격증 이름, 직무, 키워드로 검색해보세요..."
            aria-label="자격증 검색"
          />
        </div>
      </section>

      <section className="home-label">빠른 카테고리 선택</section>

      <section className="home-category-grid">
        {categoryCards.map((card) => (
          <article
            key={card.path}
            className="home-category-card"
            style={{
              '--category-bg': card.accent,
              '--category-border': card.borderColor,
              '--category-hover-bg': card.hoverAccent,
            }}
            onClick={() => navigate(card.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                navigate(card.path);
              }
            }}
          >
            <div className="home-category-card-icon">{card.icon}</div>
            <h2 className="home-category-card-title">{card.title}</h2>
            <p className="home-category-card-description">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="home-feature-grid">
        {featureCards.map((card) => (
          <article
            key={card.path}
            className="home-feature-card"
            onClick={() => navigate(card.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                navigate(card.path);
              }
            }}
          >
            <div className="home-feature-card-icon">{card.icon}</div>
            <div>
              <h3 className="home-feature-card-title">{card.title}</h3>
              <p className="home-feature-card-description">{card.description}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Home;
