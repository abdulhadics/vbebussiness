'use client';
import { useGameStore, AVAILABLE_COMPANIES, CompanyStatus } from "@/store/game-store";
import { motion } from "framer-motion";
import { Check, Clock, Lock, Building2, Sparkles } from "lucide-react";

export function CompanySwitcher() {
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);
    const companyStatuses = useGameStore((state) => state.companyStatuses);
    const companyStates = useGameStore((state) => state.companyStates);
    const switchCompany = useGameStore((state) => state.switchCompany);

    const activeCompanies = AVAILABLE_COMPANIES.filter(c => companyStatuses[c.id] !== undefined);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 mb-6"
        >
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Building2 size={16} className="text-indigo-400" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Company</span>
            </div>

            <div className="flex gap-3 flex-wrap">
                {activeCompanies.map((company, index) => {
                    const isActive = company.id === activeCompanyId;
                    const status = companyStatuses[company.id];
                    const gameState = companyStates[company.id];

                    return (
                        <motion.button
                            key={company.id}
                            onClick={() => switchCompany(company.id)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className={`
                                relative flex items-center gap-4 
                                px-5 py-3.5
                                rounded-2xl 
                                font-bold text-sm 
                                transition-all duration-300
                                ${isActive
                                    ? 'bg-white/10 text-white shadow-lg'
                                    : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50 hover:text-white border border-white/5'
                                }
                            `}
                            style={isActive ? {
                                border: `2px solid ${company.color}`,
                                boxShadow: `0 10px 40px ${company.color}30`
                            } : {}}
                        >
                            {/* Company Color Dot */}
                            <motion.div
                                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: company.color,
                                    boxShadow: isActive ? `0 0 10px ${company.color}` : undefined
                                }}
                            />

                            {/* Company Name */}
                            <span className="font-bold">{company.name}</span>

                            {/* Quarter Badge */}
                            {gameState && (
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full">
                                    Q{gameState.market.quarter}
                                </span>
                            )}

                            {/* Status Badge */}
                            <StatusBadge status={status} />

                            {/* Active Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeCompany"
                                    className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                                    style={{ borderColor: `${company.color}50` }}
                                    transition={{ type: "spring", duration: 0.5 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-4 px-2 text-[10px] text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center">
                        <Clock size={10} className="text-slate-400" />
                    </div>
                    <span>Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check size={10} className="text-emerald-400" />
                    </div>
                    <span>Submitted</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Lock size={10} className="text-amber-400" />
                    </div>
                    <span>Locked</span>
                </div>
            </div>
        </motion.div>
    );
}

function StatusBadge({ status }: { status: CompanyStatus }) {
    if (status === 'SUBMITTED') {
        return (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            >
                <Check size={14} />
            </motion.div>
        );
    }

    if (status === 'LOCKED') {
        return (
            <motion.div
                className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30"
            >
                <Lock size={14} />
            </motion.div>
        );
    }

    return (
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-500 border border-white/5">
            <Clock size={14} />
        </div>
    );
}
