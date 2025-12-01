import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import ModuleCard from '../components/ModuleCard'

export default function Home() {
    const [modules, setModules] = useState([])
    const [error, setError] = useState(null)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
    const fetchModules = async () => {
        const {data, error} = await supabase
        .from('modules')
        .select('*')
        .order('order_index', { ascending: true })
        
        if (error) {
        setError(error.message)
        console.error('Eroare: ', error)
        } else {
        setModules(data)
        console.log('Date primite: ', data)
        }

        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
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

    return (
        <div className='min-h-screen bg-slate-950 text-slate-200 p-8 font-sans'>

        <div className="max-w-5xl mx-auto mb-20 text-center">
            <h1 className='text-4xl font-bold text-white mb-2'>
                Salut, {profile ? <span className="text-blue-500">{profile?.username}</span> : "student"}! 👋
            </h1>
            <p className='text-slate-400 text-lg'>
                Pregătește-te pentru structuri de date și algoritmi.
            </p>
        </div>

        {error && <p>Eroare: {error}</p>}

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card */}
            {modules.map((modul) => (
                <ModuleCard key={modul.id} module={modul} />
            ))}
        </div>

        </div>
    )
}
