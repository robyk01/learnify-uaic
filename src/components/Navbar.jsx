import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "../supabaseClient";

import { Home, Code, Trophy } from "lucide-react";

const Navbar = () => {
    const [profile, setProfile] = useState(null)

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

    return(
        <>
            <nav className="sticky top-0 w-full z-50 glass-nav border-b border-slate-800">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <Link to='/' className="text-xl font-bold text-white flex items-center gap-2">
                            Learnify
                            <span className="bg-main text-white px-2 py-1 rounded-lg text-xs">UAIC</span>
                        </Link>

                        <ul className="hidden md:flex lg:flex  gap-1 text-slate-400 text-sm font-medium cursor-pointer">
                            <NavLink
                                to="/"
                                className={({ isActive }) => `relative px-3 py-3 rounded transition-all ${isActive ? "text-white bg-slate-900" : "hover:bg-slate-900"}`}>
                                Acasă
                            </NavLink>

                            <NavLink
                                to="#"
                                className="relative px-3 py-3 rounded transition-all cursor-not-allowed group z-10">
                                    Probleme
                                    <span className="absolute top-0 -right-3 bg-main text-[10px] text-gray-200 px-2 rounded-full z-0">Soon</span>
                            </NavLink>

                            <NavLink
                                to="/clasament"
                                className={({ isActive }) => `relative px-3 py-3 rounded transition-all ${isActive ? "text-white bg-slate-900" : "hover:bg-slate-900"}`}>
                                    Clasament
                            </NavLink>
                        </ul>
                            

                        <div>
                            {profile ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3 bg-slate-800/50 px-3 py-1 rounded-full border border-white/10">
                                        <span className="text-xs font-bold text-slate-400">Lvl {profile.level}</span>
                                        <span className="text-sm font-bold text-blue-400 font-mono">{profile.xp} XP</span>
                                    </div>
                                    <button onClick={handleLogout} className="text-white text-sm bg-[#3366FF] hover:bg-blue-700 px-3 py-1.5 rounded font-medium transition">Logout</button>
                                </div>
                            ) : (
                                <Link to="/login" className="text-white text-sm bg-main hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition">Intra in cont</Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="w-full fixed bottom-0 bg-slate-900 rounded-t-3xl border-t border-slate-600 z-10">
                <ul className=" flex justify-around md:hidden lg:hidden list-none gap-1 text-slate-400 text-sm font-medium cursor-pointer">
                        <NavLink
                            to="/"
                            className={({ isActive }) => `p-6 ${isActive ? "text-white" : ""}`}>
                            <div className="flex flex-col items-center gap-1">
                                <Home className="h-6 w-6" />
                                <span>Acasă</span>
                            </div>
                        </NavLink>

                        <NavLink
                            to="#"
                            className={`relative p-6`}>
                                <div className="flex flex-col items-center gap-1">
                                    <Code className="h-6 w-6" />
                                    <span>Probleme</span>
                                </div>
                                <span className="absolute top-[15px] -right-2 bg-main text-[10px] text-gray-200 px-2 rounded-full z-0">Soon</span>
                        </NavLink>

                        <NavLink
                            to="/clasament"
                            className={({ isActive }) => `p-6 ${isActive ? "text-white bg-slate-900" : "hover:bg-slate-900"}`}>
                                <div className="flex flex-col items-center gap-1">
                                    <Trophy className="h-6 w-6" />
                                    <span>Clasament</span>
                                </div>
                        </NavLink>
                    </ul>
            </div>
        </>
    );
}

export default Navbar;