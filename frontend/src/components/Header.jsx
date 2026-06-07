import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImage from '../assets/specmoa-logo.png';
import { supabase } from '../pages/supabaseClient'; 

const navItems = [
  { 까지: '/', label: '홈' },
  { 까지: '/recommendation', label: 'AI 추천' },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });


    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });


    function onDoc(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', onDoc);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate('/'); 
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

        {/* 로그인 여부에 따라 UI 분기 */}
        <div className="profile-dropdown-wrap" ref={ref}>
          {user ? (
            <>
              <button
                type="button"
                className="profile-badge"
                aria-label="프로필 메뉴"
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
              >
                {/* 닉네임이 있다면 가져오고, 없으면 이메일 앞글자 표시 */}
                {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0).toUpperCase() || '👤'}
              </button>

              {open && (
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
              )}
            </>
          ) : (
            <NavLink to="/login" className="site-nav__link">
              로그인
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

// 아이콘 컴포넌트들은 동일하게 유지...
function UserIcon() { /* ... */ }
function LogoutIcon() { /* ... */ }

export default Header;
