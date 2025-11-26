import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared' 
import { supabase } from '../supabaseClient'

const LoginPage = () => {
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
                providers={[]} />
            </div>
        </div>
    );
}

export default LoginPage;