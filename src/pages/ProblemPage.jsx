import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

import Split from "react-split";
import ReactMarkdown from "react-markdown"
import { Editor } from "@monaco-editor/react";

import { executeCode } from "../utils/pistol";

const ProblemPage = () => {
    const [problem, setProblem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userCode, setUserCode] = useState("")

    const [consoleOutput, setConsoleOutput] = useState("// Aici va apărea rezultatul...")

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
                'editor.background': '#0f172a', 
                'editor.lineHighlightBackground': '#1e293b',
            }
        })
    }

    const handleRun = async () => {
        setConsoleOutput("Se compilează și se rulează testele...\n----------------------------------");

        const testInput = problem?.test_cases?.filter(t => t.is_public);
        let report = "";
        let allPassed = true;

        for (let i = 0; i < testInput.length; i++){
            const test = testInput[i];

            try {
                const result = await executeCode(problem.language, userCode, test.input);

                if (result.error){
                    report += `\nTest ${i + 1}: EROARE API (${result.error})`;
                    allPassed = false;
                    continue;
                }

                const userOutput = result.run.output ? result.run.output.trim() : "";
                const expectedOutput = test.expected_output.trim();

                if (userOutput == expectedOutput){
                    report += `\nTest ${i + 1}:  Trecut.`;
                } else {
                    allPassed = false;
                    report += `\nTest ${i + 1}: Greșit`;
                    report += `\n   Input:    ${test.input.replace(/\n/g, ' ')}`;
                    report += `\n   Așteptat: ${expectedOutput}`;
                    report += `\n   Primit:   ${userOutput}\n`;
                }
            } catch (err) {
                report += `\nTest ${i + 1}: Eroare: (${err.message})`;
                allPassed = false;
            }
        }

        report += "\n----------------------------------";
        if (allPassed) {
            report += "\n🎉 Felicitări! Toate testele publice au trecut.";
        } else {
            report += "\nUnele teste au picat. Corectează codul.";
        }

        setConsoleOutput(report)
    }

    const publicTests = problem?.test_cases?.filter(tc => tc.is_public) || [];

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
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded border border-slate-700 transition-all"
                        onClick={handleRun}
                    >
                        Testează 
                    </button>
                    <button 
                        className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded shadow-lg shadow-green-900/20 transition-all active:scale-95"
                    >
                        Trimite
                    </button>
                </div>
            </div>


            {/* Split screen */}
            <Split
                className="flex-1 flex flex-row overflow-hidden"
                direction="horizontal"
                sizes={[40, 60]}
                minSize={300}
                gutterSize={10}
                snapOffset={30}>
                    
                    {/* Left panel */}
                    <div className="overflow-y-auto h-full p-6 bg-slate-950 custom-scrollbar">
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
                            <div className="flex flex-col min-h-0 border-t border-slate-800 bg-slate-900">

                                <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-4">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consolă / Output</span>
                                </div>
                                

                                <div className="flex-1 p-4 overflow-auto font-mono text-sm text-slate-300">
                                    <pre>{consoleOutput}</pre>
                                </div>
                            </div>

                        </Split>
                    </div>
            </Split>

        </div>
    );
}

export default ProblemPage