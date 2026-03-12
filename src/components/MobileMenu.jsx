import { useContext, useState } from "react";
import { SubjectContext } from "./SubjectContext";
import { NavLink } from "react-router-dom";

export default function MobileMenu( {onClose} ){
    const { subjects, chapters, selectedSubject, setSelectedSubject, handleSubjectClick } = useContext(SubjectContext)

    return(
        <div className="fixed inset-0 m-4 bg-slate-950/80 glass-nav flex flex-col">

            {/* Tabs */}
            <div className="flex border-b border-slate-800 flex-shrink-0 rounded-tl-xl rounded-tr-xl overflow-hidden">
                {subjects.map((subject) => (
                    <button key={subject.id}
                    onClick={() => handleSubjectClick(subject)}
                            className="flex-1 flex flex-col items-center gap-1 py-4 text-xs font-semibold transition-all"
                            style={
                                selectedSubject?.id === subject.id
                                    ? { backgroundImage: `url(${subject.imgUrl})`, backgroundPosition: 'center' }
                                    : {}
                            }>
                        {subject.shortname}
                    </button>
                ))}
            </div>

            {/* Chapters */}
            <div className="flex-1 overflow-y-auto p-4">
                {!selectedSubject ? (
                    <p className="text-slate-500 text-sm text-center mt-8">Selectează o materie</p>
                ) : (
                    <div className="space-y-2">
                        {chapters.map((chapter) => (
                            <NavLink
                                key={chapter.id}
                                to={`/capitol/${chapter.slug}`}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `block w-full p-3 rounded-lg text-sm font-semibold transition ${
                                        isActive
                                            ? "bg-blue-500/20 text-blue-300 border-l-2 border-blue-500"
                                            : "text-slate-200 hover:bg-slate-800/50"
                                    }`}>
                                    {chapter.title}
                                </NavLink>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}