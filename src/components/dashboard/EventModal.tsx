'use client';
import { useGameStore } from "@/store/game-store";
import { motion } from "framer-motion";
import { AlertTriangle, X, Zap, Trophy, TrendingDown } from "lucide-react";

export function EventModal() {
    const { showEventModal, setShowEventModal, gameState } = useGameStore();
    const event = gameState.lastEvent;

    if (!showEventModal || !event) return null;

    let Icon = Zap;
    let colorClass = "text-blue-500";
    let bgClass = "bg-blue-500/10";
    let borderClass = "border-blue-500/50";

    if (event.impactType === 'negative') {
        Icon = TrendingDown;
        colorClass = "text-red-500";
        bgClass = "bg-red-500/10";
        borderClass = "border-red-500/50";
    } else if (event.impactType === 'positive') {
        Icon = Trophy;
        colorClass = "text-yellow-500";
        bgClass = "bg-yellow-500/10";
        borderClass = "border-yellow-500/50";
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`bg-[#0f0f13] border ${borderClass} rounded-2xl p-8 max-w-md w-full relative shadow-2xl`}
            >
                <button
                    onClick={() => setShowEventModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 ${bgClass} rounded-full mb-2`}>
                        <Icon size={48} className={colorClass} />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">{event.title}</h2>
                    <p className="text-gray-300 leading-relaxed">{event.description}</p>

                    <button
                        onClick={() => setShowEventModal(false)}
                        className="mt-6 px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-sm rounded hover:bg-gray-200 w-full transition-colors"
                    >
                        Acknowledge
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
