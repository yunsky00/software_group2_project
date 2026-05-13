import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { certifications } from '../data/certifications';
import './CategoryPage.css';

function CategoryPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState('전체');

  const categoryVisuals = {
    corporate: { icon: '🏢', iconClass: 'corporate' },
    public: { icon: '🏛️', iconClass: 'public' },
    government: { icon: '🧑🏻‍💼', iconClass: 'government' },
  };

  const categoryNames = {
    corporate: '대기업',
    public: '공기업',
    government: '공무원',
  };

  const categoryTitle = categoryNames[type] || '알 수 없는 카테고리';
  const categoryVisual = categoryVisuals[type] || categoryVisuals.corporate;
  const filteredByCategory = certifications.filter((cert) => cert.category === type);
  const filteredByJob =
    selectedJob === '전체'
      ? filteredByCategory
      : filteredByCategory.filter((cert) => cert.job === selectedJob);

  const jobOptions = ['전체', ...Array.from(new Set(filteredByCategory.map((cert) => cert.job)))];

  return (
    <div className="category-page">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        ← 돌아가기
      </button>

      <header className="category-header">
        <div className="category-header-left">
          <div className={`category-icon ${categoryVisual.iconClass}`}>
            <span className="category-icon-emoji" aria-hidden="true">
              {categoryVisual.icon}
            </span>
          </div>
          <div>
            <h1 className="category-title">{categoryTitle}</h1>
            <p className="category-description">직무를 선택하면 맞춤 자격증을 확인할 수 있습니다.</p>
          </div>
        </div>
        <div className="category-summary">총 {filteredByJob.length}개 자격증</div>
      </header>

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
          <div className="category-empty">선택한 조건에 해당하는 자격증이 없습니다.</div>
        )}
      </section>
    </div>
  );
}

export default CategoryPage;
