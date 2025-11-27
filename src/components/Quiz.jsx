import { useState } from "react";
import confetti from "canvas-confetti";

function Quiz({questions, onComplete}) {
    const [currIndex, setCurrIndex] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null)
    const [isChecking, setIsChecking] = useState(false)
    const [score, setScore] = useState(null)

    const currQuestion = questions[currIndex]

    const handleOptionClick = (option) => {
        if (isChecking) return

        setSelectedOption(option)
    }

    const handleMainButton = () => {
        if (!isChecking){
            setIsChecking(true)

            if (selectedOption.is_correct){
                score = score + 1
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

    return(
        <div className="">
            <div className="">
                <div className="">
                    Progres
                </div>
            </div>

            <h2>{currQuestion.question}</h2>
            <div className="">
                {currQuestion.options.map((option, index) => {
                    return(
                        <button>{option.text}</button>
                    )
                })}
            </div>

            <div className="">
                {isChecking && currQuestion.explanation && (
                    <div className="">
                        <strong>Explicatie: </strong> {currQuestion.explanation}
                    </div>
                )}

                <button>Next</button>
            </div>
        </div>
    );

}