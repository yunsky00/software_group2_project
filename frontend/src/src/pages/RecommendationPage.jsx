import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { certifications } from '../data/certifications';

const careerOptions = ['대기업', '공기업', '공무원'];
const experienceOptions = ['신입', '1-3년', '4-7년', '8년 이상'];
const interestOptions = ['IT', '데이터', '보안', '경영', '마케팅', '생산관리'];
const categoryMap = { 대기업: 'corporate', 공기업: 'public', 공무원: 'government' };

function RecommendationPage() {
  const navigate = useNavigate();
  const [career, setCareer] = useState('공기업');
  const [major, setMajor] = useState('');
  const [experience, setExperience] = useState('1-3년');
  const [goal, setGoal] = useState('');
  const [interests, setInterests] = useState(['데이터']);
  const [submitted, setSubmitted] = useState(false);

  const toggleInterest = (option) => {
    setInterests((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  };

  const recommendations = useMemo(() => {
    const normalizedMajor = major.trim().toLowerCase();
    const normalizedGoal = goal.trim().toLowerCase();

    return certifications
      .filter((item) => item.category === categoryMap[career])
      .map((item) => {
        let score = 0;
        if (interests.includes(item.field)) score += 3;
        if (normalizedMajor && item.description.toLowerCase().includes(normalizedMajor)) score += 1;
        if (normalizedGoal && item.summary.toLowerCase().includes(normalizedGoal)) score += 1;
        if (experience === '신입' && ['초급', '중급'].includes(item.difficulty)) score += 1;

        return {
          ...item,
          score,
          reason: `${career} 준비 흐름과 ${item.field} 관심사가 겹치고 ${item.preparationPeriod} 준비 기간으로 접근하기 좋습니다.`,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [career, experience, goal, interests, major]);

  return (
    <div className="page-stack recommendation-page">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← 돌아가기
      </button>

      <div className="recommendation-hero">
        <span className="recommendation-hero__icon">✨</span>
        <h1>AI 맞춤 자격증 추천</h1>
        <p>몇 가지 질문에 답하시면 당신에게 최적화된 자격증을 추천해드립니다.</p>
      </div>

      <section className="recommendation-form-card">
        <div className="recommendation-form-section">
          <h2>1. 희망 진로 분야를 선택해주세요 *</h2>
          <div className="recommendation-option-grid recommendation-option-grid--three">
            {careerOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`recommendation-option${career === option ? ' recommendation-option--selected' : ''}`}
                onClick={() => setCareer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="recommendation-form-section">
          <h2>2. 관심 분야를 선택해주세요</h2>
          <div className="recommendation-option-grid recommendation-option-grid--three">
            {interestOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`recommendation-option${interests.includes(option) ? ' recommendation-option--selected' : ''}`}
                onClick={() => toggleInterest(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="recommendation-form-section">
          <h2>3. 전공을 입력해주세요</h2>
          <input
            value={major}
            onChange={(event) => setMajor(event.target.value)}
            placeholder="예: 컴퓨터공학과"
          />
        </div>

        <div className="recommendation-form-section">
          <h2>4. 경력을 선택해주세요 *</h2>
          <div className="recommendation-option-grid recommendation-option-grid--experience">
            {experienceOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`recommendation-option${experience === option ? ' recommendation-option--selected' : ''}`}
                onClick={() => setExperience(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="recommendation-form-section">
          <h2>5. 자격증 취득 목표를 알려주세요</h2>
          <textarea
            rows="5"
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder="예: 대기업 취업을 위한 스펙 준비, 이직을 위한 기술 증명 등"
          />
        </div>

        <div className="recommendation-cta">
          <button type="button" className="recommendation-cta__button" onClick={() => setSubmitted(true)}>
            ✨ AI 추천 받기
          </button>
        </div>
      </section>

      <section className="recommendation-result-panel">
        <h2>추천 결과를 확인해보세요</h2>
        {!submitted ? (
          <p>입력 후 AI 추천 받기 버튼을 눌러 결과를 확인할 수 있습니다.</p>
        ) : (
          <div className="recommendation-result-list">
            {recommendations.map((item) => (
              <article key={item.id} className="recommendation-result-card">
                <div className="recommendation-result-card__header">
                  <strong>{item.name}</strong>
                  <span>{item.field}</span>
                </div>
                <p>{item.reason}</p>
                <div className="recommendation-result-card__meta">
                  <span>예상 준비 기간 {item.preparationPeriod}</span>
                  <Link to={`/certifications/${item.id}`}>상세보기</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default RecommendationPage;
