'use client';
import { motion } from "framer-motion";
import { Users, User, Gamepad2, Globe, Zap } from "lucide-react";

interface GameModeSelectProps {
    onSelect: (mode: 'single' | 'multiplayer') => void;
}

export function GameModeSelect({ onSelect }: GameModeSelectProps) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-4xl w-full"
            >
                {/* Logo / Title */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="inline-flex items-center gap-3 mb-6"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center">
                            <Zap className="w-8 h-8 text-black" />
                        </div>
                    </motion.div>
                    <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
                        Topaz-VBE 2.0
                    </h1>
                    <p className="text-xl text-gray-400">
                        Business Simulation Platform
                    </p>
                </div>

                {/* Mode Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Single Player */}
                    <motion.button
                        onClick={() => onSelect('single')}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative bg-white text-black p-8 rounded-3xl text-left transition-all hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)]"
                    >
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                <User className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Single Player</h2>
                                <p className="text-gray-600">Play at your own pace</p>
                            </div>
                        </div>

                        <ul className="space-y-3 text-gray-700 mb-6">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                                Manage one company independently
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                                Execute quarters instantly
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                                Perfect for learning & testing
                            </li>
                        </ul>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                Recommended for beginners
                            </span>
                            <span className="text-2xl">→</span>
                        </div>
                    </motion.button>

                    {/* Multiplayer */}
                    <motion.button
                        onClick={() => onSelect('multiplayer')}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative bg-black text-white p-8 rounded-3xl text-left border-2 border-white/20 transition-all hover:border-white/40 hover:shadow-[0_20px_60px_rgba(255,255,255,0.1)]"
                    >
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7 text-black" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Multiplayer</h2>
                                <p className="text-gray-400">Compete with others</p>
                            </div>
                        </div>

                        <ul className="space-y-3 text-gray-300 mb-6">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                Manage multiple companies
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                Lock-step synchronization
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                Wait for all players to submit
                            </li>
                        </ul>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-500">
                                For competitive play
                            </span>
                            <span className="text-2xl">→</span>
                        </div>
                    </motion.button>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-12 text-gray-500 text-sm"
                >
                    <p>© 2024 Topaz Business Simulation • Version 2.0</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
