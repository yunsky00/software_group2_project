import { useState } from 'react';
import { 링크, useNavigate } from 'react-router-dom';

const careerOptions = ['대기업', '공기업', '공무원'];
const experienceOptions = ['신입', '1-3년', '4-7년', '8년 이상'];
const interestOptions = ['IT', '데이터', '보안', '경영', '마케팅', '생산관리'];

function RecommendationPage() {
  const navigate = useNavigate();
  const [career, setCareer] = useState('공기업');
  const [major, setMajor] = useState('');
  const [experience, setExperience] = useState('1-3년');
  const [goal, setGoal] = useState('');
  const [interests, setInterests] = useState(['데이터']);
  
  const [recommendations, setRecommendations] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (option) => {
    setInterests((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  };

  async function handleSubmit() {
    setLoading(true);
    setSubmitted(false);
    try {
      const response = await fetch('http://localhost:8000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career,
          major: major.trim(),
          experience,
          interests,
          goal: goal.trim()
        })
      });

      if (!response.ok) throw new Error('AI 서버 연동 실패');
      
      const data = await response.json();

      setRecommendations(data.recommendations || []);
      setSubmitted(true);
    } catch (error) {
      console.error('AI 맞춤 추천 알고리즘 로드 실패:', error);
      alert('백엔드 추천 API 서버 상태를 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-stack recommendation-page">
      <Link to="/" className="back-link">← 돌아가기</Link>

      <section className="recommendation-page__header">
        <div className="recommendation-page__title">
          <span className="recommendation-page__icon">🎯</span>
          <div>
            <h1>직무 맞춤 추천</h1>
            <p>맞춤형 스펙 추천 시스템</p>
          </div>
        </div>
      </section>


      <section className="panel recommendation-form">
        <div className="recommendation-form-section">
          <h2>1. 취업 희망 목표를 선택하세요</h2>
          <div className="filter-row filter-row--compact">
            {careerOptions.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip chip--tab${career === item ? ' chip--active chip--violet' : ''}`}
                onClick={() => setCareer(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="recommendation-form-section">
          <h2>2. 전공 또는 학과를 입력해 주세요</h2>
          <input
            type="text"
            className="search-bar__input"
            style={{ width: '100%', maxWidth: '500px', border: '1px solid var(--stroke)', borderRadius: '12px', padding: '12px 16px' }}
            value={major}
            onChange={(event) => setMajor(event.target.value)}
            placeholder="예: 컴퓨터공학, 경영학, 통계학과 등..."
          />
        </div>

        <div className="recommendation-form-section">
          <h2>3. 현재 실무 경력 상태를 알려주세요</h2>
          <div className="filter-row filter-row--compact">
            {experienceOptions.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip chip--tab${experience === item ? ' chip--active chip--violet' : ''}`}
                onClick={() => setExperience(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="recommendation-form-section">
          <h2>4. 관심 있는 직무/기술 키워드를 선택하세요 (중복 가능)</h2>
          <div className="filter-row filter-row--compact">
            {interestOptions.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip chip--tab${interests.includes(item) ? ' chip--active chip--violet' : ''}`}
                onClick={() => toggleInterest(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="recommendation-form-section">
          <h2>5. 자격증 취득 목적 및 최종 목표</h2>
          <textarea
            rows="4"
            style={{ width: '100%', border: '1px solid var(--stroke)', borderRadius: '16px', padding: '16px', fontSize: '15px' }}
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder="예: 상반기 대기업 백엔드 직무 서류 통과 가산점 획득 목적"
          />
        </div>

        <div className="recommendation-cta">
          <button type="button" className="recommendation-cta__button" onClick={handleSubmit} disabled={loading}>
            {loading ? '🔄 알고리즘 구동 중...' : '✨ AI 추천 받기'}
          </button>
        </div>
      </section>

      <section className="recommendation-result-panel">
        <h2>추천 매칭 결과 레코드</h2>
        {loading ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>매칭 연산을 수행하는 중입니다...</p>
        ) : !submitted ? (
          <p>정보 입력 후 하단의 버튼을 클릭하면, 실시간 적합 자격증이 정렬됩니다.</p>
        ) : (
          <div className="recommendation-result-list">
            {recommendations.length > 0 ? (
              recommendations.map((item) => (
                <article key={item.id} className="recommendation-result-card">
                  <div className="recommendation-result-card__header">
                    <strong>{item.name}</strong>
                    <span className="chip" style={{ fontSize: '12px', background: '#f0f3ff', color: '#3164e0' }}>{item.field}</span>
                  </div>
                  <p>{item.reason || `${item.name} 자격증은 기재하신 관심 분야 및 직무 요건에 부합하여 가산점 획득 확률이 높습니다.`}</p>
                  <div className="recommendation-result-card__meta">
                    <span>예상 준비 기간: <strong>{item.preparation_period || item.preparationPeriod || '2개월'}</strong></span>
                    <button type="button" className="button button--primary" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => navigate(`/certificate/${item.id}`)}>
                      상세 레코드 보기 →
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p style={{ color: 'var(--muted)', padding: '20px' }}>작성하신 필터 조건에 부합하는 자격증 레코드가 DB에 없습니다.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default RecommendationPage;
