import { useEffect } from 'react';

export function LevelUpNotification({ level, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className="fixed top-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="animate-slide-down pointer-events-auto">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl border-4 border-yellow-300 flex items-center gap-4">
                    <span className="text-4xl">🎉</span>
                    <div>
                        <div className="text-sm font-semibold uppercase tracking-wider">Level Up!</div>
                        <div className="text-2xl font-bold">Nivel {level}</div>
                    </div>
                    <span className="text-4xl">🎉</span>
                </div>
            </div>
        </div>
    )
}