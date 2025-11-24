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
    <div>
      <h1>Learnify UAIC - Test</h1>
      {error && <p>Eroare: {error}</p>}
      {modules.length === 0 ? ( <p>Se incarca (sau nu ai date)...</p> ) : ( 
        <ul>
          {modules.map((modul) => (
            <li key={modul.id}>
              <strong>{modul.title}</strong> - {modul.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
