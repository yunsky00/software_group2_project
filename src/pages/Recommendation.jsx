import { useState } from 'react';
import './Recommendation.css';

function Recommendation() {
  // 입력 폼 상태를 관리합니다.
  const [major, setMajor] = useState('');
  const [job, setJob] = useState('');
  const [companyType, setCompanyType] = useState('기업');
  const [recommendations, setRecommendations] = useState([]);

  // 추천 자격증 더미 데이터
  const recommendationItems = [
    {
      name: '정보처리기사',
      major: '컴퓨터공학',
      job: 'IT',
      companyType: '기업',
      description: 'IT 직무에 맞춘 기본 자격증입니다.',
    },
    {
      name: '빅데이터 분석기사',
      major: '통계학',
      job: '데이터',
      companyType: '공기업',
      description: '데이터 직무에 강한 분석 자격증입니다.',
    },
    {
      name: '디지털 마케팅 전문가',
      major: '경영학',
      job: '마케팅',
      companyType: '기업',
      description: '마케팅 직무에 필요한 디지털 역량을 인증합니다.',
    },
    {
      name: '사회조사분석사 2급',
      major: '통계학',
      job: '데이터',
      companyType: '정부',
      description: '데이터 기반 조사 분석에 강한 자격증입니다.',
    },
  ];

  // AI 추천 받기 버튼 클릭 시 추천 리스트 생성
  const handleRecommend = () => {
    const filtered = recommendationItems.filter((item) => {
      const majorMatch = major ? item.major.includes(major) : true;
      const jobMatch = job ? item.job.includes(job) : true;
      const companyMatch = companyType ? item.companyType === companyType : true;
      return majorMatch && jobMatch && companyMatch;
    });
    setRecommendations(filtered);
  };

  return (
    <div className="recommendation-page">
      {/* 페이지 제목 */}
      <header className="recommendation-header">
        <h1 className="recommendation-title">직무 맞춤 추천</h1>
        <p className="recommendation-description">나의 전공과 희망 직무를 입력하면 추천 자격증을 보여줍니다.</p>
      </header>

      {/* 입력 폼 카드 */}
      <section className="form-card">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="major">전공</label>
            <input
              id="major"
              type="text"
              value={major}
              placeholder="예: 컴퓨터공학"
              onChange={(event) => setMajor(event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="job">희망 직무</label>
            <input
              id="job"
              type="text"
              value={job}
              placeholder="예: IT, 데이터, 마케팅"
              onChange={(event) => setJob(event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="companyType">기업 유형</label>
            <select
              id="companyType"
              value={companyType}
              onChange={(event) => setCompanyType(event.target.value)}
            >
              <option value="기업">기업</option>
              <option value="공기업">공기업</option>
              <option value="정부">정부</option>
            </select>
          </div>
        </div>
        <button type="button" className="recommend-button" onClick={handleRecommend}>
          AI 추천 받기
        </button>
      </section>

      {/* 추천 결과 영역 */}
      <section className="result-section">
        {recommendations.length > 0 ? (
          recommendations.map((item) => (
            <article key={item.name} className="result-card">
              <h2 className="result-card-title">{item.name}</h2>
              <div className="result-card-meta">
                <span>전공: {item.major}</span>
                <span>직무: {item.job}</span>
                <span>타입: {item.companyType}</span>
              </div>
              <p className="result-card-description">{item.description}</p>
            </article>
          ))
        ) : (
          <article className="result-card">
            <h2 className="result-card-title">추천 결과를 확인해보세요</h2>
            <p className="result-card-description">입력 후 AI 추천 받기 버튼을 눌러 결과를 확인할 수 있습니다.</p>
          </article>
        )}
      </section>
    </div>
  );
}

export default Recommendation;
