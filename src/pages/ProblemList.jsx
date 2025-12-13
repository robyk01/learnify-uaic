import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

const ProblemList = () => {
    const [problems, setProblems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getProblems = async () => {
            const {data: problemData, error} = await supabase
            .from('lessons')
            .select('*')
            .eq('lesson_type', 'code')

            if (error){
                console.error('Error fetching problems:', error)
                setLoading(false)
                return
            }

            if (problemData){
                setProblems(problemData)
                setLoading(false)
            }
        }

        getProblems();
    }, [])


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        )
    }

    return(
        <div className='min-h-screen bg-slate-950 text-slate-200 p-8 font-sans'>

            <div className="max-w-5xl mx-auto">
                <h1 className='text-4xl font-bold text-white mb-6'>Listă de probleme</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {problems.map((problem) => (
                        <Link
                            to={`/probleme/${problem.slug}`}
                            className="bg-slate-900 p-6 rounded-lg border border-slate-800 hover:bg-slate-800 transition-all group"
                            key={problem.id}>
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                                    {problem.title}
                                </h3>
                                <span className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-400 border border-green-800">
                                    Ușor
                                </span>
                            </div>
                            <p className="text-sm text-slate-400">XP reward • Status</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProblemList;