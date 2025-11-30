import { useEffect, useState } from "react";

export function TableOfContents( {headings} ){
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver (
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting){
                        setActiveId(entry.target.id)
                    }
                });
            },
            { rootMargin: "-100px 0px -80% 0px" }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings])

    if (headings.length === 0) return null;

    return(
        <nav className="sticky top-24 w-64 bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-2xl shadow-blue-900/20 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Cuprins
                </p>
            </div>

            <ul className="space-y-1 relative">
                <div className="absolute left-[10px] top-2 bottom-2 w-[2px] bg-slate-800 rounded-full"></div>
                {headings.map((heading) => (
                    <li key={heading.id} className="relative">
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveId(heading.id);
                                document.getElementById(heading.id)?.scrollIntoView({
                                    behavior: "smooth"
                                });
                            }}
                            className={`
                                block py-2 pr-2 text-sm transition-all duration-300
                                ${heading.level === 3 ? "pl-8" : "pl-6 font-bold text-white"} 
                                ${activeId === heading.id 
                                    ? "text-blue-400" 
                                    : "text-slate-400 hover:text-slate-300" 
                                }
                            `}
                        >
                            <span 
                                className={`absolute left-[7px] top-1/2 -translate-y-1/2 transition-all duration-300 rounded-full border-2 
                                ${activeId === heading.id 
                                    ? "w-3 h-3 bg-blue-500 border-blue-400 shadow-[0_0_10px_#3b82f6] left-[5px]" 
                                    : "w-2 h-2 bg-slate-900 border-slate-600"
                                }`}
                            />
                            
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}