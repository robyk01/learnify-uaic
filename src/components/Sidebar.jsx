import { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { SubjectContext } from "./SubjectContext";
import { ChevronDown } from "lucide-react";

const SidebarMenu = () => {
    const { selectedSubject } = useContext(SubjectContext);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedSubject) return;

        const fetchChapters = async () => {
            setLoading(true);

            const { data: chaptersData, error } = await supabase
                .from('chapters')
                .select('id, title, slug, order_index')
                .eq('subject_id', selectedSubject.id)
                .eq('hidden', false)
                .order('order_index', { ascending: true });

            if (error) console.error("Error fetching chapters:", error);
            setChapters(chaptersData || []);
            setLoading(false);
        };

        fetchChapters();
    }, [selectedSubject]);

    if (!selectedSubject) return null;

    if (loading) {
        return (
            <aside className="w-80 h-screen bg-slate-900/30 backdrop-blur-xl border-r border-slate-700/50 fixed left-24 top-0 z-40 animate-pulse">
                <div className="p-6 space-y-4">
                    <div className="h-8 bg-slate-700 rounded w-3/4"></div>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-80 h-screen bg-slate-900/30 backdrop-blur-xl border-r border-slate-700/50 flex flex-col overflow-hidden fixed left-24 top-0 z-40">
            
            <div className="p-6 border-b border-slate-700/50 flex-shrink-0">
                <h2 className="text-2xl font-bold text-white">{selectedSubject.title}</h2>
                <p className="text-xs text-slate-400 mt-2">Capitole</p>
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