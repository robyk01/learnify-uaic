import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
        <nav className="sticky top-0 w-full z-50 glass-nav border-b border-slate-800">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to='/' className="text-xl font-bold text-white flex items-center gap-2">
                        Learnify
                        <span className="bg-main text-white px-2 py-1 rounded-lg text-xs">UAIC</span>
                    </Link>

                    <div>
                        {profile ? (
                            <div className="flex items-center gap-4">
                                <span className="text-slate-300 text-sm">Salut, {profile.username}!</span>
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
    );
}

export default Navbar;