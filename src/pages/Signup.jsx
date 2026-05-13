import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userId: '',
    password: '',
    email: '',
    name: '',
    birth: '',
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <div className="signup-page">
      <main className="signup-card">
        <h1 className="signup-title">회원가입</h1>

        <form className="signup-form" onSubmit={handleSubmit}>
          <section className="signup-group">
            <div className="signup-row">
              <input
                type="text"
                className="signup-input"
                placeholder="아이디"
                value={form.userId}
                onChange={(event) => handleChange('userId', event.target.value)}
                required
              />
            </div>

            <div className="signup-row">
              <input
                type="password"
                className="signup-input"
                placeholder="비밀번호"
                value={form.password}
                onChange={(event) => handleChange('password', event.target.value)}
                required
              />
            </div>

            <div className="signup-row">
              <input
                type="email"
                className="signup-input"
                placeholder="[선택] 이메일주소 (비밀번호 찾기 등 본인 확인용)"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
              />
            </div>
          </section>

          <section className="signup-group">
            <div className="signup-row">
              <input
                type="text"
                className="signup-input"
                placeholder="이름"
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                required
              />
            </div>

            <div className="signup-row">
              <input
                type="text"
                className="signup-input"
                placeholder="생년월일 8자리"
                maxLength={8}
                value={form.birth}
                onChange={(event) => handleChange('birth', event.target.value.replace(/[^0-9]/g, ''))}
                required
              />
            </div>
          </section>

          <button type="submit" className="signup-button">
            가입하기
          </button>
        </form>
      </main>
    </div>
  );
}

export default Signup;
