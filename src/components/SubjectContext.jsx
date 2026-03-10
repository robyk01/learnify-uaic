import { createContext } from "react";
import { useState } from "react";
export const SubjectContext = createContext();

export const SubjectProvider = ({ children }) => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const [navOpen, setNavOpen] = useState(false);

    const closeSubject = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedSubject(null);
            setIsClosing(false);
            setNavOpen(false);
        }, 200);
    };

    const handleSubjectClick = (subject) => {
        if (selectedSubject?.id === subject.id) {
            closeSubject();
        } else {
            setSelectedSubject(subject);
            setNavOpen(true);
        }
    };

    return (
        <SubjectContext.Provider value={{ selectedSubject, setSelectedSubject, isClosing, setIsClosing, closeSubject, handleSubjectClick, navOpen, setNavOpen }}>
            {children}
        </SubjectContext.Provider>
    );
};