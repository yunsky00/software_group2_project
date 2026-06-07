import { Link } from 'react-router-dom';

function CertificationCard({ item, compact = false }) {
  // 데이터가 없을 때를 대비한 안전한 기본값 처리
  const safeItem = item || {};
  
  // 랭킹이 3위 이내인 경우 '인기' 뱃지 표시 (데이터에 ranking 필드가 있다고 가정)
  const isPopular = safeItem.ranking && safeItem.ranking <= 3;

  return (
    <Link 
      to={`/certifications/${safeItem.id}`} 
      className={`cert-card${compact ? ' cert-card--compact' : ''}`}
      aria-label={`${safeItem.name || '자격증'} 상세 정보 보기`}
    >
      <div className="cert-card__headline">
        <h3>
          {safeItem.name || '자격증 이름 미정'}
          {/* 인기 뱃지 추가 (인라인 스타일 적용) */}
          {isPopular && (
            <span style={{
              backgroundColor: '#ff4d4f', // 빨간색 배경
              color: '#fff',              // 흰색 글자
              fontSize: '10px',           // 작은 글씨
              padding: '2px 6px',         // 여백
              borderRadius: '10px',       // 둥근 모양
              marginLeft: '6px',          // 이름과의 간격
              verticalAlign: 'middle',    // 수직 정렬
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