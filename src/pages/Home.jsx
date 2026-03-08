import { useState, useEffect, useContext } from 'react'
import { supabase } from '../supabaseClient'
import ModuleCard from '../components/ModuleCard'
import { useNavigate, Link } from 'react-router-dom'
import UpdateAlert from '../components/UpdateAlert'
import { SubjectContext } from '../components/SubjectContext'


export default function Home() {
    const [subjects, setSubjects] = useState([])
    const [profile, setProfile] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [lastLesson, setLastLesson] = useState(null)
    const navigate = useNavigate()
    const { handleSubjectClick } = useContext(SubjectContext)

    useEffect(() => {
    const fetchchapters = async () => {
        const {data, error} = await supabase
        .from('subjects')
        .select('*')
        .eq('is_active', true)
        
        if (error) {
        console.error('Eroare: ', error)
        } else {
        setSubjects(data)
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

            const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('lesson_id, completed_at')
            .eq('user_id', session.user.id)
            .order('completed_at', {ascending: false})
            .limit(1)
            .single()

            if (progressError) {
                console.error('Progress error:', progressError)
            }

            if (progressData){
                const { data: lessonData } = await supabase
                .from('lessons')
                .select('id, title, slug, chapter_id')
                .eq('id', progressData.lesson_id)
                .single()
          
                if (lessonData){
                    const { data: chapterData } = await supabase
                    .from('chapters')
                    .select('title, slug')
                    .eq('id', lessonData.chapter_id)
                    .single()
                
                    setLastLesson({
                        ...lessonData,
                        chapter: chapterData
                    })
                }
            } 
        }
    }

    fetchchapters()
    }, [])

    return (
        <div className='min-h-screen text-slate-200 p-8 font-sans mb-12'>

            {/* <UpdateAlert /> */}

            <div className="max-w-5xl mx-auto mb-20 pb-10 border-b border-slate-800 text-center flex flex-col gap-12">
                <div className="flex justify-center pointer-events-none">
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

            {lastLesson && (
                <div className="max-w-5xl mx-auto rounded-xl pb-10">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
                        <p className="text-slate-400 mb-3">Ai rămas la lecția:</p>
                        <h2 className="text-2xl font-bold text-white mb-2">{lastLesson.title}</h2>
                        <p className="text-slate-400 mb-6">din capitolul <span className="text-blue-400">{lastLesson.chapter.title}</span></p>
                        <Link 
                            to={`/lectie/${lastLesson.slug}`}
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-3 rounded-lg font-medium transition duration-300">
                            Continuă lecția →
                        </Link>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto ">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subjects.map((subject) => (
                        <div key={subject.id} onClick={() => handleSubjectClick(subject)} className="cursor-pointer">
                            <ModuleCard subject={subject} />
                        </div>
                    ))}
                </div>
            </div>


            <div className="max-w-5xl mx-auto mt-20 pt-10 mb-20 border-t border-slate-800">
                <h2 className="text-2xl font-bold text-white mb-4">Noutăți</h2>
                <div className="space-y-4">
                    <div className="border border-slate-800 p-4 rounded-lg ">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-white">Meniu complet refăcut</h3>
                            <span className="text-xs text-slate-500">8 Mar</span>
                        </div>
                        <p className="text-sm text-slate-400">Meniul materiilor se află în partea stângă. Click pe o materie să vezi cursurile.</p>
                    </div>

                    <div className="border border-slate-800 p-4 rounded-lg ">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-white">Adăugat ultimul progres</h3>
                            <span className="text-xs text-slate-500">8 Mar</span>
                        </div>
                        <p className="text-sm text-slate-400">Pe prima pagina poți să vezi unde ai ajuns cu învățatul.</p>
                    </div>
                </div>

            </div>

        </div>
    )
}
