import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function Profile(){
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true);
    const [userXP, setUserXP] = useState(0)
    const [rank, setRank] = useState(0)
    const [finishedLessons, setFinishedLessons] = useState([])

    useEffect(() => {
        const getProfile = async () => {
            const {data: {user}} = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return; 
            }

            const [profileResult, progressResult] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('user_progress').select('completed_at, lesson_id').eq('user_id', user.id)
            ]);

            const userData = profileResult.data;
            const progressData = progressResult.data;
            
            if (userData) {
                setProfile(userData);
                
                const { count } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .gt('xp', userData.xp);
                setRank((count || 0) + 1);
            }

            if (progressData && progressData.length > 0) {
                const lessonIds = progressData.map(item => item.lesson_id);

                const {data: lessonData, error: lessonError} = await supabase
                .from('lessons')
                .select('id, title, slug')
                .in('id', lessonIds)

                if (lessonData){
                    const combinedList = progressData.map(progress => {
                        const lessonDetails = lessonData.find(l => l.id === progress.lesson_id);
                        return {
                            created_at: progress.completed_at,
                            lessons: lessonDetails
                        };
                    });

                    setFinishedLessons(combinedList)
                }
            }

            setLoading(false);
        };
            
        getProfile();

    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        )
    }

    return(
        <div className='min-h-screen bg-slate-950 text-slate-200 p-8 font-sans'>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-5xl mx-auto">

                <aside className="flex flex-col w-full md:w-64 h-fit border border-slate-800 bg-slate-900 p-6 rounded">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 text-2xl font-bold text-slate-900">{profile?.username?.[0].toUpperCase()}</div>
                    <div className="text-xl font-medium mb-1 text-white">{profile?.username}</div>
                    <div className="flex gap-1 mb-2 items-center">
                        <div className="text-slate-400">Clasament:</div>
                        <div className="">#{rank}</div>
                    </div>
                    <div className="flex items-center justify-between gap-3 py-2 text-slate-300 hover:text-white text-nowrap ">
                        <span className="text-sm font-bold text-slate-400">Nivel: {profile?.level}</span>
                        <span className="font-bold text-blue-400 font-mono">{profile?.xp} XP</span>
                    </div>
                </aside>

                <main className="flex-1 bg-slate-900 p-6 rounded border border-slate-800">
                    <h2 className="text-2xl font-medium mb-6 text-white">Lecții finalizate</h2>

                    {finishedLessons.length === 0 ? (
                        <p className="text-slate-500 italic">Nu ai terminat nicio lecție încă. Spor la treabă!</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {finishedLessons.map((item, index) => (
                                <Link 
                                    to={`/lectie/${item?.lessons?.slug}`}
                                    key={index}
                                    className="py-3 px-4 border border-slate-700 rounded-xl transition-all hover:border-slate-600 hover:bg-slate-800/50">
                                        {item?.lessons?.title}
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};