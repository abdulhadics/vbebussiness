'use client';
import { useGameStore } from "@/store/game-store";
import { CapacityGauge } from "@/components/ui/CapacityGauge";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { Cog, Factory, Users, Wrench, TrendingDown, Zap, Heart } from "lucide-react";
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
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: -10 }}
                                className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-2xl shadow-lg"
                            >
                                <Factory className="w-7 h-7 text-white" />
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-bold text-black">Production Capacity</h3>
                                <p className="text-sm text-gray-500">
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
                                className={`p-3 rounded-xl text-center transition-all cursor-pointer ${decisions.operations.shiftLevel === shift
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                onClick={() => setOperations('shiftLevel', shift as 1 | 2 | 3)}
                            >
                                <div className="text-xs mb-1">Shift {shift}</div>
                                <div className="font-bold">
                                    {shift === 1 ? '1x' : shift === 2 ? '1.5x' : '2x'} Cost
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Machine Assets - Side Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
                    <div className="flex items-center gap-3 mb-6">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-12 h-12 rounded-2xl bg-purple-500 flex items-center justify-center shadow-lg"
                        >
                            <Cog className="w-6 h-6 text-white" />
                        </motion.div>
                        <h3 className="text-lg font-bold text-black">Machinery</h3>
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
                </div>
            </div>

            {/* Second Row - Maintenance & Personnel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Maintenance */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-amber-500">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 45 }}
                                className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg"
                            >
                                <Wrench className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-bold text-black">Maintenance</h3>
                                <p className="text-xs text-gray-500">Hours per machine/quarter</p>
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
                            className="text-6xl font-mono font-bold text-black mb-2"
                        >
                            {decisions.operations.maintenanceHours}h
                        </motion.div>
                        <div className="text-gray-500">per machine</div>
                    </div>

                    {/* Slider */}
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={decisions.operations.maintenanceHours}
                        onChange={(e) => setOperations('maintenanceHours', Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-amber-500"
                    />

                    {decisions.operations.maintenanceHours < 20 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2"
                        >
                            <TrendingDown size={16} />
                            Low maintenance may cause efficiency degradation
                        </motion.div>
                    )}
                </div>

                {/* Workforce */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-emerald-500">
                    <div className="flex items-center gap-3 mb-6">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg"
                        >
                            <Users className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                            <h3 className="text-lg font-bold text-black">Workforce</h3>
                            <p className="text-xs text-gray-500">{player.employees} employees</p>
                        </div>
                    </div>

                    {/* Morale Gauge */}
                    <div className="mb-6 p-4 rounded-xl bg-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Heart size={14} className={player.morale > 60 ? 'text-green-500' : player.morale > 40 ? 'text-amber-500' : 'text-red-500'} />
                                Morale
                            </div>
                            <span className={`font-bold font-mono ${player.morale > 60 ? 'text-green-600' : player.morale > 40 ? 'text-amber-600' : 'text-red-600'}`}>
                                {player.morale}%
                            </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${player.morale}%` }}
                                transition={{ duration: 0.5 }}
                                className={`h-full rounded-full ${player.morale > 60 ? 'bg-green-500' :
                                    player.morale > 40 ? 'bg-amber-500' :
                                        'bg-red-500'
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
                            className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 text-sm flex items-center gap-2"
                        >
                            <Zap size={16} />
                            Below-market wages may hurt morale
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div >
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
                rounded-xl bg-gray-50 border-2 border-gray-200
                hover:border-gray-300 transition-all
                ${compact ? 'p-3' : 'p-4'}
            `}
        >
            <div className="flex items-center justify-between mb-2">
                <span className={`font-bold uppercase tracking-widest ${compact ? 'text-[10px]' : 'text-xs'} ${positive ? 'text-green-600' : negative ? 'text-red-600' : 'text-gray-500'}`}>
                    {label}
                </span>
                {helperText && (
                    <span className="text-[10px] text-gray-400">{helperText}</span>
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
                    className={`w-full bg-white text-black font-bold font-mono outline-none border-2 border-gray-200 rounded-lg p-2 focus:border-black transition-colors ${compact ? 'text-xl' : 'text-2xl'}`}
                />
                {suffix && <span className="text-gray-500 text-sm">{suffix}</span>}
            </div>
        </motion.div>
    );
}
