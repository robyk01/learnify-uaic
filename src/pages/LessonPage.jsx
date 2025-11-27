import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Quiz } from "../components/Quiz"

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/atom-one-dark.css'

import confetti from 'canvas-confetti'

const LessonPage = () => {
    const { slug } = useParams();

    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true) 
    const [completing, setCompleting] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [parent, setParent] = useState(null)

    useEffect(() => {
        const fetchLesson = async () => {
            const {data, error} = await supabase
            .from('lessons')
            .select('*, quiz_questions(*)')
            .eq('slug', slug)
            .single()

            if (error){
                console.error("Eroare: ", error)
                setLoading(false)
                return
            } 
            
            setLesson(data)

            const { data: lessonParent } = await supabase
            .from('modules')
            .select('*')
            .eq('id', data.module_id)
            .single()

            if (!parent) setParent(lessonParent)

            const {data: {session}} = await supabase.auth.getSession()

            if (session?.user){
                const {data: progress} = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', session.user.id)
                .eq('lesson_id', data.id)
                .single()

                if (progress) setIsCompleted(true)
            }

        setLoading(false)
        }

        fetchLesson()
    }, [slug])

    const handleComplete = async () => {
        setCompleting(true)

        const {data: {session}} = await supabase.auth.getSession()

        if (!session){
            alert("Trebuie sa fii logat!")
            setCompleting(false)
            return
        }

        const {error} = await supabase
        .from('user_progress')
        .insert({
            user_id: session.user.id,
            lesson_id: lesson.id
        })

        if (error){
            console.error(error)
        } else {
            setIsCompleted(true)
            triggerConfetti()
        }
        setCompleting(false)
    }

    const triggerConfetti = () => {
        confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        )
    }
    if (!lesson) return <div className="text-white p-8">Lectia nu a fost gasita</div>

    return(
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
            <div className="max-w-5xl mx-auto">
                <Link to={`/modul/${parent.slug}`} className="bg-main hover:bg-blue-700 px-3 py-1 mb-6 inline-block rounded text-sm transition-colors">
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
                        Lecția anterioară
                    </button>

                    {!isCompleted ? (
                        <button
                            onClick={handleComplete}
                            disabled={completing}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold shadow-lg shadow-green-900/50 transition duration-300">
                            {completing ? 'Se salveaza..' : `Finalizeaza lectia (+${lesson.xp_reward} XP)` }
                        </button>
                    ) : (
                        <button disabled className="bg-green-900/30 text-green-400 border border-green-800 px-6 py-3 rounded font-bold cursor-default">
                            Lecție completată
                        </button>
                    )}
                    
                </div>
            </div>
        </div>
    );
}

export default LessonPage;