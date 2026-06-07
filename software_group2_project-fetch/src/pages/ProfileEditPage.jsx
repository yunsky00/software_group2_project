import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileEditPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('김');
  const [email, setEmail] = useState('name@example.com');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('개인정보가 수정되었습니다.');
  };

  return (
    <section className="profile-edit-page">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← 이전으로
      </button>

      <div className="profile-edit-card">
        <div className="profile-edit-card__header">
          <span className="eyebrow">내 정보</span>
          <h1>개인정보 수정</h1>
          <p>이름과 이메일 정보를 수정할 수 있습니다.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>이름</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="이름 입력" />
          </label>

          <label>
            <span>이메일</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
            />
          </label>

          <button type="submit" className="button button--primary">
            저장하기
          </button>
        </form>

        {message ? <p className="profile-edit-card__message">{message}</p> : null}
      </div>
    </section>
  );
}

export default ProfileEditPage;
