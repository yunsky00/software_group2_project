import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('userSurname', '김');
    navigate('/home');
  };

  return (
    <div className="login-page">
      <main className="login-card">
        <h1 className="login-title">로그인</h1>
        <p className="login-welcome">스펙모아에 오신 것을 환영합니다.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-field-label" htmlFor="studentId">
            사용자 아이디
          </label>
          <input
            id="studentId"
            className="login-input"
            type="text"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            placeholder="학번 또는 아이디"
            autoComplete="username"
            required
          />

          <label className="login-field-label" htmlFor="password">
            비밀번호
          </label>
          <input
            id="password"
            className="login-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호"
            autoComplete="current-password"
            required
          />

          <label className="remember-row">
            <input
              type="checkbox"
              checked={rememberId}
              onChange={(event) => setRememberId(event.target.checked)}
            />
            아이디 저장
          </label>

          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        <div className="login-helper-links">
          <button type="button" className="helper-link">비밀번호 찾기</button>
          <span className="helper-divider">|</span>
          <button type="button" className="helper-link">아이디 찾기</button>
          <span className="helper-divider">|</span>
          <Link to="/signup" className="helper-link signup-link">회원가입</Link>
        </div>
      </main>
    </div>
  );
}

export default Login;
