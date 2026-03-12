import { supabase } from "../supabaseClient";
import { createContext } from "react";
import { useState, useEffect } from "react";
export const SubjectContext = createContext();

export const SubjectProvider = ({ children }) => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(false);

    const imgUrls = [
        "/so_bg.png", "/pa_bg.png", "/oop_bg.png"
    ];

    useEffect(() => {
        const fetchSubjects = async () => {
            const { data, error } = await supabase
                .from('subjects')
                .select('id, title, shortname')
                .eq('is_active', true);
            
            console.log("Error:", error);

            const subjectsWithGradients = data?.map((subject, index) => ({
                ...subject,
                imgUrl: imgUrls[index]
            })) || [];
            
            setSubjects(subjectsWithGradients);
        };

        fetchSubjects();
    }, [])

    useEffect(() => {
        if (!selectedSubject) return;

        const fetchChapters = async () => {
            const { data: chaptersData, error } = await supabase
                .from('chapters')
                .select('id, title, slug, order_index')
                .eq('subject_id', selectedSubject.id)
                .eq('hidden', false)
                .order('order_index', { ascending: true });

            if (error) console.error("Error fetching chapters:", error);
            setChapters(chaptersData || []);
            setLoading(false)
        };

        fetchChapters();
    }, [selectedSubject])

    const closeSubject = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedSubject(null);
            setIsClosing(false);
        }, 200);
    };

    const handleSubjectClick = (subject) => {
        if (selectedSubject?.id === subject.id) {
            closeSubject();
        } else {
            setLoading(true);
            setSelectedSubject(subject);
        }
    };

    return (
        <SubjectContext.Provider
            value={{
                subjects,
                chapters,
                selectedSubject,
                setSelectedSubject,
                isClosing,
                setIsClosing,
                closeSubject,
                handleSubjectClick,
                loading,
            }}>
            {children}
        </SubjectContext.Provider>
    );
};