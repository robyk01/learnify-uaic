import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import ModuleCard from '../components/ModuleCard'
import { useNavigate } from 'react-router-dom'
import UpdateAlert from '../components/UpdateAlert'


export default function Home() {
    const [chapters, setchapters] = useState([])
    const [profile, setProfile] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
    const fetchchapters = async () => {
        const {data, error} = await supabase
        .from('chapters')
        .select('*')
        .eq('hidden', false)
        .order('order_index', { ascending: true })
        
        if (error) {
        console.error('Eroare: ', error)
        } else {
        setchapters(data)
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

    fetchchapters()
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

            <div className="max-w-5xl mx-auto mb-20 text-center flex flex-col gap-12">
                <div className="flex justify-center">
                    <img src="/logo.png" className='w-48'></img>
                </div>
                <div className="">
                    <h1 className='text-4xl font-bold text-white mb-2'>
                    Salut, {profile ? <span className="text-blue-500">{profile?.username}</span> : "student"}! 👋
                    </h1>
                    <p className='text-slate-400 text-lg'>
                        Pregătește-te eficient pentru semestrul 2.
                    </p>
                </div>
                
            </div>

            <div className="max-w-5xl mx-auto mb-10 relative overflow-hidden rounded-xl p-6 md:p-8">
                
            </div>

        </div>
    )
}
