import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection';
import { getCertificateById } from '../data/certifications';
import { isBookmarked, toggleBookmark } from '../utils/userData';

function CertificateDetailPage() {
  const { id } = useParams();
  const item = getCertificateById(id);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (item) {
      setBookmarked(isBookmarked(item.id));
    }
  }, [item]);

  if (!item) {
    return (
      <section className="empty-state">
        <h1>자격증 정보를 찾을 수 없습니다.</h1>
        <Link to="/" className="button button--primary">홈으로 이동</Link>
      </section>
    );
  }

  return (
    <div className="page-stack detail-page">
      <Link to={`/category/${item.category}`} className="back-link">← 돌아가기</Link>

      <section className="detail-summary-card">
        <div className="detail-summary-card__top">
          <span className="detail-summary-card__badge">자격증 정보</span>
          <button
            type="button"
            className={`bookmark-button${bookmarked ? ' bookmark-button--active' : ''}`}
            onClick={() => setBookmarked(toggleBookmark(item))}
          >
            <span className="bookmark-button__star">{bookmarked ? '★' : '☆'}</span>
            <span>{bookmarked ? '찜 완료' : '찜하기'}</span>
          </button>
        </div>
        <h1>{item.name}</h1>
        <span className="detail-summary-card__level">{item.level}</span>
        <p className="detail-summary-card__org">{item.organization}</p>
        <p className="detail-summary-card__desc">{item.description}</p>

        <div className="detail-stat-grid">
          <article className="detail-stat-box">
            <span>다음 시험</span>
            <strong>{item.examDate}</strong>
          </article>
          <article className="detail-stat-box">
            <span>응시료</span>
            <strong>{item.fee}</strong>
          </article>
          <article className="detail-stat-box">
            <span>합격률</span>
            <strong>{item.passRate}</strong>
          </article>
          <article className="detail-stat-box">
            <span>시험 시간</span>
            <strong>{item.duration}</strong>
          </article>
        </div>
      </section>

      <section className="detail-content-grid">
        <article className="panel detail-schedule-panel">
          <h2>시험 일정</h2>
          <div className="timeline-list">
            {item.schedule.map((schedule) => (
              <div key={schedule.round} className="timeline-item">
                <strong>{schedule.round}</strong>
                <div>접수: {schedule.registrationStart} - {schedule.registrationEnd}</div>
                <div>시험: {schedule.testDate}</div>
                <div>합격 발표: {schedule.resultDate}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel detail-info-panel">
          <h2>시험 과목</h2>
          <div className="detail-chip-list">
            {item.subjects.map((subject) => (
              <div key={subject} className="detail-chip-item">{subject}</div>
            ))}
          </div>

          <h3>취득 혜택</h3>
          <div className="detail-chip-list">
            {item.benefits.map((benefit) => (
              <div key={benefit} className="detail-benefit-item">✓ {benefit}</div>
            ))}
          </div>
        </article>
      </section>

      <ReviewSection />

      <div className="detail-action-row">
        <Link to="/recommendation" className="outline-button">
          AI 맞춤 추천 받기
        </Link>
        <a href="https://www.q-net.or.kr" target="_blank" rel="noreferrer" className="gradient-button gradient-button--large">
          공식 사이트 바로가기
        </a>
      </div>
    </div>
  );
}

export default CertificateDetailPage;
