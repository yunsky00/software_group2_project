import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBookmarks, getProfile, getRecommendationHistory, saveProfile } from '../utils/userData';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const initialProfile = useMemo(() => getProfile(), []);
  const [name, setName] = useState(initialProfile.name);
  const [email, setEmail] = useState(initialProfile.email);
  const [message, setMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const bookmarks = useMemo(() => getBookmarks(), [refreshKey]);
  const histories = useMemo(() => getRecommendationHistory(), [refreshKey]);

  function save(event) {
    event.preventDefault();
    saveProfile({ name, email });
    setMessage('마이페이지 정보가 저장되었습니다.');
    setRefreshKey((value) => value + 1);
  }

  return (
    <div className="page-stack">
      <div className="profile-page">
        <button type="button" className="back-link profile-page__back" onClick={() => navigate(-1)}>
          ← 돌아가기
        </button>

        <div className="profile-page__header">
          <span className="profile-page__eyebrow">내 활동 한눈에 보기</span>
          <h1>마이페이지</h1>
          <p>개인정보, 찜한 자격증, AI 추천 기록을 보기 편하게 한 곳에 모아두었어요.</p>
        </div>

        <section className="profile-section">
          <div className="profile-section__title">
            <h2>내 정보</h2>
            <span>프로필 관리</span>
          </div>
          <form onSubmit={save} className="profile-form">
            <label>
              이름
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              이메일
              <input value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <div className="profile-actions">
              <button type="submit" className="button button--primary">저장</button>
            </div>
          </form>
          {message ? <p className="profile-message">{message}</p> : null}
        </section>

        <section className="profile-section">
          <div className="profile-section__title">
            <h2>찜한 자격증</h2>
            <span>{bookmarks.length}개</span>
          </div>
          <div className="profile-list">
            {bookmarks.length > 0 ? (
              bookmarks.map((item) => (
                <Link key={item.id} to={`/certifications/${item.id}`} className="profile-card-link">
                  <article className="profile-card">
                    <div className="profile-card__header">
                      <strong>{item.name}</strong>
                      <span className="profile-chip">★ 찜함</span>
                    </div>
                    <p>{item.organization}</p>
                    <div className="profile-card__meta">
                      <span>{item.level}</span>
                      <span>{item.examDate}</span>
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <div className="profile-empty">아직 찜한 자격증이 없습니다.</div>
            )}
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section__title">
            <h2>AI 추천 기록</h2>
            <span>{histories.length}개</span>
          </div>
          <div className="profile-list">
            {histories.length > 0 ? (
              histories.map((history) => (
                <article key={history.id} className="profile-card">
                  <div className="profile-card__header">
                    <strong>{history.career} 맞춤 추천</strong>
                    <span className="profile-chip profile-chip--soft">
                      {new Date(history.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <p>
                    관심 분야: {history.interests.join(', ') || '없음'}
                    {history.goal ? ` · 목표: ${history.goal}` : ''}
                  </p>
                  <div className="profile-history-list">
                    {history.recommendations.map((item) => (
                      <Link key={item.id} to={`/certifications/${item.id}`} className="profile-history-item">
                        <strong>{item.name}</strong>
                        <span>{item.field} · {item.preparationPeriod}</span>
                      </Link>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <div className="profile-empty">아직 저장된 AI 추천 기록이 없습니다.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
