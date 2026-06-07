import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { supabase } from './pages/supabaseClient'; 
import Header from './components/Header';
import Layout from './components/Layout';

// 페이지 컴포넌트들
import CategoryPage from './pages/CategoryPage';
import CertificateDetailPage from './pages/CertificateDetailPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage'; 
import RankingPage from './pages/RankingPage';
import RecommendationPage from './pages/RecommendationPage';
import SchedulePage from './pages/SchedulePage';
import ProfilePage from './pages/ProfilePage';

function AppShell() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 앱이 처음 로드될 때 현재 로그인 세션을 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false); // 세션 확인이 끝나면 로딩 종료
    });

    // 2. 로그인/로그아웃 상태 변화를 실시간으로 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => subscription.unsubscribe();
  }, []);

  // 로딩 중일 때는 아무것도 렌더링하지 않아 화면 깜빡임을 방지
  if (loading) return null; 

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // 비로그인 상태인데 인증 페이지(로그인/회원가입)가 아닌 다른 곳으로 가려 할 때
  if (!user && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  // 로그인 상태인데 로그인/회원가입 페이지로 가려 할 때 (메인으로 이동)
  if (user && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout header={isAuthPage ? null : <Header />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} /> 
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:type" element={<CategoryPage />} />
        <Route path="/certifications/:id" element={<CertificateDetailPage />} />
        <Route path="/certificate/:id" element={<CertificateDetailPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/recommendation" element={<RecommendationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
      </Routes>
    </Layout>
  );
}

export default AppShell;
