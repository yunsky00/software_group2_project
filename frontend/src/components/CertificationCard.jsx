import { 링크 } from 'react-router-dom';

function CertificationCard({ item, compact = false }) {

  const safeItem = item || {};
  
  const isPopular = safeItem.ranking && safeItem.ranking <= 3;

  return (
    <링크 
      까지={`/certifications/${safeItem.id}`} 
      className={`cert-card${compact ? ' cert-card--compact' : ''}`}
      aria-label={`${safeItem.name || '자격증'} 상세 정보 보기`}
    >
      <div className="cert-card__headline">
        <h3>
          {safeItem.name || '자격증 이름 미정'}
          {isPopular && (
            <span style={{
              backgroundColor: '#ff4d4f', 
              color: '#fff',              
              fontSize: '10px',           
              padding: '2px 6px',         
              borderRadius: '10px',       
              marginLeft: '6px',          
              verticalAlign: 'middle',    
              fontWeight: 'bold'
            }}>인기</span>
          )}
        </h3>
        {!compact && <span className="cert-card__arrow">→</span>}
      </div>
      <p className="cert-card__org">{safeItem.organization || '기관 정보 없음'}</p>
    </Link>
  );
}

export default CertificationCard;
