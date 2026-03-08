import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ModuleCard = ({ subject }) => {
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            const {data: {session}} = await supabase.auth.getSession();

            if (!session?.user){
                setLoading(false);
                return;
            }

            const {data: chapters} = await supabase
            .from('chapters')
            .select('id')
            .eq('subject_id', subject.id);

            if (!chapters || chapters.length === 0){
                setProgress(0);
                setLoading(false);
                return;
            }

            const chapterIds = chapters.map(ch => ch.id)
            const {data: lessons} = await supabase
            .from('lessons')
            .select("id")
            .in('chapter_id', chapterIds)

            if (!lessons || lessons.length === 0) {
                setProgress(0);
                setLoading(false);
                return;
            }

            const lessonIds = lessons.map(l => l.id)
            const {data: completed} = await supabase
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', session.user.id)
            .in('lesson_id', lessonIds)

            const progressPercent = (completed?.length / lessons.length) * 100
            setProgress(Math.round(progressPercent));
            setLoading(false);
        };

        fetchProgress()
    }, [subject.id])

    return(
        <Link>
            <div className='bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-main transition-all hover:-translate-y-1 cursor-pointer group'>
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                    <h2 className='text-xl font-semibold text-white group-hover:text-main transition-colors'>
                        {subject.title}
                    </h2>
                </div>

                <p className='text-slate-400 text-sm leading-relaxed mb-4'>
                    {subject.description}
                </p>

                <div className="mt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-400">Progres</span>
                        <span className="text-xs font-medium text-slate-300">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between gap-2">
                    <span className='text-sm font-medium'>
                        Incepe capitol
                    </span>
                    <span className='text-sm'>→</span>
                </div>
            </div>
        </Link>
    );
}

export default ModuleCard;