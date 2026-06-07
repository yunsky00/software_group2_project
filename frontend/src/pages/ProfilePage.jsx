import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './ProfilePage.css'; // 제공해주신 CSS 파일이 이 이름이라고 가정합니다.

function ProfilePage() {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [histories, setHistories] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

        // 찜한 목록 가져오기
        const { data: bookmarkData, error: bError } = await supabase
          .from('bookmarks')
          .select('id, certificates(*)')
          .eq('user_id', user.id);
        
        if (bError) throw bError;
        setBookmarks((bookmarkData || []).map(b => ({ ...b.certificates, id: b.id })));

        // 활동 기록 가져오기 (테이블 명 확인 완료)
        const { data: historyData, error: hError } = await supabase
          .from('ai_recommendation_logs')
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
    setIsSaving(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: name }
      });
      if (error) throw error;
      setMessage('✅ 프로필 정보가 저장되었습니다.');
    } catch (error) {
      console.error('저장 에러:', error);
      setMessage('❌ 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
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
    return <div style={{ textAlign: 'center', padding: '150px 20px' }}>🔄 불러오는 중...</div>;
  }

  return (
    <div className="profile-page">
      {/* 뒤로가기 및 헤더 */}
      <button className="profile-page__back" onClick={() => navigate(-1)}>← 이전으로</button>
      
      <div className="profile-page__header">
        <span className="profile-page__eyebrow">MY ACCOUNT</span>
        <h1>마이페이지</h1>
        <p>프로필 정보를 관리하고 추천 활동 기록을 확인하세요.</p>
      </div>

      {/* 1. 프로필 수정 섹션 */}
      <section className="profile-section">
        <div className="profile-section__title">
          <h2>계정 설정</h2>
        </div>
        <form className="profile-form" onSubmit={save}>
          <label>이름
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름 입력" />
          </label>
          <label>이메일
            <input value={email} disabled style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }} />
          </label>
          <div className="profile-actions">
            <button type="submit" disabled={isSaving} className="button--primary">
              {isSaving ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
          {message && <p className="profile-message">{message}</p>}
        </form>
      </section>

      {/* 2. 찜한 목록 섹션 */}
      <section className="profile-section">
        <div className="profile-section__title">
          <h2>찜한 목록</h2>
        </div>
        {bookmarks.length === 0 ? (
          <div className="profile-empty">찜한 항목이 없습니다.</div>
        ) : (
          <div className="profile-list">
            {bookmarks.map((item) => (
              <div key={item.id} className="profile-card">
                <div className="profile-card__header">
                  <strong>{item.title}</strong>
                  <button onClick={() => handleRemoveBookmark(item.id)}>삭제</button>
                </div>
                <p>{item.description || '설명이 없습니다.'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. 활동 기록 섹션 */}
      <section className="profile-section">
        <div className="profile-section__title">
          <h2>활동 기록</h2>
        </div>
        {histories.length === 0 ? (
          <div className="profile-empty">추천받은 기록이 없습니다.</div>
        ) : (
          <div className="profile-history-list">
            {histories.map((h) => (
              <div key={h.id} className="profile-history-item">
                <strong>{h.result_title || '추천 결과'}</strong>
                <span>{new Date(h.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
