import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from './supabaseClient'; 

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 🛡️ Supabase 표준 인증 처리 함수
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // 🚀 Supabase Auth를 통한 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      // 🟢 로그인 성공 시 자동으로 세션이 저장됨 (localStorage 관리 필요 없음)
      console.log('로그인 성공:', data.user);
      
      // 메인 페이지로 이동
      navigate('/');
      
    } catch (error) {
      console.error('로그인 에러:', error.message);
      // 사용자에게 보여줄 메시지 (상황에 따라 한글화)
      if (error.message === 'Invalid login credentials') {
        setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setErrorMessage('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="profile-edit-page login-page-container" style={{ padding: '120px 20px 40px' }}>

      <div className="profile-edit-card" style={{ maxWidth: '460px', margin: '0 auto', textAlign: 'center' }}>
        <div className="profile-edit-card__header">
          <span className="eyebrow" style={{ background: '#edf3ff', color: '#3565de', textAlign: 'center', padding: '4px 12px', borderRadius: '999px' }}>
            SPEC MOA
          </span>
          <h1 style={{ marginTop: '12px', textAlign: 'center'}}>로그인</h1>
          <p>서비스 이용을 위해 이메일 계정으로 로그인해 주세요.</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <label>
            <span>이메일</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
            />
          </label>

          <label>
            <span>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호 입력"
              required
            />
          </label>

          {errorMessage && (
            <p className="profile-edit-card__message" style={{ color: '#ef4444', textAlign: 'center', fontWeight: '600' }}>
              ❌ {errorMessage}
            </p>
          )}

          <button type="submit" className="button button--primary" disabled={isLoading} style={{ width: '100%', marginTop: '10px' }}>
            {isLoading ? '⏳ 로그인 중...' : '로그인하기'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
            아직 회원이 아니신가요?{' '}
          <Link to="/signup" style={{ color: '#3565de', fontWeight: '700', marginLeft: '6px', textDecoration: 'none' }}>
            회원가입 하기
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;