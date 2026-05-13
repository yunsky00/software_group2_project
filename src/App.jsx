import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import CertificateDetail from './pages/CertificateDetail';
import Ranking from './pages/Ranking';
import Recommendation from './pages/Recommendation';
import Schedule from './pages/Schedule';
import Header from './components/Header';

function AppLayout() {
  const location = useLocation();
  const hideHeaderRoutes = ['/', '/signup'];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/category/:type" element={<CategoryPage />} />
        <Route path="/certificate/:certName" element={<CertificateDetail />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
