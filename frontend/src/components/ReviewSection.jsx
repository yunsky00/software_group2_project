import { useState, useEffect } from 'react';
import { supabase } from '../pages/supabaseClient'; 

function ReviewSection() {
  const [reviews, setReviews] = useState([]);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [댓글, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('comment')
        .select('*')
        .order('created_at', { ascending: false }); // 최신순 정렬
      
      if (error) {
        console.error('후기 로드 실패:', error);
      } else {
        setReviews(data || []);
      }
      setLoading(false);
    }
    fetchReviews();
  }, []);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    const newReview = {
      author: author.trim() || '익명',
      rating,
      댓글: comment.trim(),
    };

    const { data, error } = await supabase
      .from('comment')
      .insert([newReview])
      .select(); 

    if (error) {
      console.error('후기 등록 실패:', error);
      alert('등록에 실패했습니다.');
    } else {
      setReviews([data[0], ...reviews]); // UI 즉시 업데이트
      setAuthor('');
      setRating(5);
      setComment('');
    }
  };

  return (
    <section className="panel review-panel">
      <h2>시험 후기</h2>

      <div className="review-grid">
        <div className="review-field">
          <label htmlFor="review-author">이름</label>
          <input
            id="review-author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="닉네임 (선택)"
          />
        </div>

        <div className="review-field">
          <label>평점</label>
          <div className="rating-row">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`rating-pill${rating === value ? ' rating-pill--active' : ''}`}
                onClick={() => setRating(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="review-field">
        <label htmlFor="review-comment">후기 작성</label>
        <textarea
          id="review-comment"
          rows="5"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="시험 준비 경험이나 팁을 작성해 주세요."
        />
      </div>

      <button type="button" className="gradient-button" onClick={handleSubmit}>
        후기 등록
      </button>

      <div className="review-list">
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className="review-card">
              <div className="review-card__header">
                <strong>{review.author}</strong>
                <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </div>
              <p>{review.comment}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default ReviewSection;
