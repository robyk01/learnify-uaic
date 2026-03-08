import { createContext } from "react";
import { useState } from "react";
export const SubjectContext = createContext();

export const SubjectProvider = ({ children }) => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    const closeSubject = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedSubject(null);
            setIsClosing(false);
        }, 200);
    };

    return (
        <SubjectContext.Provider value={{ selectedSubject, setSelectedSubject, isClosing, setIsClosing, closeSubject }}>
            {children}
        </SubjectContext.Provider>
    );
};