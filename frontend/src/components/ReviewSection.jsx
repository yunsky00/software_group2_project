import { useState } from 'react';

const initialReviews = [
  {
    id: 1,
    author: '김하나',
    rating: 5,
    comment: '문제 난이도는 적당했고 기출 유형과 유사해서 도움이 됐습니다.',
  },
  {
    id: 2,
    author: '이준',
    rating: 4,
    comment: '혼자 준비하기보다 스터디를 병행하면 더 좋습니다.',
  },
];

function ReviewSection() {
  const [reviews, setReviews] = useState(initialReviews);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!comment.trim()) return;
    setReviews((current) => [
      { id: Date.now(), author: author.trim() || '익명', rating, comment: comment.trim() },
      ...current,
    ]);
    setAuthor('');
    setRating(5);
    setComment('');
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
        {reviews.map((review) => (
          <article key={review.id} className="review-card">
            <div className="review-card__header">
              <strong>{review.author}</strong>
              <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
            </div>
            <p>{review.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReviewSection;
