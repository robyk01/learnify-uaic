import { createContext, useState } from 'react';

export const SubjectContext = createContext();

export const SubjectProvider = ({ children }) => {
    const [selectedSubject, setSelectedSubject] = useState(null);

    return (
        <SubjectContext.Provider value={{ selectedSubject, setSelectedSubject }}>
            {children}
        </SubjectContext.Provider>
    );
};