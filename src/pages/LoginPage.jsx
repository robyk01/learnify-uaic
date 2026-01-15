import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared' 
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const LoginPage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const {data: {subscription}} = supabase.auth.onAuthStateChange((event, session) => {
            if (event == 'SIGNED_IN'){
                navigate('/')
            }
        })

        return () => subscription.unsubscribe()
    }, [navigate])

    return(
        <div className='min-h-screen bg-slate-950 flex items-center justify-center p-4'>
            <div className='max-w-md w-full bg-slate-900 rounded-xl p-8 border border-slate-800'>
                <h1 className='text-white text-2xl font-bold mb-6 text-center'>Autentificare</h1>

                <Auth supabaseClient={supabase}
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            colors: {
                                brand: '#2563eb',
                                brandAccent: '#1d4ed8'
                            }
                        }
                    }
                }}
                theme='dark'
                providers={''} />
            </div>
        </div>
    );
}

export default LoginPage;