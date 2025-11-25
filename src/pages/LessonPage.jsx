import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/atom-one-dark.css'

const LessonPage = () => {
    const { slug } = useParams();
    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        const fetchLesson = async () => {
            const {data, error} = await supabase
            .from('lessons')
            .select('*')
            .eq('slug', slug)
            .single()

            if (error){
                console.error("Eroare: ", error)
            } else {
                setLesson(data)
            }
            setLoading(false)
        }

        fetchLesson()
    }, [slug])

    if (loading) return <div className="text-white p-8">Lectia se incarca..</div>
    if (!lesson) return <div className="text-white p-8">Lectia nu a fost gasita</div>

    return(
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="bg-blue-500 px-3 py-1 mb-6 inline-block rounded text-sm">
                    ← Înapoi
                </Link>

                {/* Lesson */}
                <h1 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">{lesson.title}</h1>

                <div className="prose prose-invert max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                        {lesson.content}
                    </ReactMarkdown>
                </div>

                <div className="mt-12  pt-6  border-t  border-slate-800 flex justify-between items-center">
                    <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded text-white transition">
                        Lectia anterioara
                    </button>

                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold shadow-lg shadow-green-900/50 transition duration-300">
                        Finalizeaza lectia (+{lesson.xp_reward} XP)
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LessonPage;