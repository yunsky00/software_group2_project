import { Link } from 'react-router-dom';

function CertificationCard({ item, compact = false }) {
  return (
    <Link to={`/certifications/${item.id}`} className={`cert-card${compact ? ' cert-card--compact' : ''}`}>
      <div className="cert-card__headline">
        <h3>{item.name}</h3>
        {!compact && <span className="cert-card__arrow">→</span>}
      </div>
      <p className="cert-card__org">{item.organization}</p>

      <dl className="cert-card__meta">
        <div>
          <dt>다음 시험</dt>
          <dd>{item.examDate}</dd>
        </div>
        <div>
          <dt>응시료</dt>
          <dd>{item.fee}</dd>
        </div>
        <div>
          <dt>합격률</dt>
          <dd>{item.passRate}</dd>
        </div>
      </dl>
    </Link>
  );
}

export default CertificationCard;
