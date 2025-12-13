import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const ModulePage = () => {
    const { slug } = useParams();
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModuleAndLessons = async () => {
            const {data, error} = await supabase
            .from('modules')
            .select('*, lessons(*)')
            .eq('slug', slug)
            .single()

            if (error){
                console.error("Eroare: ", error);
            } else {
                if (data.lessons){
                    data.lessons.sort((a, b) => a.order_index - b.order_index)
                }
                setModule(data)
            }
            setLoading(false)
        }

        fetchModuleAndLessons()
    }, [slug])

    if (loading){
        return (
            <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        )
    }
    if (!module) return <div className="text-white p-10">Modulul nu a fost gasit.</div>

    return(
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
            <div className="max-w-5xl mx-auto">

                {/* Back */}
                <Link to="/" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Înapoi
                </Link>

                {/* Module description */}
                <h1 className="text-3xl font-bold text-white mb-2">{module.title}</h1>
                <p className="text-slate-400 mb-8">{module.description}</p>

                <div className="space-y-3">
                    {module.lessons.map((lesson) => (
                        lesson.lesson_type !== 'code' && (
                            <Link 
                                key={lesson.id}
                                to={`/lectie/${lesson.slug}`}
                                className=" bg-slate-900 p-4 rounded-lg border border-slate-800 hover:border-main transition-colors flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <p className="text-xl">
                                            {lesson.lesson_type === 'theory' ? '📖' : 
                                            lesson.lesson_type === 'quiz' ? '🧩' : '💻'}
                                        </p>
                                        <p className="font-medium">{lesson.title}</p>
                                    </div>
                                    <span className="text-slate-500 text-sm">
                                        {lesson.xp_reward} XP
                                    </span>
                            </Link>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ModulePage;