'use client';
import { useGameStore, AVAILABLE_COMPANIES, CompanyStatus } from "@/store/game-store";
import { motion } from "framer-motion";
import { Check, Clock, Lock, Building2 } from "lucide-react";

export function CompanySwitcher() {
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);
    const companyStatuses = useGameStore((state) => state.companyStatuses);
    const companyStates = useGameStore((state) => state.companyStates);
    const switchCompany = useGameStore((state) => state.switchCompany);

    // Only show companies that are initialized
    const activeCompanies = AVAILABLE_COMPANIES.filter(c => companyStatuses[c.id] !== undefined);

    return (
        <div className="glass-panel rounded-xl p-3 mb-6">
            <div className="flex items-center gap-2 mb-3 px-2">
                <Building2 size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Company</span>
            </div>

            <div className="flex gap-2 flex-wrap">
                {activeCompanies.map((company) => {
                    const isActive = company.id === activeCompanyId;
                    const status = companyStatuses[company.id];
                    const gameState = companyStates[company.id];

                    return (
                        <motion.button
                            key={company.id}
                            onClick={() => switchCompany(company.id)}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${isActive
                                    ? 'bg-white/10 border-2 text-white shadow-lg'
                                    : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            style={{
                                borderColor: isActive ? company.color : undefined,
                                boxShadow: isActive ? `0 0 20px ${company.color}30` : undefined
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Company Color Indicator */}
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: company.color }}
                            />

                            {/* Company Name */}
                            <span>{company.name}</span>

                            {/* Quarter Badge */}
                            {gameState && (
                                <span className="text-xs text-slate-500 font-mono">
                                    Q{gameState.market.quarter}
                                </span>
                            )}

                            {/* Status Badge */}
                            <StatusBadge status={status} />
                        </motion.button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-3 px-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" />
                    <span>Pending</span>
                </div>
                <div className="flex items-center gap-1">
                    <Check size={12} className="text-emerald-400" />
                    <span>Submitted</span>
                </div>
                <div className="flex items-center gap-1">
                    <Lock size={12} className="text-amber-400" />
                    <span>Locked</span>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: CompanyStatus }) {
    if (status === 'SUBMITTED') {
        return (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
                <Check size={14} />
            </div>
        );
    }

    if (status === 'LOCKED') {
        return (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400">
                <Lock size={14} />
            </div>
        );
    }

    // PENDING
    return (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-slate-400">
            <Clock size={14} />
        </div>
    );
}
