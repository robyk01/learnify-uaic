import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Navbar = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    return(
        <nav className="sticky top-0 w-full z-50 glass-nav border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to='/' className="text-xl font-bold text-white flex items-center gap-2">
                        Learnify
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs">UAIC</span>
                    </Link>

                    <div>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-slate-300 text-sm">Salut, student!</span>
                                <button onClick={handleLogout} className="text-white text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded font-medium transition">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-white text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition">Intra in cont</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;