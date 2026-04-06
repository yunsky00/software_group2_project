import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

// Header 컴포넌트: 상단 네비게이션 바
function Header() {
  // useNavigate: 페이지 이동을 위한 훅
  const navigate = useNavigate();
  // useLocation: 현재 경로를 확인하기 위한 훅
  const location = useLocation();

  // 로고 클릭 시 홈으로 이동
  const handleLogoClick = () => {
    navigate('/');
  };

  // 메뉴 클릭 시 해당 페이지로 이동
  const handleMenuClick = (path) => {
    navigate(path);
  };

  // 현재 경로에 따라 메뉴가 active인지 확인
  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      {/* 좌측: 로고 영역 */}
      <div className="logo" onClick={handleLogoClick}>
        <div className="logo-icon">👜</div>
        <span className="logo-text">스펙모아</span>
      </div>

      {/* 우측: 메뉴 영역 */}
      <nav className="nav">
        <div
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => handleMenuClick('/')}
        >
          홈
        </div>
        <div
          className={`nav-item ${isActive('/recommendation') ? 'active' : ''}`}
          onClick={() => handleMenuClick('/recommendation')}
        >
          AI 추천
        </div>
      </nav>
    </header>
  );
}

export default Header;