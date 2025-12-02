import { useState } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useLocation } from 'react-router-dom';

export function FeedbackBtn() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("idle"); 
    
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setStatus("sending");

        const { data: { session } } = await supabase.auth.getSession();

        const { error } = await supabase
            .from('feedback')
            .insert({
                message: message,
                user_id: session?.user?.id || null,
                page_url: location.pathname
            });

        if (!error) {
            setStatus("success");
            setMessage("");
            setTimeout(() => {
                setIsOpen(false);
                setStatus("idle");
            }, 2000);
        } else {
            setStatus("error");
        }
    };

    return (
        <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end md:bottom-8 md:right-8">
            
            {isOpen && (
                <div className="mb-4 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-5 fade-in duration-200">
                    
                    {status === "success" ? (
                        <div className="text-center py-6">
                            <div className="mx-auto w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-3">
                                <Send className="w-6 h-6" />
                            </div>
                            <p className="text-white font-bold">Trimis!</p>
                            <p className="text-slate-400 text-xs">Mersi pentru feedback.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-white font-bold text-sm">Ai găsit o greșeală sau ai vreo sugestie?</h3>
                                <button 
                                    type="button" 
                                    onClick={() => setIsOpen(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <textarea
                                className="w-full h-24 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none mb-3"
                                placeholder="Spune-mi ce nu merge..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                autoFocus
                            />

                            <button
                                type="submit"
                                disabled={status === "sending" || !message.trim()}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Trimite"}
                            </button>
                        </form>
                    )}
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-3 md:p-4 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center
                    ${isOpen ? "bg-slate-700 text-white rotate-90" : "bg-blue-600 text-white shadow-blue-600/30"}
                `}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>

        </div>
    );
}