import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// 🟢 수파베이스 클라이언트 임포트
import { supabase } from './supabaseClient'; 

function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState(''); // 📌 테이블 구조에 맞게 닉네임 상태 추가
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSignUp = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    if (password !== confirmPassword) {
      setMessage('비밀번호가 서로 일치하지 않습니다.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      // 🛠️ 내장 Auth 대신 다빈님이 만든 users 테이블에 회원 데이터 직접 INSERT
      const { data, error } = await supabase
        .from('users') // 커스텀 테이블 타깃팅
        .insert([
          { 
            email: email.trim(), 
            password: password, 
            nickname: nickname.trim() 
          }
        ]);

      if (error) throw error;

      setMessage('🎉 회원가입이 완료되었습니다! 로그인해 주세요.');
      setTimeout(() => {
        navigate('/login'); // 성공 시 로그인 페이지로 이동
      }, 2000);

    } catch (error) {
      console.error('회원가입 에러:', error.message);
      setIsError(true);
      
      // 이메일 중복 제약조건(Unique Constraint) 등에 걸렸을 때의 예외 처리
      if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
        setMessage('이미 가입된 이메일 주소입니다.');
      } else {
        setMessage('회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="profile-edit-page signup-page-container" style={{ padding: '120px 20px 40px' }}>
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← 이전으로
      </button>

      <div className="profile-edit-card" style={{ maxWidth: '460px', margin: '0 auto' }}>
        <div className="profile-edit-card__header">
          <span className="eyebrow" style={{ background: '#eefcf3', color: '#10b981', padding: '4px 12px', borderRadius: '999px' }}>
        
          </span>
          <h1 style={{ marginTop: '12px', textAlign: 'center' }}>회원가입</h1>
          <p>스펙모아의 새로운 회원이 되어 맞춤형 스펙 관리를 시작하세요.</p>
        </div>

        <form className="login-form" onSubmit={handleSignUp}>
          <label>
            <span>이메일 주소</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
            />
          </label>

          {/* 📌 테이블 구조 매칭을 위한 닉네임 입력란 추가 */}
          <label>
            <span>닉네임</span>
            <input
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="사용할 닉네임 입력"
              required
            />
          </label>

          <label>
            <span>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="6자리 이상 입력"
              required
            />
          </label>

          <label>
            <span>비밀번호 확인</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="비밀번호 재입력"
              required
            />
          </label>

          {message && (
            <p style={{ color: isError ? '#ef4444' : '#10b981', textAlign: 'center', fontWeight: '600' }}>
              {isError ? '❌ ' : ''}{message}
            </p>
          )}

          <button type="submit" className="button button--primary" disabled={isLoading} style={{ width: '100%', marginTop: '10px' }}>
            {isLoading ? '⏳ 등록 중...' : '가입하기'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" style={{ color: '#3565de', fontWeight: '700', marginLeft: '6px', textDecoration: 'none' }}>
            로그인하기
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SignUpPage;