import { useEffect, useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { SubjectContext } from "./SubjectContext";
import MobileMenu from "./MobileMenu";

import { Home, Book, Compass, Trophy, Settings, LogOut, User, X } from "lucide-react";

const Navbar = () => {
    const { subjects, selectedSubject, setSelectedSubject, closeSubject, handleSubjectClick} = useContext(SubjectContext);
    const [profile, setProfile] = useState(null)
    const [openProfile, setOpenProfile] = useState(null)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    useEffect(() => {
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

    const closeMobile = () => (setIsMobileOpen(false))
    
    const navLinkClass = ({ isActive }) => 
  `flex-1 p-2 m-2 rounded-2xl transition-all ${isActive && !isMobileOpen ? "text-white bg-slate-800" : ""}`;

    return(
        <>
            <nav className={`hidden fixed bg-slate-900/50 top-0 left-0 h-screen w-24 z-50 glass-nav border-r border-slate-800 md:flex flex-col items-center gap-6 py-6 transition-transform duration-300 md:translate-x-0}`}>
                {/* Logo */}
                <div className="flex flex-col items-center gap-6">
                    <Link 
                        to="/" 
                        onClick={() => {
                            setSelectedSubject(null)
                            setOpenProfile(false)
                        }}
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
                            className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white border-2 transition-all duration-300 overflow-hidden relative group ${
                                selectedSubject?.id === subject.id 
                                    ? 'border-white/20 '
                                    : 'border-transparent'
                            }`}>

                            <img
                                src={subject.imgUrl}
                                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] pointer-events-none object-cover transition-all ${
                                    selectedSubject?.id === subject.id 
                                        ? 'opacity-90'
                                        : 'opacity-70 group-hover:opacity-90'
                                }`}
                            />
                            
                            <span className="relative z-10">{subject.shortname}</span>
                        </button>
                    ))}
                </div>

                
                <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                    
                    {/* Clasament */}
                    <NavLink
                        to="/clasament"
                        onClick={() => {
                            setSelectedSubject(null)
                        }}
                        className={({ isActive }) => `w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
                            isActive
                                ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-white/30 shadow-lg shadow-yellow-500/50"
                                : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-white hover:shadow-lg"
                        }`}>
                        <Trophy className="h-6 w-6" />
                    </NavLink>
                    
                    {/* Profile */}
                    {profile ? (
                        <div className="relative">
                            
                            {profile?.avatar_url ? (
                                <button onClick={() => setOpenProfile(!openProfile)}>
                                    <img 
                                        src={profile?.avatar_url} 
                                        alt={profile?.username}
                                        className="w-14 h-14 rounded-full border-2 border-white/20 object-cover"
                                    />
                                </button>
                            ) : (
                                <button onClick={() => setOpenProfile(!openProfile)}
                                    className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold backdrop-blur-md border border-slate-600/50 hover:border-white/30 transition-all duration-300 hover:shadow-lg">
                                        {profile?.username?.[0].toUpperCase()}
                                        
                                </button>
                            )}
                            
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
                                        to={`/utilizatori/${profile.username}`}
                                        onClick={() => {
                                            closeSubject();
                                            setOpenProfile(!openProfile);
                                        }}
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
            
            <div className="w-[90%] fixed bottom-3 left-[50%] -translate-x-[50%] bg-black/30 glass-nav rounded-3xl border-t border-slate-700 z-10">
                <ul className="flex justify-around md:hidden lg:hidden list-none text-slate-400 text-xs font-medium cursor-pointer">
                    <NavLink
                        to="/"
                        onClick={closeMobile}
                        className={navLinkClass}>
                        <div className="flex flex-col items-center gap-1">
                            <Home className="h-5 w-5" />
                            <span>Acasă</span>
                        </div>
                    </NavLink>

                    <button
                        onClick={() => setIsMobileOpen((p) => !p)}
                        to="/cursuri"
                        className={navLinkClass({ isActive: isMobileOpen })}>
                        <div className="flex flex-col items-center gap-1">
                            <Book className="h-5 w-5" />
                            <span>Cursuri</span>
                        </div>
                    </button>

                    <NavLink
                        to="/feed"
                        onClick={closeMobile}
                        className={navLinkClass}>
                            <div className="flex flex-col items-center gap-1">
                                <Compass className="h-5 w-5" />
                                <span>Feed</span>
                            </div>
                    </NavLink>

                    <NavLink
                        to="/clasament"
                        onClick={closeMobile}
                        className={navLinkClass}>
                            <div className="flex flex-col items-center gap-1">
                                <Trophy className="h-5 w-5" />
                                <span>Clasament</span>
                            </div>
                    </NavLink>

                    <NavLink
                        to={`${profile ? `/utilizatori/${profile?.username}` : '/login'}`}
                        onClick={closeMobile}
                        className={navLinkClass}>
                            <div className="flex flex-col items-center gap-1">
                                <User className="h-5 w-5" />
                                <span>Profil</span>
                            </div>
                    </NavLink>
                </ul>
            </div>

            <div className="block md:hidden">
                {isMobileOpen && (
                    <MobileMenu onClose={closeMobile} />
                )}
            </div>
        </>
    );
}

export default Navbar;