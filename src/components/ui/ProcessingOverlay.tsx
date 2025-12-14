'use client';
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Zap, TrendingUp } from "lucide-react";

interface ProcessingOverlayProps {
    isProcessing: boolean;
    phase?: 'processing' | 'complete';
    onComplete?: () => void;
}

export function ProcessingOverlay({
    isProcessing,
    phase = 'processing',
    onComplete
}: ProcessingOverlayProps) {

    return (
        <AnimatePresence>
            {isProcessing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center"
                >
                    {/* Background with warp effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
                        {/* Stars / Particles */}
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(50)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 2 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Radial gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-950 opacity-80" />
                    </div>

                    {/* Center Content */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        {phase === 'processing' ? (
                            <>
                                {/* Spinning Ring */}
                                <div className="relative w-40 h-40 mb-8">
                                    {/* Outer ring */}
                                    <motion.div
                                        className="absolute inset-0 border-4 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />

                                    {/* Middle ring */}
                                    <motion.div
                                        className="absolute inset-4 border-4 border-transparent border-b-emerald-500 border-l-teal-500 rounded-full"
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />

                                    {/* Center icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.5)]"
                                        >
                                            <Zap className="w-8 h-8 text-white" />
                                        </motion.div>
                                    </div>
                                </div>

                                <motion.h2
                                    className="text-3xl font-bold text-white mb-2"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    Processing Quarter...
                                </motion.h2>

                                <p className="text-slate-400 text-center max-w-sm">
                                    Running simulation engine, calculating market dynamics,
                                    and updating financial statements.
                                </p>

                                {/* Progress dots */}
                                <div className="flex gap-2 mt-6">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-indigo-500"
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{
                                                duration: 0.8,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Complete State */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 10 }}
                                    className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(16,185,129,0.5)]"
                                >
                                    <TrendingUp className="w-12 h-12 text-white" />
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl font-bold text-white mb-2"
                                >
                                    Quarter Complete!
                                </motion.h2>

                                {onComplete && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        onClick={onComplete}
                                        className="mt-6 px-8 py-3 rounded-full bg-white text-slate-900 font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all"
                                    >
                                        View Results
                                    </motion.button>
                                )}
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
