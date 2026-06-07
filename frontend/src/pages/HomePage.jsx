import { useState, useEffect } from 'react';
import { 링크, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; 

const categoryMeta = {
  corporate: { title: '대기업 취업', icon: '🏢' },
  공개: { title: '공기업/공사', icon: '🏛️' },
  government: { title: '공무원/공직', icon: '🎖️' },
};

const categoryCards = [
  { key: 'corporate', subtitle: '삼성, LG, 현대 등', tone: 'blue' },
  { key: 'public', subtitle: '한전, 도로공사 등', tone: 'violet' },
  { key: 'government', subtitle: '행정직, 기술직 등', tone: 'pink' },
];

const featureCards = [
  {
    까지: '/ranking',
    icon: '📈',
    title: '검색 순위 랭킹',
    description: '가장 많이 검색된 인기 자격증 TOP 10',
  },
  {
    까지: '/recommendation',
    icon: '🎯',
    title: '직무 맞춤 추천',
    description: 'AI 기반 개인 맞춤형 자격증 추천',
  },
  {
    까지: '/schedule',
    icon: '🗓️',
    title: 'D-day 시험일정 캘린더',
    description: '다가오는 시험 일정과 접수 마감일 관리',
  },
];

function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); 
  const [isSearching, setIsSearching] = useState(false);  

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .or(`name.ilike.%${trimmedQuery}%,field.ilike.%${trimmedQuery}%,issuer.ilike.%${trimmedQuery}%`);
        
        if (error) {
          throw error;
        }
        
        setSearchResults(data || []); 
      } catch (error) {
        console.error('Supabase 실시간 검색 실패:', error.message);
      } finally {
        setIsSearching(false);
      }
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="page-stack home-page">
      <section className="home-hero">
        <span className="home-badge">SPEC MOA</span>
        <h1 className="home-title">취업과 커리어를 위한 맞춤형 자격증 추천 </h1>
        <p className="home-subtitle">
          복잡한 자격증 정보를 한눈에 보고, 구직자의 목표에 어울리는 직무 맞춤형 커리어 가이드를
          제공합니다.
        </p>

        <div 
          className="search-bar" 
          style={{ 
            width: '100%', 
            maxWidth: '850px', 
            margin: '0 auto 30px', 
            position: 'relative' 
          }}
        >
          <input
            type="search"
            className="search-bar__input"
            style={{ 
              width: '100%',
              textAlign: 'center', 
              padding: '16px 24px'  
            }}
            placeholder="관심 자격증, 직무 분야를 입력하세요"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          {/* 실시간 팝업 검색 결과 리스트 */}
          {query.trim() && (
            <div className="search-results" style={{ width: '100%', textAlign: 'left' }}>
              {isSearching ? (
                <div className="search-results__empty">🔍 데이터베이스 조회 중...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="search-results__item"
                    onClick={() => navigate(`/certificate/${item.id}`)}
                  >
                    <strong>{item.name}</strong>
                    <span>{item.field} · {item.issuer}</span>
                  </button>
                ))
              ) : (
                <div className="search-results__empty">일치하는 자격증이 없습니다.</div>
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
