import { useEffect, useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { SubjectContext } from "./SubjectContext";

import { Home, Code, Trophy, Settings, LogOut } from "lucide-react";

const Navbar = () => {
    const { selectedSubject, setSelectedSubject, closeSubject, handleSubjectClick } = useContext(SubjectContext);
    const [profile, setProfile] = useState(null)
    const [openProfile, setOpenProfile] = useState(null)
    const [subjects, setSubjects] = useState([]);


    useEffect(() => {
        const fetchSubjects = async () => {
            const { data, error } = await supabase
                .from('subjects')
                .select('id, title, shortname')
                .eq('is_active', true);
            
            console.log("Error:", error);

            const subjectsWithGradients = data?.map((subject, index) => ({
                ...subject,
                gradient: [
                    "from-purple-500 via-purple-600 to-purple-700",
                    "from-green-500 via-green-600 to-green-700",
                    "from-orange-500 via-orange-600 to-orange-700"
                ][index % 3]
            })) || [];
            
            setSubjects(subjectsWithGradients);
        };

        const fetchProfile = async () => {
            const {data: {session}} = await supabase.auth.getSession()

            if (session?.user){
                const {data} = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

                setProfile(data)
            } else {
                setProfile(null)
            }
        }

        fetchProfile()
        fetchSubjects()

        const {data: {subscription: authListener}} = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) fetchProfile()
            else setProfile(null)
        })

        const channel = supabase
        .channel('realtime-navbar')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles'
        }, (payload) => {
            setProfile(prevProfile => {
                if (prevProfile && payload.new.id === prevProfile.id){
                    return payload.new
                }
                return prevProfile
            })
        })
        .subscribe()

        return () => {
            authListener.unsubscribe()
            supabase.removeChannel(channel)
        }

    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setProfile(null)
    }
    

    return(
        <>
            <nav className="fixed top-0 left-0 h-screen w-24 z-50 glass-nav border-r border-slate-800 flex flex-col items-center gap-6 py-6">
                {/* Logo */}
                <div className="flex flex-col items-center gap-6">
                    <Link 
                        to="/" 
                        onClick={() => setSelectedSubject(null)}
                        className="w-16 h-16 rounded-3xl bg-gradient-to-br from-white to-white flex items-center justify-center text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 backdrop-blur-md border border-blue-400/30">
                        <img src="/icon_blue.png" alt="Logo" className="h-8" />
                    </Link>
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

                </div>

                {/* Desktop Menu */}
                <div className="flex-1 flex flex-col items-center gap-4 overflow-y-auto scrollbar-hide">
                    {subjects.map((subject) => (
                        <button
                            key={subject.id}
                            onClick={() => handleSubjectClick(subject)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white backdrop-blur-md border transition-all duration-300 overflow-hidden relative group bg-gradient-to-br ${subject.gradient} ${
                                selectedSubject?.id === subject.id 
                                    ? 'border-white/30 shadow-lg shadow-current/50 opacity-100'
                                    : 'border-white/20 opacity-70 hover:opacity-100 hover:shadow-lg hover:border-white/30'
                            }`}>
                            
                            <span className="relative z-10">{subject.shortname}</span>
                        </button>
                    ))}
                </div>

                {/* Profile */}
                <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                    
                    {/* Clasament */}
                    <NavLink
                        to="/clasament"
                        onClick={() => setSelectedSubject(null)}
                        className={({ isActive }) => `w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
                            isActive
                                ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-white/30 shadow-lg shadow-yellow-500/50"
                                : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-white hover:shadow-lg"
                        }`}>
                        <Trophy className="h-6 w-6" />
                    </NavLink>

                    {profile ? (
                        <div className="relative">
                            <button onClick={() => setOpenProfile(!openProfile)}
                                    className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold backdrop-blur-md border border-slate-600/50 hover:border-white/30 transition-all duration-300 hover:shadow-lg">
                                        {profile?.username?.[0].toUpperCase()}
                            </button>
                            
                            {openProfile && (
                                <div className="absolute left-20 bottom-0 mb-2 w-48 p-2 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200">
                                    <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-700 mb-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{profile?.username}</p>
                                            <p className="text-xs text-slate-400">Lvl {profile?.level}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between px-2 py-2 rounded-lg mb-3">
                                        <span className="text-xs text-slate-400">Experiență</span>
                                        <span className="text-sm font-bold text-blue-400 font-mono">{profile?.xp} XP</span>
                                    </div>

                                    <Link 
                                        to="/profil" 
                                        className="flex items-center gap-2 w-full px-2 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition mb-2">
                                        <Settings className="h-4 w-4" />
                                        Setări
                                    </Link>
                                    
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-2 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition">
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center justify-center text-white text-sm bg-main hover:bg-blue-700  px-4 py-2 rounded-lg font-medium transition">Login</Link>
                    )}
                </div>
            </nav>
            
            {/* Click outside to close menu */}
            {openProfile && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setOpenProfile(false)}
                ></div>
            )}

            {/* Mobile Menu Bottom */}
            <div className="w-full fixed bottom-0 bg-slate-900/50 glass-nav rounded-t-3xl border-t border-slate-600 z-10">
                <ul className=" flex justify-around md:hidden lg:hidden list-none gap-1 text-slate-400 text-xs font-medium cursor-pointer">
                        <NavLink
                            to="/"
                            className={({ isActive }) => `py-4 ${isActive ? "text-white" : ""}`}>
                            <div className="flex flex-col items-center gap-1">
                                <Home className="h-5 w-5" />
                                <span>Acasă</span>
                            </div>
                        </NavLink>

                        <NavLink
                            to="/probleme"
                            className={({ isActive }) => `py-4 ${isActive ? "text-white" : ""}`}>
                                <div className="flex flex-col items-center gap-1">
                                    <Code className="h-5 w-5" />
                                    <span>Probleme</span>
                                </div>
                        </NavLink>

                        <NavLink
                            to="/clasament"
                            className={({ isActive }) => `py-4 ${isActive ? "text-white" : ""}`}>
                                <div className="flex flex-col items-center gap-1">
                                    <Trophy className="h-5 w-5" />
                                    <span>Clasament</span>
                                </div>
                        </NavLink>
                    </ul>
            </div>
        </>
    );
}

export default Navbar;