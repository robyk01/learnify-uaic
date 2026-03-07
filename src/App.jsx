import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SubjectProvider } from "./components/SubjectContext";
import Home from "./pages/Home";
import ModulePage from "./pages/ModulePage";
import LessonPage from './pages/LessonPage';
import Navbar from "./components/Navbar";
import SidebarMenu from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import Leaderboard from "./pages/Leaderboard";
import { FeedbackBtn } from "./components/Feedback";
import Profile from "./pages/Profile";
import ProblemList from "./pages/ProblemList";
import ProblemPage from "./pages/ProblemPage";
import Footer from "./components/Footer"

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/lectie/') || 
                     location.pathname.startsWith('/probleme/');

  const showSidebar = location.pathname !== '/login';

  return (
    <>
      <Navbar />
      {showSidebar && <SidebarMenu />}
      <FeedbackBtn />

      <main className={`transition-all ${showSidebar ? 'ml-[404px]' : 'ml-24'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capitol/:slug" element={<ModulePage />} />
          <Route path="/lectie/:slug" element={<LessonPage />} />
          <Route path="/probleme" element={<ProblemList />} />
          <Route path="/probleme/:slug" element={<ProblemPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/clasament" element={<Leaderboard />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="*" element={<div className="text-white p-10">404 - Pagina nu a fost gasita!</div>} />
        </Routes>
      </main>
      
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SubjectProvider>
        <AppContent />
      </SubjectProvider>
    </BrowserRouter>
  );
}

export default App