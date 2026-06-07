import { useEffect, useState } from 'react';
import { 링크, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
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

      const { data: bookmarkData, error: bError } = await supabase
        .from('bookmarks')
        .select('id, certificates(*)')
        .eq('user_id', user.id);
      
      if (bError) throw bError;
      
      setBookmarks((bookmarkData || []).map(b => ({ ...b.certificates, id: b.id })));

      const { data: historyData, error: hError } = await supabase
        .from('ai_histories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (hError) throw hError;

      setHistories(historyData || []);

    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }
  fetchProfileData();
}, [navigate]);

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
    <div className="page-stack">
      <div className="profile-page">
      </div>
    </div>
  );
}

export default ProfilePage;
