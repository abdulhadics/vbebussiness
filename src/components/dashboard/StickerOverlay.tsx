'use client';
import { useGameStore } from "@/store/game-store";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Rocket, Moon, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function StickerOverlay() {
    const { gameState } = useGameStore();
    const history = gameState.history;
    const [sticker, setSticker] = useState<{ icon: any, text: string, color: string } | null>(null);

    // Logic to satisfy the prompt's "Visualizing the Logic" requirements
    useEffect(() => {
        if (history.length === 0) return;

        const currentQ = history[history.length - 1]; // Result just finished
        const prevQ = history.length > 1 ? history[history.length - 2] : null;

        let newSticker = null;

        // 1. Crisis: Cash < 0
        if (currentQ.cashAtEnd < 0) {
            newSticker = { icon: AlertTriangle, text: "Overdraft Alert! Cash is Negative!", color: "text-red-500" };
        }
        // 2. Growth: SharePrice > prevQ * 1.1 (10% growth)
        else if (prevQ && currentQ.stockPrice > prevQ.stockPrice * 1.1) {
            newSticker = { icon: Rocket, text: "To The Moon! +10% Stock Growth", color: "text-green-400" };
        }
        // 3. Stagnation: Profit is flat (within 2%)
        else if (prevQ && Math.abs(currentQ.profit - prevQ.profit) < (prevQ.profit * 0.02)) {
            newSticker = { icon: Moon, text: "Business is Stagnant... Zzz...", color: "text-blue-300" };
        }

        setSticker(newSticker);

        // Auto hide after 5 seconds
        const timer = setTimeout(() => setSticker(null), 5000);
        return () => clearTimeout(timer);

    }, [gameState.currentQuarter, history]); // Run when quarter changes

    return (
        <AnimatePresence>
            {sticker && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="fixed bottom-10 right-10 z-50 flex flex-col items-center pointer-events-none"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`bg-black/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 ${sticker.color}`}
                    >
                        <sticker.icon size={48} className="drop-shadow-lg" />
                        <div className="max-w-[150px]">
                            <p className="font-bold text-lg leading-tight text-white">{sticker.text}</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
