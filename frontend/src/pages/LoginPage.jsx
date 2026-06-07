import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    login();
    navigate('/');
  };

  return (
    <section className="login-shell">
      <div className="login-card">
        <div className="login-card__header">
          <span className="eyebrow">스펙모아</span>
          <h1>로그인</h1>
          <p>스펙모아에 저장한 자격증과 추천 흐름을 이어서 확인해 보세요.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>아이디</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" />
          </label>
          <label>
            <span>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호 입력"
            />
          </label>

          <label className="checkbox-row">
            <input type="checkbox" checked={remember} onChange={() => setRemember((value) => !value)} />
            <span>아이디 저장</span>
          </label>

          <button type="submit" className="button button--primary button--full">
            로그인
          </button>
        </form>

        <div className="login-links">
          <Link to="/">회원가입</Link>
          <Link to="/">비밀번호 찾기</Link>
          <Link to="/">아이디 찾기</Link>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
