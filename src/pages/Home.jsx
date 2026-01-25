import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import ModuleCard from '../components/ModuleCard'
import { useNavigate } from 'react-router-dom'
import UpdateAlert from '../components/UpdateAlert'


export default function Home() {
    const [modules, setModules] = useState([])
    const [profile, setProfile] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
    const fetchModules = async () => {
        const {data, error} = await supabase
        .from('modules')
        .select('*')
        .eq('hidden', false)
        .order('order_index', { ascending: true })
        
        if (error) {
        console.error('Eroare: ', error)
        } else {
        setModules(data)
        console.log('Date primite: ', data)
        }

        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          setIsAuthenticated(true)
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setProfile(profileData)
      }
    }

    fetchModules()
    }, [])

    const handleMockupClick = () => {
        if (!isAuthenticated) {
            alert('Trebuie să fii autentificat pentru a accesa simularea de examen!');
            navigate('/login');
            return;
        }
        navigate('/lectie/simulare-sesiune-2026');
    }

    return (
        <div className='min-h-screen bg-slate-950 text-slate-200 p-8 font-sans mb-12'>

            <UpdateAlert />

            <div className="max-w-5xl mx-auto mb-20 text-center">
                <h1 className='text-4xl font-bold text-white mb-2'>
                    Salut, {profile ? <span className="text-blue-500">{profile?.username}</span> : "student"}! 👋
                </h1>
                <p className='text-slate-400 text-lg'>
                    Pregătește-te pentru structuri de date și algoritmi.
                </p>
            </div>

            <div className="max-w-5xl mx-auto mb-10 relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-600/10 p-6 md:p-8">
                <div className="relative z-10 flex flex-col py-4 md:flex-row items-start md:items-center justify-between gap-6">
                    
                    <div className="max-w-2xl">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-2">
                            <span className="bg-amber-500 w-fit text-black text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                Nou
                            </span>
                            <h2 className="text-2xl font-bold text-white">
                                Simulare sesiune 2026
                            </h2>
                        </div>
                        <p className="text-slate-300 text-sm md:text-base mb-1">
                            Nu știi de unde să începi?
                        </p>
                        <p className="text-slate-400 text-sm">
                            Rezolvă un test cu 10 grile exclusiv din subiecte din anii trecuți.
                        </p>
                    </div>

                    <button 
                        onClick={handleMockupClick} 
                        className="whitespace-nowrap bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-6 rounded-lg shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105"
                    >
                        Începe →
                    </button>
                </div>

                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card */}
                {modules.map((modul) => (
                    <ModuleCard key={modul.id} module={modul} />
                ))}
            </div>

        </div>
    )
}
