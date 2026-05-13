import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import SpecmoaLogo from './SpecmoaLogo';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ko');
  const [surname, setSurname] = useState(localStorage.getItem('userSurname') || '김');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    const savedSurname = localStorage.getItem('userSurname');
    if (savedSurname) {
      setSurname(savedSurname);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isKorean = language === 'ko';

  const labels = {
    home: isKorean ? '홈' : 'Home',
    recommendation: isKorean ? 'AI 추천' : 'AI Recommendation',
    profileEdit: isKorean ? '회원정보 수정' : 'Edit Profile',
    language: isKorean ? '언어 선택' : 'Language',
    logout: isKorean ? '로그아웃' : 'Log out',
    korean: '한국어 (ko)',
    english: 'English (en)',
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setIsProfileMenuOpen(false);
    setIsLanguageMenuOpen(false);
  };

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    setIsLanguageMenuOpen(false);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    setIsLanguageMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="logo" onClick={handleLogoClick}>
        <SpecmoaLogo className="logo-icon" />
        <span className="logo-text">스펙모아</span>
      </div>

      <div className="header-right" ref={menuRef}>
        <nav className="nav">
          <div
            className={`nav-item ${isActive('/home') ? 'active' : ''}`}
            onClick={() => handleMenuClick('/home')}
          >
            {labels.home}
          </div>
          <div
            className={`nav-item ${isActive('/recommendation') ? 'active' : ''}`}
            onClick={() => handleMenuClick('/recommendation')}
          >
            {labels.recommendation}
          </div>
        </nav>

        <button
          type="button"
          className="profile-circle"
          onClick={() => {
            setIsProfileMenuOpen((prev) => !prev);
            setIsLanguageMenuOpen(false);
          }}
          aria-label="프로필 메뉴"
        >
          {surname}
        </button>

        {isProfileMenuOpen && (
          <div className="profile-menu">
            <button type="button" className="menu-item">
              <span>{labels.profileEdit}</span>
            </button>

            <button
              type="button"
              className="menu-item menu-item-arrow"
              onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
            >
              <span>{labels.language}</span>
              <span>{isLanguageMenuOpen ? '▾' : '▸'}</span>
            </button>

            {isLanguageMenuOpen && (
              <div className="language-list">
                <button
                  type="button"
                  className={`language-option ${language === 'ko' ? 'selected' : ''}`}
                  onClick={() => handleLanguageChange('ko')}
                >
                  {labels.korean}
                </button>
                <button
                  type="button"
                  className={`language-option ${language === 'en' ? 'selected' : ''}`}
                  onClick={() => handleLanguageChange('en')}
                >
                  {labels.english}
                </button>
              </div>
            )}

            <button type="button" className="menu-item logout" onClick={handleLogout}>
              <span>{labels.logout}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
