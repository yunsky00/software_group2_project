import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const categoryCards = [
    {
      icon: '🏢',
      title: '대기업',
      description: '삼성, LG, 현대 등 핵심 기업 취업 정보',
      path: '/category/corporate',
      accent: '#dbeafe',
    },
    {
      icon: '🏛️',
      title: '공기업',
      description: '한전, 도로공사 등 공기업 준비 로드맵',
      path: '/category/public',
      accent: '#dcfce7',
    },
    {
      icon: '👮',
      title: '공무원',
      description: '행정직과 기술직 맞춤 시험 정보',
      path: '/category/government',
      accent: '#ede9fe',
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
      description: '다가오는 시험 일정과 접수 마감을 관리',
      path: '/schedule',
      accent: '#fee2e2',
    },
  ];

  return (
    <div className="home-container">
      <section className="home-hero">
        <div className="home-badge">스펙모아</div>
        <h1 className="home-title">당신의 커리어를 위한 맞춤형 자격증 추천</h1>
        <p className="home-subtitle">
          복잡한 자격증 정보를 한눈에, 구직자의 내일을 잇는 직무 맞춤형 커리어 네비게이터
        </p>
      </section>

      <section className="search-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="자격증 이름, 직무, 키워드로 검색하세요..."
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
            style={{ backgroundColor: card.accent }}
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
