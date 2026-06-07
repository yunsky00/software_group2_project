import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Layout from './components/Layout';
import CategoryPage from './pages/CategoryPage';
import CertificateDetailPage from './pages/CertificateDetailPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RankingPage from './pages/RankingPage';
import RecommendationPage from './pages/RecommendationPage';
import SchedulePage from './pages/SchedulePage';
import ProfilePage from './pages/ProfilePage';
import { isAuthenticated } from './utils/auth';

function AppShell() {
  const location = useLocation();
  const hideHeader = location.pathname === '/login';
  const authenticated = isAuthenticated();

  if (!authenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  if (authenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout header={hideHeader ? null : <Header />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
