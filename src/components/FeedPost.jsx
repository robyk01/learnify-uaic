import { useState } from "react";

export default function FeedPost( {post} ){
    const [isExpanded, setIsExpanded] = useState(false)
    return(
        <div className="flex flex-col border border-slate-700/50 bg-gradient-to-br from-slate-800/20 to-slate-900/20 backdrop-blur-md p-6 rounded-xl gap-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white text-xs font-bold">
                    {post.short}
                </div>
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{post.subject}</span>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-slate-700 via-slate-600 to-transparent"></div>

            <div className="flex flex-col text-left gap-3 overflow-hidden">
                <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">
                    {post.title}
                </h3>
                <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-16 opacity-75'}`}>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {post.text}
                    </p>
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    {isExpanded ? 'Arată mai puțin' : 'Citește mai mult'}
                </button>
            </div>
        </div>
    );
}