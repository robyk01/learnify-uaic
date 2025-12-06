import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

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

            const profilePromise = supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

            const lessonsPromise = supabase
            .from('user_progress')
            .select('created_at, lessons!user_progress_lesson_id_fkey ( title, slug )')
            .eq('user_id', user.id);

            const [profileResult, lessonsResult] = await Promise.all([profilePromise, lessonsPromise]);

            if (profileResult.data) {
                const userData = profileResult.data;
                setProfile(userData);
                setUserXP(userData.xp);

                const { count } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gt('xp', userData.xp);

                setRank((count || 0) + 1);
            }

            if (lessonsResult.data) {
                setFinishedLessons(lessonsResult.data);
            }

            setLoading(false);
        };
            
        getProfile();

    }, []);
    return(
        <div className='min-h-screen bg-slate-950 text-slate-200 p-8 font-sans'>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">

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
                        <ul className="flex flex-col gap-4 [&>li]:py-3 [&>li]:px-4 [&>li]:border [&>li]:border-slate-700 [&>li]:rounded-xl [&>li]:transition-all hover:[&>li]:border-slate-600 hover:[&>li]:bg-slate-800/50">
                            {finishedLessons.map((item, index) => (
                                <li key={index}>
                                    {item.lessons.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </main>
            </div>
        </div>
    );
};