import { useEffect, useState, useContext, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { SubjectContext } from "./SubjectContext";

const SidebarMenu = () => {
    const { chapters, selectedSubject, setSelectedSubject, isClosing, setIsClosing, closeSubject, loading } = useContext(SubjectContext);
    const prevSubjectRef = useRef(null)
    const [shouldAnimate, setShouldAnimate] = useState(false);

    // useEffect(() => {
    //     setSelectedSubject(null);
    // }, [location.pathname, setSelectedSubject]);

    useEffect(() => {
        if (selectedSubject && !prevSubjectRef.current) {
            setShouldAnimate(true);
        }
        prevSubjectRef.current = selectedSubject;
    }, [selectedSubject]);

    if (!selectedSubject && !isClosing) return null;

    const animationClass = isClosing 
        ? 'animate-out slide-out-to-left duration-200 fill-mode-forwards' 
        : shouldAnimate 
        ? 'animate-in slide-in-from-left duration-200' 
        : '';

    if (loading) {
        return (
            <aside className={`hidden w-[80%] md:w-80 h-screen bg-slate-900 backdrop-blur-xl border-r border-slate-700/50 md:flex flex-col overflow-hidden fixed left-24 top-0 z-40 ${animationClass}`}>
                <div className="p-6 space-y-4">
                    <div className="h-8 bg-slate-700 rounded w-3/4"></div>
                </div>
            </aside>
        );
    }

    return (
        <aside className={`hidden w-[80%] md:w-80 h-screen bg-slate-900 backdrop-blur-xl border-r border-slate-700/50 md:flex flex-col overflow-hidden fixed left-24 top-0 z-40 ${animationClass}`}>
            
            <div className="p-6 border-b border-slate-700/50 flex-shrink-0 flex justify-between items-start">
                <div className="w-[80%]">
                    <h2 className="text-xl font-bold text-white">{selectedSubject.title}</h2>
                    <p className="text-xs text-slate-400 mt-2">Capitole</p>
                </div>
                <button 
                    onClick={closeSubject}
                    className="text-slate-400 hover:text-white transition hidden md:block">
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
                {chapters.length > 0 ? (
                    chapters.map((chapter) => (
                        <NavLink
                            key={chapter.id}
                            to={`/capitol/${chapter.slug}`}
                            className={({ isActive }) => `block w-full p-3 rounded-lg text-sm font-semibold transition ${
                                isActive
                                    ? 'bg-blue-500/20 text-blue-300 border-l-2 border-blue-500'
                                    : 'text-slate-200 hover:bg-slate-800/50 hover:text-white'
                            }`}>
                            {chapter.title}
                        </NavLink>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-slate-400 text-sm">Nu sunt capitole disponibile</p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-slate-700/50 text-xs text-slate-500 flex-shrink-0">
                <p>Total capitole: <span className="text-slate-300 font-semibold">{chapters.length}</span></p>
            </div>
        </aside>
    );
};

export default SidebarMenu;