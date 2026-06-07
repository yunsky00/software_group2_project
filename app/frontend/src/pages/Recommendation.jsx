import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Recommendation.css';

function Recommendation() {
  const navigate = useNavigate();
  const [careerField, setCareerField] = useState('');
  const [major, setMajor] = useState('');
  const [experience, setExperience] = useState('');
  const [goal, setGoal] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const careerOptions = ['대기업', '공기업', '공무원'];
  const experienceOptions = ['신입', '1-3년', '4-7년', '8년 이상'];

  const recommendationItems = [
    {
      name: '정보처리기사',
      careerField: '대기업',
      major: '컴퓨터공학',
      description: 'IT 직무에 맞춘 기본 자격증입니다.',
    },
    {
      name: '빅데이터 분석기사',
      careerField: '공기업',
      major: '통계학',
      description: '데이터 직무에 강한 분석 자격증입니다.',
    },
    {
      name: '디지털 마케팅 전문가',
      careerField: '대기업',
      major: '경영학',
      description: '마케팅 직무에 필요한 디지털 역량을 인증합니다.',
    },
    {
      name: '사회조사분석사 2급',
      careerField: '공무원',
      major: '통계학',
      description: '데이터 기반 조사 분석에 강한 자격증입니다.',
    },
  ];

  const handleRecommend = () => {
    const filtered = recommendationItems.filter((item) => {
      const careerMatch = careerField ? item.careerField === careerField : true;
      const majorMatch = major ? item.major.includes(major) : true;
      return careerMatch && majorMatch;
    });

    setRecommendations(filtered.length ? filtered : recommendationItems);
  };

  return (
    <div className="recommendation-page">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        ← 돌아가기
      </button>

      <header className="recommendation-header">
        <div className="recommendation-badge">✨</div>
        <div>
          <h1 className="recommendation-title">AI 맞춤 자격증 추천</h1>
          <p className="recommendation-description">
            몇 가지 질문에 답하시면 당신에게 최적화된 자격증을 추천해드립니다.
          </p>
        </div>
      </header>

      <section className="form-card">
        <div className="question-block">
          <div className="question-label">1. 희망 진로 분야를 선택해주세요 *</div>
          <div className="option-grid">
            {careerOptions.map((option) => (
              <button
                type="button"
                key={option}
                className={`option-button ${careerField === option ? 'active' : ''}`}
                onClick={() => setCareerField(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="question-block">
          <div className="question-label">3. 전공을 입력해주세요</div>
          <input
            className="text-input"
            type="text"
            value={major}
            placeholder="예: 컴퓨터공학과"
            onChange={(event) => setMajor(event.target.value)}
          />
        </div>

        <div className="question-block">
          <div className="question-label">4. 경력을 선택해주세요 *</div>
          <div className="option-grid">
            {experienceOptions.map((option) => (
              <button
                type="button"
                key={option}
                className={`option-button ${experience === option ? 'active' : ''}`}
                onClick={() => setExperience(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="question-block">
          <div className="question-label">5. 자격증 취득 목표를 알려주세요</div>
          <textarea
            className="text-area"
            rows="4"
            value={goal}
            placeholder="예: 대기업 취업을 위한 스펙 준비, 이직을 위한 기술 증명 등"
            onChange={(event) => setGoal(event.target.value)}
          />
        </div>

        <div className="submit-area">
          <button type="button" className="recommend-button" onClick={handleRecommend}>
            <span className="button-icon">✨</span> AI 추천 받기
          </button>
        </div>
      </section>

      <section className="result-section">
        {recommendations.length > 0 ? (
          recommendations.map((item) => (
            <article key={item.name} className="result-card">
              <h2 className="result-card-title">{item.name}</h2>
              <p className="result-card-meta">{item.careerField} · 전공 추천: {item.major}</p>
              <p className="result-card-description">{item.description}</p>
            </article>
          ))
        ) : (
          <article className="result-card empty-card">
            <h2 className="result-card-title">추천 결과를 확인해보세요</h2>
            <p className="result-card-description">
              입력 후 AI 추천 받기 버튼을 눌러 결과를 확인할 수 있습니다.
            </p>
          </article>
        )}
      </section>
    </div>
  );
}

export default Recommendation;
