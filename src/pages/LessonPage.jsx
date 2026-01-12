import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Quiz } from "../components/Quiz"

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/atom-one-dark.css'

import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getHeadings } from "../utils/getHeadings";
import { TableOfContents } from "../components/TableOfContents";

import confetti from 'canvas-confetti'

const LessonPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate()

    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true) 
    const [parent, setParent] = useState(null)
    const [nextLesson, setNextLesson] = useState(null)

    const [completing, setCompleting] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    function shuffleArray(array){
        if (!array) return [];

        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    }

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

            if (data.quiz_questions && data.quiz_questions.length > 0){
                data.quiz_questions = shuffleArray(data.quiz_questions);

                data.quiz_questions.forEach((question) => {
                    if (question.options){
                        question.options = shuffleArray(question.options);
                    }
                });
            }
            
            setLesson(data)

            const { data: lessonParent } = await supabase
            .from('modules')
            .select('*')
            .eq('id', data.module_id)
            .single()

            setParent(lessonParent)

            const { data: nextLessonData } = await supabase
            .from('lessons')
            .select('slug, title')
            .eq('module_id', data.module_id)
            .gt('order_index', data.order_index)
            .order('order_index', { ascending: true })
            .limit(1)
            .single()

            if (nextLessonData) setNextLesson(nextLessonData)

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

    const handleQuizComplete = async (score) => {
        const totalQ = lesson.quiz_questions.length;
        const hasPassed = score >= totalQ / 2;

        if (hasPassed){
            await handleComplete();
        }
    }

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

    const headings = lesson?.content ? getHeadings(lesson.content) : [];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        )
    }
    if (!lesson) return <div className="text-white p-8">Lectia nu a fost gasita</div>

    return(
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
            <div className="max-w-7xl mx-auto">
                
                <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                    {lesson.lesson_type === 'theory' && (
                        <div className="hidden lg:block lg:col-span-3 sticky top-8 py-2">
                            <Link to={parent ? `/modul/${parent.slug}` : '/'} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium">
                                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                                Înapoi la lecții
                            </Link>
                            <TableOfContents headings={headings} />
                        </div>
                    )}
                    
                    
                    <div className={lesson.lesson_type === 'quiz' ? "lg:col-span-12" : "lg:col-span-9"}>
                        {lesson.lesson_type === 'quiz' && (
                            <div className="mb-6">
                                <Link to={parent ? `/modul/${parent.slug}` : '/'} className={lesson.lesson_type === 'quiz' ? "hidden lg:flex group items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-medium" : "hidden"}>
                                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                                    Înapoi la lecții
                                </Link>
                            </div>
                        )}

                        <div className="mb-10 border-b border-slate-800 pb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                    {lesson.lesson_type === 'theory' ? 'Teorie' : 'Quiz'}
                                </span>
                                <span className="text-slate-500 text-sm font-mono">
                                    {lesson.xp_reward} XP
                                </span>
                            </div>
                            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
                                {lesson.title}
                            </h1>
                        </div>

                        {lesson.lesson_type === 'quiz' ? (
                            <div className="max-w-3xl mx-auto">
                                <Quiz 
                                    lesson={lesson}
                                    parent={parent}
                                    onComplete={handleQuizComplete}
                                />
                            </div>
                        ) : (
                            <>
                            <div className="prose prose-invert max-w-5xl bg-slate-900/50 p-4 md:p-10 rounded-2xl prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 [&_pre_code]:bg-transparent">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeSlug]}>
                                    {lesson.content}
                                </ReactMarkdown>
                            </div>

                            <div className="mt-12  pt-6  border-t  border-slate-800 flex justify-end items-center">
                                <div className="mr-5">
                                    {nextLesson && (
                                        <button
                                            onClick={() => navigate(`/lectie/${nextLesson.slug}`)}
                                            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded font-medium transition duration-300 flex items-center gap-2">
                                            Lecția următoare
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </button>
                                    )}
                                </div>

                                <div>
                                    {!isCompleted ? (
                                        <button
                                            onClick={handleComplete}
                                            disabled={completing}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold shadow-lg shadow-green-900/50 transition duration-300">
                                            {completing ? 'Se salvează...' : `Finalizează lecția (+${lesson.xp_reward} XP)` }
                                        </button>
                                    ) : (
                                        <button disabled className="bg-green-900/30 text-green-400 border border-green-800 px-6 py-3 rounded font-bold cursor-default">
                                            ✓ Lecție completată
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LessonPage;