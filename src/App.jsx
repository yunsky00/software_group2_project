import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import CertificateDetail from "./pages/CertificateDetail";
import Ranking from "./pages/Ranking";
import Recommendation from "./pages/Recommendation";
import Schedule from "./pages/Schedule";
import Header from "./components/Header"; // Header 컴포넌트 import

function App() {
  return (
    <BrowserRouter>
      <Header /> {/* 모든 페이지에서 보이는 Header */}
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<Home />} />

        {/* 카테고리 */}
        <Route path="/category/:type" element={<CategoryPage />} />
        <Route path="/certificate/:certName" element={<CertificateDetail />} />

        {/* 기타 페이지 */}
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;