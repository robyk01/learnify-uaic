import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ModulePage from "./pages/ModulePage";
import LessonPage from './pages/LessonPage';
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";

function App() {
  return(
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modul/:slug" element={<ModulePage />} />
        <Route path="/lectie/:slug" element={<LessonPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="*" element={<div className="text-white p-10">404 - Pagina nu a fost gasita!</div>} />
      </Routes>
    </BrowserRouter>
  );
    
}

export default App
