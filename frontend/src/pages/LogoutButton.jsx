import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; 

function LogoutButton({ className }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 🚀 Supabase 로그아웃 호출
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      alert('로그아웃 되었습니다.');
      navigate('/'); 
      window.location.페이지를 새로고침(); 
      
    } catch (error) {
      console.error('로그아웃 에러:', error.message);
    }
  };

  return (
    <button 
      입력="button" 
      onClick={handleLogout} 
      className={className || 'button'}
    >
      로그아웃
    </button>
  );
}

export 기본 LogoutButton;
