import { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown'

export function Quiz({lesson, parent, onComplete}) {
    const [currIndex, setCurrIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null)
    const [selectedOptions, setSelectedOptions] = useState([])
    const [score, setScore] = useState(0)
    
    const [isChecking, setIsChecking] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    const questions = lesson.quiz_questions;

    if (!questions || questions.length === 0 ) return <div>Nu sunt întrebări.</div>

    const currQuestion = questions[currIndex]

    const max_selections = Number(currQuestion?.max_selections || 1)
    const isMulti = max_selections > 1

    const optionKey = (o) => o.id;
    const isSelected = (option) => (
        isMulti 
            ? selectedOptions.some(o => optionKey(o) === optionKey(option))
            : selectedOption && optionKey(selectedOption) === optionKey(option)
    )

    const handleOptionClick = (option) => {
        if (isChecking) return

        if (!isMulti){
            setSelectedOption(option)
            return
        }

        setSelectedOptions(prev => {
            const exists = prev.some(o => optionKey(o) === optionKey(option))

            if (exists) return prev.filter(o => optionKey(o) !== optionKey(option))

            return [...prev, option]
        })
    }

    const handleMainButton = () => {
        if (!isChecking){
            if (!isMulti){
                if (!selectedOption) return
            } else {
                if (!selectedOptions || selectedOptions.length === 0)
                    return
            }

            setIsChecking(true)

            if (!isMulti){
                if (selectedOption?.is_correct){
                    setScore(prevScore => prevScore + 1)
                }
            } else {
                const correctKeys = new Set(
                    currQuestion.options.filter(o => o.is_correct).map(optionKey)
                )
                const selectedKeys = new Set(selectedOptions.map(optionKey))

                const allCorrectChosen = 
                    correctKeys.size === selectedKeys.size &&
                    [...correctKeys].every(k => selectedKeys.has(k))

                if (allCorrectChosen){
                    setScore(prevScore => prevScore + 1)
                }
            }

            return
        }

        const nextIndex = currIndex + 1
        if (nextIndex < questions.length){
            setCurrIndex(nextIndex)
            setSelectedOption(null)
            setSelectedOptions([])
            setIsChecking(false)
        } else {
            let add = 0
            if (!isMulti){
                add = selectedOption?.is_correct ? 1 : 0
            } else {
                const correctKeys = new Set(
                    currQuestion.options.filter(o => o.is_correct).map(optionKey)
                )
                const selectedKeys = new Set(selectedOptions.map(optionKey))

                const allCorrectChosen =
                    correctKeys.size === selectedKeys.size &&
                    [...correctKeys].every(k => selectedKeys.has(k))

                add = allCorrectChosen ? 1 : 0
            }

            setIsFinished(true)
            if (!isCompleted) setIsCompleted(true)
            onComplete(score + add)
        }
    }

    const getOptionClasses = (option) => {
        let base = "w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 flex justify-between items-center group "

        if (isChecking){
            if (option.is_correct){
                return base + "border-green-500 bg-green-500/10 text-green-400"
            }
            if (isSelected(option) && !option.is_correct){
                return base + "border-red-500 bg-red-500/10 text-red-400"
            }
            return base + "border-slate-800 text-slate-500 opacity-50"
        }

        if (isSelected(option)){
            return base + "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-[1.02]"
        }

        return base + "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:bg-slate-900"
    }

    const progress = ((currIndex + 1) / questions.length) * 100;

    const mainDisabled = !isChecking && (!isMulti ? !selectedOption : selectedOptions.length === 0)

    return(
        <div className="max-w-2xl mx-auto">
            {isFinished ? (
                <div className="relative max-w-full bg-slate-900/80 border border-slate-700/50 shadow-[0_15px_40px] shadow-blue-950/50 rounded-2xl p-10 text-center overflow-hidden">

                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-300/20 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 mb-8">
                        {score >= questions.length / 2 
                        ? (<h2 className="text-3xl font-bold text-white">Felicitări! 🎉</h2>)
                        : (<h2 className="text-3xl font-bold text-white">Mai încearcă.. </h2>)
                        }
                        
                    </div>

                    <div className="mb-8">
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-8xl font-black bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent drop-shadow-2xl">{score}</span>
                            <span className="text-3xl text-slate-500 font-bold">/{questions.length}</span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium tracking-wide mt-2">Răspunsuri corecte</p>
                    </div>

                    {!isCompleted && (
                        <div className="mb-10 flex justify-center">
                            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                <span className="text-xl">✨</span>
                                <span className="text-blue-300 font-bold font-mono text-lg">
                                    +{10} XP
                                </span>
                            </div>
                        </div>
                    )}
                    

                    <div className="w-full flex justify-center">
                        <Link to={`/modul/${parent.slug}`} className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 bg-white text-slate-900 hover:bg-slate-200">
                            Înapoi la lecții
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mb-8">
                        <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                            <span>Progres</span>
                            <span>Intrebarea {currIndex + 1} din {questions.length}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full transition-all duration-500 ease-out shadow-[0_0_10px_#2563eb]" style={{ width: `${progress}%` }}>
                            </div>
                        </div>
                    </div>
                    <div className="animate-fade-in">
                        <div className="font-bold text-white mb-8 leading-tight prose prose-invert max-w-none">
                            <ReactMarkdown components={{
                                img: ({node, ...props}) => <img style={{maxWidth: '100%'}} {...props} className="rounded-lg mt-4 shadow-lg border border-slate-700" />
                            }}>
                                {currQuestion.question}
                            </ReactMarkdown>
                        </div>

                        <div className="mb-4 text-xs text-slate-400 font-mono">
                            {isMulti ? "Mai multe opțiuni corecte" : "O singură opțiune corectă"}
                        </div>

                        <div className="space-y-3">
                            {currQuestion.options.map((option, index) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionClick(option)}
                                    className={getOptionClasses(option)}>

                                <span>{option.text}</span>

                                {isChecking && option.is_correct && (
                                    <span className="text-green-500 text-xl">✓</span>
                                )}
                                {isChecking && isSelected(option) && !option.is_correct && (
                                    <span className="text-red-500 text-xl">✕</span>
                                )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800">
                        {isChecking && currQuestion.explanation && (
                            <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-slate-300 text-sm leading-relaxed flex gap-3 items-center">
                                <span className="text-xl">💡</span>
                                <div>
                                    <strong className="text-white block mb-1">Explicație:</strong>
                                    {currQuestion.explanation}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleMainButton}
                            disabled={mainDisabled}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${
                                mainDisabled 
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                : isChecking
                                    ? "bg-white text-slate-900 hover:bg-slate-200 shadow-lg shadow-white/20"
                                    : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                                }`}>
                                    {isChecking
                                    ? (currIndex + 1 < questions.length ? "Următoarea întrebare →" : "Vezi rezultat final")
                                    : "Verifică răspunsul"}
                        </button>
                    </div>
                </>
            )}
            
        </div>
    );

}