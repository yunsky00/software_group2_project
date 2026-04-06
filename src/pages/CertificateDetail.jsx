import { useParams, useNavigate } from 'react-router-dom';
import { certifications } from '../data/certifications';
import './CertificateDetail.css';

function CertificateDetail() {
  const { certName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(certName);
  const certificate = certifications.find((cert) => cert.name === decodedName);

  if (!certificate) {
    return (
      <div className="detail-page">
        <button type="button" className="detail-back" onClick={() => navigate(-1)}>
          ← 이전으로
        </button>
        <div className="detail-empty">해당 자격증 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <button type="button" className="detail-back" onClick={() => navigate(-1)}>
        ← 돌아가기
      </button>

      <section className="detail-card">
        <div className="detail-card-header">
          <div>
            <div className="detail-label">자격증 정보</div>
            <h1 className="detail-title">{certificate.name}</h1>
            <span className="detail-level">{certificate.level}</span>
            <p className="detail-source">{certificate.organization}</p>
          </div>
          <div className="detail-flag">🔖</div>
        </div>

        <p className="detail-summary">{certificate.description}</p>

        <div className="detail-stats">
          <div className="stat-item">
            <span className="stat-label">다음 시험</span>
            <strong>{certificate.examDate}</strong>
          </div>
          <div className="stat-item">
            <span className="stat-label">응시료</span>
            <strong>{certificate.fee}</strong>
          </div>
          <div className="stat-item">
            <span className="stat-label">합격률</span>
            <strong>{certificate.passRate}</strong>
          </div>
          <div className="stat-item">
            <span className="stat-label">시험 시간</span>
            <strong>{certificate.duration}</strong>
          </div>
        </div>
      </section>

      <div className="detail-grid">
        <section className="detail-panel detail-schedule">
          <div className="detail-panel-title">시험 일정</div>
          {certificate.schedule.map((item) => (
            <div key={item.round} className="schedule-item">
              <div className="schedule-round">{item.round}회</div>
              <div className="schedule-meta">
                <div>접수: {item.registration}</div>
                <div>시험: {item.testDate}</div>
                <div>합격 발표: {item.resultDate}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="detail-panel detail-info">
          <div className="detail-panel-title">시험 과목</div>
          <ul className="detail-list">
            {certificate.subjects.map((subject) => (
              <li key={subject}>{subject}</li>
            ))}
          </ul>

          <div className="detail-panel-title">취득 혜택</div>
          <ul className="detail-list detail-list-feature">
            {certificate.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="detail-actions">
        <button type="button" className="action-button action-outline" onClick={() => navigate('/recommendation')}>
          AI 맞춤 추천 받기
        </button>
        <button type="button" className="action-button action-primary">
          공식 사이트 바로가기
        </button>
      </div>
    </div>
  );
}

export default CertificateDetail;
