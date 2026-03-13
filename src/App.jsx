import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SubjectProvider } from "./components/SubjectContext";
import { ProfileProvider } from "./components/ProfileContext";
import Home from "./pages/Home";
import ChapterPage from "./pages/ChapterPage";
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
import News from "./pages/News";
import Feed from "./pages/Feed";

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const hideFooter = location.pathname.startsWith('/lectie/') || 
                     location.pathname.startsWith('/probleme/');

  const showSidebar = location.pathname !== '/login';

  return (
    <>
      <Navbar />
      {showSidebar && <SidebarMenu />}
      <FeedbackBtn />

      <main className={`transition-all ${showSidebar}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capitol/:slug" element={<ChapterPage />} />
          <Route path="/lectie/:slug" element={<LessonPage />} />
          <Route path="/probleme" element={<ProblemList />} />
          <Route path="/probleme/:slug" element={<ProblemPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/clasament" element={<Leaderboard />} />
          <Route path="/utilizatori/:username" element={<Profile />} />
          <Route path="/noutati" element={<News />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="*" element={<div className="flex justify-center text-white p-10">404 - Pagina nu a fost gasita!</div>} />
        </Routes>
      </main>
      
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ProfileProvider>
        <SubjectProvider>
          <AppContent />
        </SubjectProvider>
      </ProfileProvider>
    </BrowserRouter>
  );
}

export default App