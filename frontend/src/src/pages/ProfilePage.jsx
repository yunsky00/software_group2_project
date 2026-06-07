import { useState } from 'react';
import './ProfilePage.css';

function ProfilePage() {
  const [name, setName] = useState('김');
  const [email, setEmail] = useState('user@example.com');

  function save(e) {
    e.preventDefault();
    // local save only for demo
    try { localStorage.setItem('profile', JSON.stringify({ name, email })); } catch (err) {}
    alert('개인정보가 저장되었습니다.');
  }

  return (
    <div className="profile-page">
      <h1>개인정보 수정</h1>
      <form onSubmit={save} className="profile-form">
        <label>
          이름
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          이메일
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <div className="profile-actions">
          <button type="submit" className="button button--primary">저장</button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
