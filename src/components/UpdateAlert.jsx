import { useState, useEffect } from 'react';
import { FaTimes, FaGraduationCap, FaUserEdit, FaClipboardCheck } from 'react-icons/fa';

export default function UpdateAlert() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const lastDismissed = localStorage.getItem('update_alert_dismissed');
        const updateVersion = '2026-01-25'; 
        
        if (lastDismissed !== updateVersion) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('update_alert_dismissed', '2026-01-25');
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/75 glass-bg z-40"
                onClick={handleDismiss}
            ></div>

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/30 rounded-2xl max-w-4xl w-full relative animate-scale-in shadow-2xl overflow-hidden">

                    <div className="relative z-10 flex flex-col md:flex-row">
                        {/* Left */}
                        <div className="flex-1 p-6 md:p-8">

                            <button 
                                onClick={handleDismiss}
                                className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors z-20">
                                <FaTimes className="text-xl" />
                            </button>

                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-3xl font-bold text-white mb-1">Actualizare</h2>
                                <p className="text-slate-400 text-sm">25 Ianuarie 2026</p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex gap-3">
                                    <FaClipboardCheck className="text-blue-400 text-xl mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Simulare sesiune 2026</h3>
                                        <p className="text-slate-400 text-sm">
                                            Exersează cu 10 întrebări aleatorii din examene anterioare.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <FaGraduationCap className="text-blue-400 text-xl mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Capitol arbori digitali (Tries)</h3>
                                        <p className="text-slate-400 text-sm">
                                            Ultimul capitol al semestrului este acum disponibil, cu teorie și exerciții.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <FaUserEdit className="text-blue-400 text-xl mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Editare username</h3>
                                        <p className="text-slate-400 text-sm">
                                            Poți schimba numele de utilizator din pagina de profil.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-lg p-4 mb-6">
                                <p className="text-blue-200 text-sm text-center">
                                    <span className="font-semibold">În curând:</span> În semestrul 2, vom adăuga cursuri noi!
                                </p>
                            </div>

                            <button 
                                onClick={handleDismiss}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-blue-500/20">
                                Am înțeles
                            </button>
                        </div>

                        {/* Image */}
                        <div className="hidden md:flex md:w-96 bg-blue-500 items-center justify-center p-8 relative">
                                <img src='/update-graphic.png' className="w-full h-auto transform scale-125"></img>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </>
    );
}