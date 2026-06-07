import { useEffect, useState } from 'react';
import { 링크, useParams } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection';
import { isBookmarked, toggleBookmark } from '../utils/userData';
import { supabase } from './supabaseClient';
import { trackView } from '../utils/tracking'; 

function CertificateDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    async function fetchDetail() {
      setIsLoading(true);
      try {

        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setItem(data);
        
        if (data) {
          setBookmarked(isBookmarked(data.id));
        }
      } catch (error) {
        console.error('상세 정보 조회 실패:', error.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchDetail();
      trackView(id); 
    }
  }, [id]);

  if (isLoading) return <section className="empty-state"><h1>⏳ 불러오는 중...</h1></section>;
  if (!item) return <section className="empty-state"><h1>정보를 찾을 수 없습니다.</h1><Link to="/">홈으로</Link></section>;

  return (
    <div className="page-stack detail-page">
      <Link to={`/category/${item.category}`} className="back-link">← 돌아가기</Link>

      <section className="detail-summary-card">
        <div className="detail-summary-card__top">
          <span className="detail-summary-card__badge">자격증 정보</span>
          <button type="button" className={`bookmark-button${bookmarked ? ' bookmark-button--active' : ''}`} onClick={() => setBookmarked(toggleBookmark(item))}>
            <span>{bookmarked ? '★ 찜 완료' : '☆ 찜하기'}</span>
          </button>
        </div>

        <div className="detail-summary-card__main">
          <h1>{item.name}</h1>
          <p>{item.field} · {item.issuer}</p>
          <div style={{ marginTop: '10px', fontSize: '1.2rem', color: '#666' }}>
            <p>💰 응시료: {item.fee || '정보 없음'}</p>
            <p>📈 합격률: {item.passing_rate || '정보 없음'}</p>
          </div>
        </div>

        <article className="panel detail-info-panel">
          <h2>상세 정보</h2>
          <p>{item.description}</p>
          
          <h3>참고 사항</h3>
          <div style={{ color: 'var(--muted)' }}>
            {item.subjects || '상세 과목 및 혜택 정보는 공식 홈페이지를 확인하세요.'}
          </div>
        </article>
      </section>

      <ReviewSection />

      <div className="detail-action-row">
        <Link to="/recommendation" className="outline-button">AI 맞춤 추천 받기</Link>
        <a href="https://www.q-net.or.kr" target="_blank" rel="noreferrer" className="gradient-button gradient-button--large">
          공식 사이트 바로가기
        </a>
      </div>
    </div>
  );
}

export default CertificateDetailPage;
