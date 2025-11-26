import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import ModuleCard from '../components/ModuleCard'

const Home = () => {
    const [modules, setModules] = useState([])
    const [error, setError] = useState(null)

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
    }

    fetchModules()
    }, [])

    return (
        <div className='min-h-screen bg-slate-950 text-slate-200 p-8 font-sans'>

        <div className="max-w-5xl mx-auto mb-20 text-center">
            <h1 className='text-4xl font-bold text-white mb-2'>
                Learnify UAIC
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

export default Home