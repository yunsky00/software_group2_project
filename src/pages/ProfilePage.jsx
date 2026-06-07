import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // 💡 Supabase 클라이언트 import
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [histories, setHistories] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. 데이터 로드 (Supabase 사용)
 useEffect(() => {
  async function fetchProfileData() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      setName(user.user_metadata?.name || '사용자');
      setEmail(user.email);

      // 1. 찜한 목록 (null 체크 추가)
      const { data: bookmarkData, error: bError } = await supabase
        .from('bookmarks')
        .select('id, certificates(*)')
        .eq('user_id', user.id);
      
      if (bError) throw bError;
      
      // 💡 데이터가 없어도 에러나지 않게 (bookmarkData || []) 추가
      setBookmarks((bookmarkData || []).map(b => ({ ...b.certificates, id: b.id })));

      // 2. AI 추천 기록 (null 체크 추가)
      const { data: historyData, error: hError } = await supabase
        .from('ai_histories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (hError) throw hError;
      
      // 💡 데이터가 없어도 에러나지 않게 (historyData || []) 추가
      setHistories(historyData || []);

    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }
  fetchProfileData();
}, [navigate]);

  // 2. 회원정보 변경 (Supabase Auth 업데이트)
  async function save(event) {
    event.preventDefault();
    setMessage('');
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: name }
      });
      if (error) throw error;
      setMessage('프로필 정보가 저장되었습니다.');
    } catch (error) {
      console.error('저장 에러:', error);
      setMessage('저장 중 오류가 발생했습니다.');
    }
  }

  // 3. 찜 삭제 (Supabase Delete)
  async function handleRemoveBookmark(bookmarkId) {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;
      setBookmarks(prev => prev.filter(item => item.id !== bookmarkId));
    } catch (error) {
      console.error('삭제 에러:', error);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '150px 20px', color: '#6d7890' }}>
        <h2>🔄 마이페이지 정보를 불러오는 중...</h2>
      </div>
    );
  }

  return (
    // ... 기존 return JSX는 그대로 유지하셔도 됩니다! ...
    <div className="page-stack">
      {/* ... 위에서 작성하신 JSX 코드 ... */}
      <div className="profile-page">
        {/* ... 생략 ... */}
        {/* 기존과 동일한 UI 사용 */}
      </div>
    </div>
  );
}

export default ProfilePage;