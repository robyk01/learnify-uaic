import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

import Split from "react-split";
import ReactMarkdown from "react-markdown"
import { Editor } from "@monaco-editor/react";

import { executeCode } from "../utils/piston";
import confetti from "canvas-confetti";

const ProblemPage = () => {
    const [problem, setProblem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userCode, setUserCode] = useState("")

    const [runResults, setRunResults] = useState([])
    const [isRunning, setIsRunning] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)

    const [submitHistory, setSubmitHistory] = useState([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [selectedSubmission, setSelectedSubmission] = useState(null)

    const [leftTab, setLeftTab] = useState('descriere')

    const {slug} = useParams();

    useEffect(() =>  {
        const getProblem = async () => {
            const {data: problemData, error} = await supabase
            .from('coding_problems')
            .select('*, lessons!inner(*)')
            .eq('lessons.slug', slug)
            .single()

            if (error){
                console.error('Error fetching problem:', error)
                setLoading(false)
                return
            }

            if (problemData){
                setProblem(problemData)
                setUserCode(problemData?.starter_code || "// Scrie rezolvarea aici...")
                loadSubmitHistory(problemData?.lessons?.id)
                setLoading(false)
            }
        }

        getProblem();
    }, [slug])

    const handleTheme = (monaco) => {
        monaco.editor.defineTheme('my-theme', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#020617', 
                'editor.lineHighlightBackground': '#1e293b',
            }
        })
    }

    const loadSubmitHistory = async (lessonId) => {
        setHistoryLoading(true)

        try {
            const {data: authData, error: authError} = await supabase.auth.getUser()
            if (authError || !lessonId || !authData?.user) {
                setSubmitHistory([])
                return
            }

            const {data, error} = await supabase
            .from('submissions')
            .select('id, verdict, passed, total, created_at, language, code')
            .eq('user_id', authData.user.id)
            .eq('lesson_id', lessonId)
            .order('created_at', {ascending: false})
            .limit(10)

            if (error){
                console.error('Error loading submissions:', error)
                setSubmitHistory([])
                return
            }

            setSubmitHistory(data || [])
        } finally {
            setHistoryLoading(false)
        }
    }

    const runCases = async ( {includeHidden} ) => {
        const tests = includeHidden ? (problem?.test_cases || []) : (problem?.test_cases?.filter((t) => t.is_public) || [])

        const results = []

        for (let i = 0; i < tests.length; i++){
            const test = tests[i]

            try {
                const result = await executeCode(problem.language || 'cpp', userCode, test.input);

                if (result?.error){
                    results.push({
                        index: i + 1,
                        ok: false,
                        input: test.input,
                        expected: test.expected_output,
                        got: "",
                        error: String(result.error),
                    })
                    continue;
                }

                const userOutput = result?.run?.output ? result.run.output.trim() : "";
                const expectedOutput = (test.expected_output || "").trim();

                results.push({
                    index: i + 1,
                    ok: expectedOutput === userOutput,
                    input: test.input,
                    expected: test.expected_output,
                    got: userOutput,
                    error: null,
                })

            } catch (err) {
                results.push({
                    index: i + 1,
                    ok: false,
                    input: test.input,
                    expected: test.expected_output,
                    got: "",
                    error: err?.message ? String(err.message): String(err),
                })
            }
        }

        return results
    }

    const handleRun = async () => {
        if (isRunning || isSubmitting) return

        setIsRunning(true)
        setSubmitStatus(null)
        setRunResults([])

        try {
            const results = await runCases({includeHidden: false})
            setRunResults(results)
        } finally {
            setIsRunning(false)
        }
    }

    const handleSubmit = async () => {
        if (isRunning || isSubmitting) return

        setIsSubmitting(true)
        setSubmitStatus(null)
        setRunResults([])

        try {
            const {data: authData, error: authError} = await supabase.auth.getUser()

            if (authError || !authData?.user) {
                setSubmitStatus({ ok: false, message: "Trebuie să fii autentificat ca să trimiți soluția." })
                return
            }

            const results = await runCases({includeHidden: true})
            setRunResults(results)

            const allPassed = results.length > 0 && results.every(r => r.ok)

            const lessonId = problem?.lessons?.id
            if (!lessonId) {
                setSubmitStatus({ ok: false, message: "Lipsește lesson id pentru această problemă." })
                return
            }

            const passed = results.filter(r => r.ok).length
            const total = results.length

            const hasRuntime = results.some(r => !!r.error)
            const verdict = allPassed ? 'accepted'
                            : hasRuntime ? 'runtime_error'
                            : 'wrong_answer'

            const {error: insertSubError} = await supabase
            .from('submissions')
            .insert({
                user_id: authData.user.id,
                lesson_id: lessonId,
                language: problem?.language || 'cpp',
                code: userCode,
                passed,
                total,
                verdict,
            })
            
            if (insertSubError) console.error('Insert submission failed: ', insertSubError)
            await loadSubmitHistory(lessonId)

            if (!allPassed){
                setSubmitStatus({ ok: false, message: "Unele teste au picat. Încearcă din nou."})
                return
            }


            const {data: existingProgress, error: progressFetchError} = await supabase
            .from('user_progress')
            .select('id, is_completed')
            .eq('user_id', authData.user.id)
            .eq('lesson_id', lessonId)
            .maybeSingle()

            if (progressFetchError){
                console.error(progressFetchError)
                setSubmitStatus({ ok: false, message: "Eroare la citirea progresului." })
                return
            }

            const alreadyCompleted = !!existingProgress?.is_completed

            if (!alreadyCompleted){
                const {error: upsertError} = await supabase
                .from('user_progress')
                .upsert({
                    ...(existingProgress?.id ? {id: existingProgress.id} : {}),
                    user_id: authData.user.id,
                    lesson_id: lessonId,
                    is_completed: true,
                    completed_at: new Date().toISOString(),
                }, { onConflict: "user_id,lesson_id" })

                if (upsertError) {
                    console.error(upsertError)
                    setSubmitStatus({ ok: false, message: "Nu am putut salva progresul." })
                    return
                }

                setSubmitStatus({ok: true, message: `Corect! Ai câștigat ${problem?.lessons?.xp_reward ?? 0} XP.` })
                triggerConfetti()
            } else {
                setSubmitStatus({ ok: true, message: "Corect! Toate testele trecute." })
            }

        } finally {
            setIsSubmitting(false)
        }
    }

    const publicTests = problem?.test_cases?.filter(tc => tc.is_public) || [];

    const triggerConfetti = () => {
            confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
            })
        }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        )
    }

    if (!problem) {
        return <div>Problema nu a fost găsită.</div>
    }

    return(
         <div className='h-[93vh] bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden'>

            {/* Header */}
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900 shrink-0">
            
                {/* Left: Title */}
                <div className="flex items-center gap-4">
                    <span className="font-bold text-white text-lg">{problem?.lessons?.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border border-slate-700 bg-slate-800 ${problem?.difficulty === 'Ușor' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {problem?.difficulty}
                    </span>
                </div>

                {/* Right: Run & Submit */}
                <div className="flex gap-3">
                    <button 
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded border border-slate-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleRun}
                        disabled={isRunning || isSubmitting}
                    >
                        {isRunning ? "Rulează.." : "Testează"} 
                    </button>
                    <button 
                        className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded shadow-lg shadow-green-900/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isRunning}
                    >
                        {isSubmitting ? "Se trimite..." : "Trimite"}
                    </button>
                </div>
            </div>

            {submitStatus && (
                <div className={`px-6 py-2 text-sm border-b border-slate-800 
                    ${submitStatus.ok ? "bg-green-950/40 text-green-300" : "bg-red-950/30 text-red-300"}`}>
                        {submitStatus.message}
                    </div>
            )}

            {/* Split screen */}
            <Split
                className="flex-1 flex flex-row overflow-hidden"
                direction="horizontal"
                sizes={[40, 60]}
                minSize={300}
                gutterSize={10}
                snapOffset={30}>
                    
                    {/* Left panel */}
                    <div className="h-full bg-slate-950 flex flex-col overflow-hidden">

                        {/* Tabs */}
                        <div className="shrink-0 border-b border-slate-800 bg-slate-900/40 px-3 py-2">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setLeftTab('descriere')}
                                    className={`px-3 py-1.5 text-sm rounded-md border transition-all
                                        ${leftTab === 'descriere' 
                                            ? 'bg-slate-800 border-slate-700 text-white' 
                                            : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'}
                                        `}
                                    > Descriere 
                                </button>
                                <button
                                    onClick={() => setLeftTab('istoric')}
                                    className={`px-3 py-1.5 text-sm rounded-md border transition-all
                                        ${leftTab === 'istoric' 
                                            ? 'bg-slate-800 border-slate-700 text-white' 
                                            : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'}
                                        `}
                                    > Istoric 
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-slate-950 custom-scrollbar">
                            {leftTab === 'descriere' ? (
                                <>
                                    <div className="prose prose-invert max-w-none pb-10">
                                        <ReactMarkdown>
                                            {problem.description}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Test cases */}
                                    {publicTests.length > 0 && (
                                        <div className="flex flex-col gap-8 pb-10">
                                            <h3 className="text-lg font-bold text-white">Exemple</h3>

                                            {publicTests.map((test, index) => (
                                                <div key={index} className="flex flex-col gap-2">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-xs text-slate-500 font-mono uppercase">Intrare/Input</span>
                                                            <pre className="bg-slate-900 border border-slate-800 text-slate-300 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                                                                {test.input}
                                                            </pre>
                                                        </div>

                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-xs text-slate-500 font-mono uppercase">Ieșire/Output</span>
                                                            <pre className="bg-slate-900 border border-slate-800 text-slate-300 p-3 rounded-lg font-mono text-sm overflow-x-auto">
                                                                {test.expected_output}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-white">Istoric soluții</h3>
                                        <button
                                            onClick={() => loadSubmitHistory(problem?.lessons?.id)}
                                            disabled={historyLoading}
                                            className="px-3 py-1.5 text-xs rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800 disabled:opacity-60"
                                        >
                                            {historyLoading ? "Se încarcă..." : "Reîncarcă"}
                                        </button>
                                    </div>

                                    {selectedSubmission && (
                                        <div className="text-xs text-slate-400">
                                            Ai încărcat soluția din:{" "}
                                            <span className="font-mono">{new Date(selectedSubmission.created_at).toLocaleString()}</span>
                                        </div>
                                    )}

                                    {historyLoading ? (
                                        <div className="text-sm text-slate-400 font-mono">Se încarcă istoricul...</div>
                                    ) : submitHistory.length === 0 ? (
                                        <div className="text-sm text-slate-400">Nu ai soluții încă..</div>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {submitHistory.map((s) => (
                                                <button
                                                    key={s.id} 
                                                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 hover:bg-slate-800/40 hover:border-slate-700 transition-all"
                                                    onClick={() => {
                                                        setSelectedSubmission(s)
                                                        setUserCode(s.code || "")
                                                    }}
                                                    title="Click pentru a încărca soluția în editor">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`text-[11px] font-bold px-2 py-0.5 rounded
                                                                ${s.verdict === 'accepted' 
                                                                ? 'bg-green-900/40 text-green-300'
                                                                : 'bg-red-900/40 text-red-300'}`}>
                                                                    {s.verdict === 'accepted' ? 'CORECT' : 'GREȘIT'}
                                                        </span>

                                                        <span className="text-xs text-slate-300 font-mono">
                                                            {s.passed} / {s.total}
                                                        </span>

                                                        <span className="text-xs text-slate-300 font-mono">
                                                            {s.language}
                                                        </span>
                                                    </div>

                                                    <span className="text-xs text-slate-500 font-mono">
                                                        {new Date(s.created_at).toLocaleString()}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    

                    {/* Right panel */}
                    <div className="h-full bg-slate-900 border-l border-slate-800 overflow-hidden">
                        <Split
                            className="h-full flex flex-col overflow-hidden" 
                            direction="vertical"
                            sizes={[70, 30]} 
                            minSize={100}
                            gutterSize={10}
                        >
                            
                            {/* Editor */}
                            <div className="overflow-hidden flex flex-col h-full ">
                                <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-4 shrink-0">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cod</span>
                                </div>

                                <Editor
                                    height="100%"
                                    theme="my-theme"
                                    language={problem?.language || 'cpp'}
                                    value={userCode}
                                    onChange={(value) => setUserCode(value)}
                                    beforeMount={handleTheme}
                                    options={{
                                        minimap: {enabled: false},
                                        fontSize: 14,
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        padding: {top: 16}
                                    }}
                                />
                            </div>

                            {/* Console */}
                            <div className="flex flex-col min-h-0 border-t border-slate-800 bg-slate-950">

                                <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consolă / Output</span>

                                    {runResults.length > 0 && (
                                        <span className="text-xs font-mono text-slate-400">
                                            {runResults.filter(r => r.ok).length} / {runResults.length}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex-1 p-3 overflow-auto text-sm">
                                    {(isRunning || isSubmitting) && runResults.length === 0 ? (
                                        <div className="flex items-center gap-3 text-slate-300">
                                            <div className="h-4 w-4 rounded-full border-2 border-slate-500 border-t-transparent animate-spin" />
                                            <div className="font-mono text-sm">Se rulează testele..</div>
                                        </div>
                                    ) : runResults.length === 0 ? (
                                        <pre className="font-mono text-slate-300 whitespace-pre-wrap">Rezultatele vor apărea aici</pre>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {runResults.map((r) => (
                                                <div 
                                                className={`rounded-lg border px-3 py-2 
                                                    ${r.ok ?  "border-green-900/60 bg-green-950/40" : "border-red-900/60 bg-red-950/30"}`}
                                                key={r.index}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded
                                                            ${r.ok ? "bg-green-900/40 text-green-300" : "bg-red-900/60 text-red-300"}`}>
                                                                {r.ok ? "CORECT" : "GRESIT"}
                                                            </span>
                                                            <span className="text-slate-200 font-semibold">
                                                                Test #{r.index}
                                                            </span>
                                                        </div>

                                                        {r.error && (
                                                            <span className="text-xs text-red-300 font-mono">
                                                                EROARE
                                                            </span>
                                                        )}
                                                    </div>

                                                    {!r.ok && (
                                                        <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-2 font-mono text-xs">
                                                            <div className="rounded border border-slate-800 bg-slate-900/60 p-2">
                                                                <div className="text-slate-500 mb-1">Rezultat așteptat:</div>
                                                                <pre className="whitespace-pre-wrap text-slate-200">
                                                                    {String(r.expected ?? "").trim()}
                                                                </pre>
                                                            </div>
                                                            <div className="rounded border border-slate-800 bg-slate-900/60 p-2">
                                                                <div className="text-slate-500 mb-1">Rezultat primit:</div>
                                                                <pre className="whitespace-pre-wrap text-slate-200">
                                                                    {String(r.got ?? "").trim()}
                                                                </pre>
                                                            </div>

                                                            {r.error && (
                                                                <div className="lg:col-span-2 rounded border border-slate-800 bg-slate-900/60 p-2">
                                                                    <div className="text-slate-500 mb-1">Eroare</div>
                                                                    <pre className="whitespace-pre-wrap text-red-200">
                                                                        {r.error}
                                                                    </pre>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </Split>
                    </div>
            </Split>

        </div>
    );
}

export default ProblemPage