import { useState } from "react";
import confetti from "canvas-confetti";

export function Quiz({questions, onComplete}) {
    const [currIndex, setCurrIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null)
    const [isChecking, setIsChecking] = useState(false)
    const [score, setScore] = useState(0)

    if (!questions || questions.length === 0 ) return <div>Nu sunt întrebări.</div>

    const currQuestion = questions[currIndex]

    const handleOptionClick = (option) => {
        if (isChecking) return

        setSelectedOption(option)
    }

    const handleMainButton = () => {
        if (!isChecking){
            if (!selectedOption) return

            setIsChecking(true)

            if (selectedOption.is_correct){
                setScore(prevScore => prevScore + 1)
            }
            return;
        }

        const nextIndex = currIndex + 1
        if (nextIndex < questions.length){
            setCurrIndex(nextIndex)
            setSelectedOption(null)
            setIsChecking(false)
        } else {
            onComplete(score)
        }
    }

    const getOptionClasses = (option) => {
        let base = "w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 flex justify-between items-center group "

        if (isChecking){
            if (option.is_correct){
                return base + "border-green-500 bg-green-500/10 text-green-400"
            }
            if (selectedOption?.id === option.id && !option.is_correct){
                return base + "border-red-500 bg-red-500/10 text-red-400"
            }
            return base + "border-slate-800 text-slate-500 opacity-50"
        }

        if (selectedOption?.id === option.id){
            return base + "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-[1.02]"
        }

        return base + "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:bg-slate-900"
    }

    const progress = ((currIndex + 1) / questions.length) * 100;

    return(
        <div className="max-w-2xl mx-auto">
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
                <h2 className="text-2xl md-text-3xl font-bold text-white mb-8 leading-tight">{currQuestion.question}</h2>

                <div className="space-y-3">
                    {currQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className={getOptionClasses(option)}>

                        <span>{option.text}</span>

                        {isChecking && option.is_correct && (
                            <span className="text-green-500 text-xl">✓</span>
                        )}
                        {isChecking && selectedOption?.id === option.id && !option.is_correct && (
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
                    disabled={!selectedOption && !isChecking}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${
                        !selectedOption && !isChecking ? 
                        "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : isChecking
                            ? "bg-white text-slate-900 hover:bg-slate-200 shadow-lg shadow-white/20"
                            : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                        }`}>
                            {isChecking
                            ? (currIndex + 1 < questions.length ? "Următoarea întrebare →" : "Vezi rezultat final")
                            : "Verifică răspunsul"}
                </button>
            </div>
        </div>
    );

}