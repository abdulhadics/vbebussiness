'use client';
import { useGameStore, AVAILABLE_COMPANIES } from "@/store/game-store";
import { motion } from "framer-motion";
import { Clock, Check, Users } from "lucide-react";

export function WaitingOverlay() {
    const isWaitingForOthers = useGameStore((state) => state.isWaitingForOthers);
    const waitingMessage = useGameStore((state) => state.waitingMessage);
    const companyStatuses = useGameStore((state) => state.companyStatuses);
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);

    if (!isWaitingForOthers) return null;

    // Calculate waiting stats
    const companies = AVAILABLE_COMPANIES.filter(c => companyStatuses[c.id] !== undefined);
    const submittedCount = companies.filter(c => companyStatuses[c.id] === 'SUBMITTED').length;
    const totalCount = companies.length;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="glass-panel rounded-2xl p-8 max-w-lg w-full mx-4 text-center"
            >
                {/* Animated Clock */}
                <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-violet-500/20 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                >
                    <Clock size={40} className="text-violet-400" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-2">Waiting for Other Players</h2>
                <p className="text-slate-400 mb-6">{waitingMessage || 'Your decisions have been submitted. Waiting for all companies to finish...'}</p>

                {/* Progress Indicator */}
                <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Users size={18} className="text-slate-400" />
                        <span className="text-slate-400">
                            <span className="text-emerald-400 font-bold">{submittedCount}</span> of <span className="font-bold text-white">{totalCount}</span> companies ready
                        </span>
                    </div>

                    {/* Company Status List */}
                    <div className="space-y-2">
                        {companies.map(company => {
                            const status = companyStatuses[company.id];
                            const isActive = company.id === activeCompanyId;

                            return (
                                <div
                                    key={company.id}
                                    className={`flex items-center justify-between px-4 py-2 rounded-lg ${isActive ? 'bg-slate-700/50' : 'bg-slate-800/30'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: company.color }}
                                        />
                                        <span className={isActive ? 'text-white font-bold' : 'text-slate-400'}>
                                            {company.name}
                                            {isActive && <span className="text-xs text-slate-500 ml-2">(You)</span>}
                                        </span>
                                    </div>

                                    {status === 'SUBMITTED' ? (
                                        <div className="flex items-center gap-1 text-emerald-400 text-sm">
                                            <Check size={14} />
                                            <span>Ready</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                                            <Clock size={14} />
                                            <span>Pending</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pulsing Dots */}
                <div className="flex justify-center gap-2">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-violet-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
