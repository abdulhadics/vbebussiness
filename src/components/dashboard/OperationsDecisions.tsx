'use client';
import { useGameStore } from "@/store/game-store";
import { GlassCard } from "@/components/ui/GlassCard";
import { CapacityGauge } from "@/components/ui/CapacityGauge";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { Cog, Factory, Users, Wrench, TrendingUp, TrendingDown, Zap, Heart } from "lucide-react";
import { motion } from "framer-motion";

export function OperationsDecisions() {
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);
    const drafts = useGameStore((state) => state.drafts);
    const companyStates = useGameStore((state) => state.companyStates);
    const setOperations = useGameStore((state) => state.setOperations);
    const setPersonnel = useGameStore((state) => state.setPersonnel);

    const decisions = drafts[activeCompanyId];
    const player = companyStates[activeCompanyId]?.player;

    if (!decisions || !player) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            {/* Bento Grid - Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Production Capacity - Large Card */}
                <GlassCard
                    delay={0}
                    glow="blue"
                    className="lg:col-span-2"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: -10 }}
                                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl shadow-lg"
                            >
                                <Factory className="w-7 h-7 text-white" />
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Production Capacity</h3>
                                <p className="text-sm text-slate-400">
                                    {player.machines} Machines • {(player.machineEfficiency * 100).toFixed(0)}% Efficiency
                                </p>
                            </div>
                        </div>
                        <InfoTooltip text="Higher shifts increase capacity but cost more in wage premiums." />
                    </div>

                    <CapacityGauge
                        level={decisions.operations.shiftLevel}
                        onChange={(level) => setOperations('shiftLevel', level)}
                    />

                    {/* Shift Cost Indicator */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(shift => (
                            <div
                                key={shift}
                                className={`p-3 rounded-xl text-center transition-all ${decisions.operations.shiftLevel === shift
                                        ? 'bg-blue-500/20 border border-blue-500/30'
                                        : 'bg-slate-800/30 border border-white/5'
                                    }`}
                            >
                                <div className="text-xs text-slate-400 mb-1">Shift {shift}</div>
                                <div className={`font-bold ${decisions.operations.shiftLevel === shift ? 'text-blue-400' : 'text-slate-500'
                                    }`}>
                                    {shift === 1 ? '1x' : shift === 2 ? '1.5x' : '2x'} Cost
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Machine Assets - Side Card */}
                <GlassCard delay={0.1} glow="purple">
                    <div className="flex items-center gap-3 mb-6">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg"
                        >
                            <Cog className="w-6 h-6 text-white" />
                        </motion.div>
                        <h3 className="text-lg font-bold text-white">Machinery</h3>
                    </div>

                    <div className="space-y-4">
                        <OperationInput
                            label="Buy Machines"
                            value={decisions.operations.buyMachines}
                            onChange={(v) => setOperations('buyMachines', v)}
                            max={5}
                            suffix="units"
                            helperText="£50k each"
                            positive
                        />
                        <OperationInput
                            label="Sell Machines"
                            value={decisions.operations.sellMachines}
                            onChange={(v) => setOperations('sellMachines', v)}
                            max={Math.min(5, player.machines)}
                            suffix="units"
                            helperText="Recovers £25k"
                            negative
                        />
                    </div>
                </GlassCard>
            </div>

            {/* Second Row - Maintenance & Personnel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Maintenance */}
                <GlassCard delay={0.2} glow="amber">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 45 }}
                                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg"
                            >
                                <Wrench className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Maintenance</h3>
                                <p className="text-xs text-slate-400">Hours per machine/quarter</p>
                            </div>
                        </div>
                        <InfoTooltip text="Needs >20h to prevent efficiency loss." />
                    </div>

                    {/* Large Display */}
                    <div className="text-center mb-6">
                        <motion.div
                            key={decisions.operations.maintenanceHours}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            className="text-6xl font-mono font-bold text-white mb-2"
                        >
                            {decisions.operations.maintenanceHours}h
                        </motion.div>
                        <div className="text-slate-400">per machine</div>
                    </div>

                    {/* Slider */}
                    <div className="relative">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 rounded-full overflow-hidden">
                            <div className="absolute inset-0 bg-slate-700" />
                            <div
                                className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ${decisions.operations.maintenanceHours < 20
                                        ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                                        : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                    }`}
                                style={{ width: `${(decisions.operations.maintenanceHours / 100) * 100}%` }}
                            />
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={decisions.operations.maintenanceHours}
                            onChange={(e) => setOperations('maintenanceHours', Number(e.target.value))}
                            className="relative w-full h-3 bg-transparent appearance-none cursor-pointer z-10"
                            style={{ opacity: 0 }}
                        />
                    </div>

                    {decisions.operations.maintenanceHours < 20 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2"
                        >
                            <TrendingDown size={16} />
                            Low maintenance may cause efficiency degradation
                        </motion.div>
                    )}
                </GlassCard>

                {/* Workforce */}
                <GlassCard delay={0.3} glow="emerald">
                    <div className="flex items-center gap-3 mb-6">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg"
                        >
                            <Users className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Workforce</h3>
                            <p className="text-xs text-slate-400">{player.employees} employees</p>
                        </div>
                    </div>

                    {/* Morale Gauge */}
                    <div className="mb-6 p-4 rounded-xl bg-slate-800/30 border border-white/5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Heart size={14} className={player.morale > 60 ? 'text-emerald-400' : player.morale > 40 ? 'text-amber-400' : 'text-rose-400'} />
                                Morale
                            </div>
                            <span className={`font-bold font-mono ${player.morale > 60 ? 'text-emerald-400' : player.morale > 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                                {player.morale}%
                            </span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${player.morale}%` }}
                                transition={{ duration: 0.5 }}
                                className={`h-full rounded-full ${player.morale > 60 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                                        player.morale > 40 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                                            'bg-gradient-to-r from-rose-500 to-pink-500'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Personnel Controls Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <OperationInput
                            label="Recruit"
                            value={decisions.personnel.recruitWorkers}
                            onChange={(v) => setPersonnel('recruitWorkers', v)}
                            max={20}
                            compact
                            positive
                        />
                        <OperationInput
                            label="Dismiss"
                            value={decisions.personnel.dismissWorkers}
                            onChange={(v) => setPersonnel('dismissWorkers', v)}
                            max={Math.min(20, player.employees)}
                            compact
                            negative
                        />
                        <OperationInput
                            label="Wage £/h"
                            value={decisions.personnel.workerWage}
                            onChange={(v) => setPersonnel('workerWage', v)}
                            min={8}
                            max={25}
                            step={0.5}
                            compact
                        />
                    </div>

                    {decisions.personnel.workerWage < 10 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center gap-2"
                        >
                            <Zap size={16} />
                            Below-market wages may hurt morale
                        </motion.div>
                    )}
                </GlassCard>
            </div>
        </motion.div>
    )
}

interface OperationInputProps {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
    helperText?: string;
    compact?: boolean;
    positive?: boolean;
    negative?: boolean;
}

function OperationInput({ label, value, onChange, min = 0, max = 100, step = 1, suffix, helperText, compact, positive, negative }: OperationInputProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`
                rounded-xl bg-slate-800/40 border border-white/5 
                hover:border-white/10 transition-all
                ${compact ? 'p-3' : 'p-4'}
            `}
        >
            <div className="flex items-center justify-between mb-2">
                <span className={`font-bold uppercase tracking-widest ${compact ? 'text-[10px]' : 'text-xs'} ${positive ? 'text-emerald-400' : negative ? 'text-rose-400' : 'text-slate-400'}`}>
                    {label}
                </span>
                {helperText && (
                    <span className="text-[10px] text-slate-500">{helperText}</span>
                )}
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={`w-full bg-transparent text-white font-bold font-mono outline-none ${compact ? 'text-xl' : 'text-2xl'}`}
                />
                {suffix && <span className="text-slate-500 text-sm">{suffix}</span>}
            </div>
        </motion.div>
    );
}
