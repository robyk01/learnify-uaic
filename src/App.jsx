import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [modules, setModules] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchModules = async () => {
      const {data, error} = await supabase
        .from('modules')
        .select('*')
        .order('order_index', { ascending: true})
      
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

      <div className="max-w-4xl mx-auto mb-20 text-center">
        <h1 className='text-4xl font-bold text-white mb-2'>Learnify UAIC</h1>
        <p className='text-slate-400 text-lg'>
          Pregătește-te pentru structuri de date și algoritmi.
        </p>
      </div>

      {error && <p>Eroare: {error}</p>}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card */}
          {modules.map((modul) => (
            <div key={modul.id} className='bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all hover:-translate-y-1 cursor-pointer group'>
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <h2 className='text-xl font-semibold text-white group-hover:text-blue-400 transition-colors'>
                  {modul.title}
                </h2> 
                <span className='bg-slate-800 text-xs font-bold px-2 py-1 rounded'>
                  #{modul.order_index}
                </span>
              </div>

              <p className='text-slate-400 text-sm leading-relaxed mb-4'>
                {modul.description}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between gap-2">
                <span className='text-sm font-medium'>
                  Incepe capitol
                  </span>
                <span className='text-sm'>→</span>
              </div>
            </div>
          ))}
      </div>
      
    </div>
  )
}

export default App
