import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { certifications } from '../data/certifications';
import './CategoryPage.css';

function CategoryPage() {
  // URL에서 전달된 category 타입을 가져옵니다.
  const { type } = useParams();
  const navigate = useNavigate();

  // 선택된 직무를 상태로 관리합니다.
  const [selectedJob, setSelectedJob] = useState('전체');

  // type 값에 따른 한글 제목 매핑을 작성합니다.
  const categoryNames = {
    corporate: '대기업',
    public: '공기업',
    government: '공무원',
  };

  // 매핑된 제목을 찾고, 없으면 기본값을 사용합니다.
  const categoryTitle = categoryNames[type] || '알 수 없는 카테고리';

  // category 기준으로 먼저 필터링합니다.
  const filteredByCategory = certifications.filter((cert) => cert.category === type);

  // 선택된 직무에 따라 추가 필터링합니다.
  const filteredByJob = selectedJob === '전체'
    ? filteredByCategory
    : filteredByCategory.filter((cert) => cert.job === selectedJob);

  // 현재 카테고리 내에서 사용 가능한 직무 목록을 만듭니다.
  const jobOptions = [
    '전체',
    ...Array.from(new Set(filteredByCategory.map((cert) => cert.job))),
  ];

  return (
    <div className="category-page">
      <div className="category-topbar">
        <button type="button" className="back-button" onClick={() => navigate(-1)}>
          ← 돌아가기
        </button>
      </div>

      {/* 상단 선택된 카테고리 제목 */}
      <header className="category-header">
        <div className="category-header-left">
          <div className="category-icon">🏢</div>
          <div>
            <h1 className="category-title">{categoryTitle}</h1>
            <p className="category-description">직무를 선택하면 맞춤 자격증을 확인할 수 있습니다.</p>
          </div>
        </div>
        <div className="category-summary">{filteredByJob.length}개의 자격증</div>
      </header>

      {/* 직무 필터 버튼 영역 */}
      <section className="category-filters">
        {jobOptions.map((job) => {
          const isActive = selectedJob === job;
          return (
            <button
              key={job}
              type="button"
              className={`filter-button ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedJob(job)}
            >
              {job}
            </button>
          );
        })}
      </section>

      {/* 자격증 카드 목록 */}
      <section className="category-list">
        {filteredByJob.length > 0 ? (
          filteredByJob.map((cert) => (
            <article
              key={`${cert.name}-${cert.organization}`}
              className="category-card"
              onClick={() => navigate(`/certificate/${encodeURIComponent(cert.name)}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  navigate(`/certificate/${encodeURIComponent(cert.name)}`);
                }
              }}
            >
              <div className="category-card-top">
                <div>
                  <h2 className="category-card-title">{cert.name}</h2>
                  <p className="category-card-subtitle">{cert.organization}</p>
                </div>
                <div className="category-card-icon">🔖</div>
              </div>

              <div className="category-card-meta">
                <div className="meta-item">
                  <span className="meta-label">다음 시험</span>
                  <span>{cert.examDate}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">응시료</span>
                  <span>{cert.fee}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">합격률</span>
                  <span>{cert.passRate}</span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="category-empty">선택된 카테고리 또는 직무에 해당하는 자격증이 없습니다.</div>
        )}
      </section>
    </div>
  );
}

export default CategoryPage;
