import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // 본인의 supabaseClient 경로에 맞게 수정

function LogoutButton({ className }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 🚀 Supabase 로그아웃 호출
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      alert('로그아웃 되었습니다.');
      navigate('/'); // 로그아웃 후 홈으로 이동
      window.location.reload(); // 상태 초기화를 위해 새로고침 (선택 사항)
      
    } catch (error) {
      console.error('로그아웃 에러:', error.message);
    }
  };

  return (
    <button 
      type="button" 
      onClick={handleLogout} 
      className={className || 'button'}
    >
      로그아웃
    </button>
  );
}

export default LogoutButton;