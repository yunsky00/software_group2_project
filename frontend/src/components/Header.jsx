import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImage from '../assets/specmoa-logo.png';
import { logout } from '../utils/auth';
import { getProfile } from '../utils/userData';

const navItems = [
  { to: '/', label: '홈' },
  { to: '/recommendation', label: 'AI 추천' },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [profileName, setProfileName] = useState('김');
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    setProfileName(getProfile().name || '김');

    function onDoc(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function onKey(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="brand">
          <img src={logoImage} alt="스펙모아" className="brand__logo" />
          <strong className="brand__text">스펙모아</strong>
        </NavLink>

        <nav className="site-nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `site-nav__link${isActive ? ' site-nav__link--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="profile-dropdown-wrap" ref={ref}>
          <button
            type="button"
            className="profile-badge"
            aria-label="프로필 메뉴"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {profileName}
          </button>

          {open ? (
            <div className="profile-menu" role="menu" aria-label="프로필 메뉴">
              <button
                type="button"
                className="profile-menu__item"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  navigate('/profile');
                }}
              >
                <UserIcon />
                <span>마이페이지</span>
              </button>

              <button type="button" className="profile-menu__item" role="menuitem" onClick={handleLogout}>
                <LogoutIcon />
                <span>로그아웃</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.866 0-7 2.239-7 5v1h14v-1c0-2.761-3.134-5-7-5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10 17l-5-5 5-5M5 12h10M14 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Header;
