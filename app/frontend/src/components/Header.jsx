import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import SpecmoaLogo from './SpecmoaLogo';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="logo" onClick={handleLogoClick}>
        <SpecmoaLogo className="logo-icon" />
        <span className="logo-text">스펙모아</span>
      </div>

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
