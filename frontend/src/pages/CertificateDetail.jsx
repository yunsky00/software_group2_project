import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './CertificateDetail.css';

function CertificateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [certificate, setCertificate] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewer, setReviewer] = useState('');
  const [rating, setRating] = useState(5);
  const [댓글, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetailData = async () => {
      setIsLoading(true);
      try {
        const isNumeric = !isNaN(id);
        const identifier = isNumeric ? parseInt(id, 10) : decodeURIComponent(id);
        const column = isNumeric ? 'id' : 'name';

        const { data: certData, error: certError } = await supabase
          .from('certificates')
          .select('*')
          .eq(column, identifier)
          .single();

        if (certError) throw certError;

        const [scheduleRes, subjectRes, benefitRes, reviewRes] = await Promise.all([
          supabase.from('exam_schedules').select('*').eq('certificate_id', certData.id),
          supabase.from('exam_subjects').select('*').eq('certificate_id', certData.id),
          supabase.from('benefits').select('*').eq('certificate_id', certData.id),
          supabase.from('reviews').select('*').eq('certificate_id', certData.id).order('created_at', { ascending: false })
        ]);

        setCertificate({
          ...certData,
          exam_schedules: scheduleRes.data || [],
          exam_subjects: subjectRes.data || [],
          benefits: benefitRes.data || []
        });

        setReviews(reviewRes.data || []);
      } catch (error) {
        console.error('데이터 로딩 에러:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDetailData();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!comment.trim()) return;
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          certificate_id: certificate.id,
          author: reviewer.trim() || '익명',
          rating: rating,
          comment: comment.trim(),
        }])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        setReviews([data[0], ...reviews]);
      }
      setReviewer('');
      setRating(5);
      setComment('');
      alert('후기가 성공적으로 등록되었습니다!');
    } catch (error) {
      alert('후기 등록에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div className="detail-page" style={{ padding: '120px 20px', textAlign: 'center' }}>⏳ 자격증 정보를 불러오는 중입니다...</div>;
  }

  if (!certificate) {
    return (
      <div className="detail-page" style={{ padding: '120px 20px' }}>
        <button type="button" className="detail-back" onClick={() => navigate(-1)}>← 이전으로</button>
        <div className="detail-empty">해당 자격증 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <button type="button" className="detail-back" onClick={() => navigate(-1)}>← 돌아가기</button>

      <section className="detail-card">
        <div className="detail-card-header">
          <div>
            <div className="detail-label">자격증 정보</div>
            <h1 className="detail-title">{certificate.name}</h1>
            <p className="detail-source">{certificate.organization || '공식 발급기관'}</p>
          </div>
        </div>
      </section>

      <div className="detail-grid">
        <section className="detail-panel detail-schedule">
          <div className="detail-panel-title">시험 일정</div>
          {certificate.exam_schedules.length > 0 ? (
            certificate.exam_schedules.map((item, index) => (
              <div key={index} className="schedule-item">
                <div className="schedule-round">{item.round_name || '정기'}</div>
                <div className="schedule-meta">
                  <div>시험일: {item.exam_date || '미정'}</div>
                </div>
              </div>
            ))
          ) : <p style={{padding: '10px', fontSize: '14px'}}>등록된 일정이 없습니다.</p>}
        </section>

        <section className="detail-panel detail-info">
          <div className="detail-panel-title">시험 과목</div>
          <ul className="detail-list">
            {certificate.exam_subjects.map((s, idx) => <li key={idx}>{s.subject_name}</li>)}
          </ul>

          <div className="detail-panel-title">취득 혜택</div>
          <ul className="detail-list">
            {certificate.benefits.map((b, idx) => <li key={idx}>{b.benefit_content}</li>)}
          </ul>
        </section>
      </div>

      {/* 후기 영역 */}
      <section className="detail-panel detail-reviews">
        <div className="detail-panel-title">시험 후기</div>
        <div className="review-form">
            <input type="text" placeholder="이름(선택)" value={reviewer} onChange={(e) => setReviewer(e.target.value)} />
            <textarea placeholder="후기를 작성해주세요" value={comment} onChange={(e) => setComment(e.target.value)} />
            <button onClick={handleReviewSubmit}>후기 등록</button>
        </div>
        <div className="review-list">
          {reviews.map((r) => (
            <article key={r.id} className="review-card">
              <p><strong>{r.author}</strong> ({r.rating}점)</p>
              <p>{r.comment}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CertificateDetail;
