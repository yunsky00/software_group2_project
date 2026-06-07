import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import corpIcon from '../assets/icons/icon-corporate.svg';
import pubIcon from '../assets/icons/icon-public.svg';
import govIcon from '../assets/icons/icon-government.svg';
import rankIcon from '../assets/icons/icon-ranking.svg';
import recIcon from '../assets/icons/icon-recommend.svg';
import calIcon from '../assets/icons/icon-calendar.svg';

function 홈() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(''); 

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter' && keyword.trim()) {

      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const categoryCards = [
    {
      iconSrc: corpIcon,
      title: '대기업',
      description: '삼성, LG, 현대 등 주요 기업 취업에 맞춘 자격 정보',
      path: '/category/corporate',
      accent: '#e6f0ff',
    },
    {
      iconSrc: pubIcon,
      title: '공기업',
      description: '공사, 공단, 공공기관 준비를 위한 로드맵',
      path: '/category/public',
      accent: '#efe5ff',
    },
    {
      iconSrc: govIcon,
      title: '공무원',
      description: '행정직과 기술직에 맞는 시험 및 자격 정보',
      path: '/category/government',
      accent: '#fff0f6',
    },
  ];

  const featureCards = [
    {
      iconSrc: rankIcon,
      title: '검색 순위 랭킹',
      description: '가장 많이 검색된 인기 자격증 TOP 10',
      path: '/ranking',
      accent: '#fef9c3',
    },
    {
      iconSrc: recIcon,
      title: '직무 맞춤 추천',
      description: 'AI 기반 개인 맞춤형 자격증 추천',
      path: '/recommendation',
      accent: '#d1fae5',
    },
    {
      iconSrc: calIcon,
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
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleSearchSubmit}
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
            <div className="home-category-card-icon">
              {card.iconSrc ? (
                <img src={card.iconSrc} alt="" style={{ width: 44, height: 44 }} />
              ) : (
                card.icon
              )}
            </div>
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
            <div className="home-feature-card-icon">
              {card.iconSrc ? (
                <img src={card.iconSrc} alt="" style={{ width: 44, height: 44 }} />
              ) : (
                card.icon
              )}
            </div>
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
