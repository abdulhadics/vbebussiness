'use client';
import { useGameStore } from "@/store/game-store";
import { HighVisInput } from "@/components/ui/HighVisInput";
import { CapacityGauge } from "@/components/ui/CapacityGauge";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { Cog, Factory, Users, Wrench } from "lucide-react";

export function OperationsDecisions() {
    const decisions = useGameStore((state) => state.decisions);
    const setOperations = useGameStore((state) => state.setOperations);
    const setPersonnel = useGameStore((state) => state.setPersonnel);
    const player = useGameStore((state) => state.gameState.player);

    return (
        <div className="space-y-8">
            {/* Section 1: Capacity Control */}
            <section className="glass-panel rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Factory size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Production Capacity</h3>
                        <p className="text-sm text-slate-400">Current Machines: {player.machines} • Efficiency: {(player.machineEfficiency * 100).toFixed(0)}%</p>
                    </div>
                    <InfoTooltip text="Higher shifts increase capacity but cost significantly more in wage premiums (1.5x for Shift 2, 2.0x for Shift 3)." />
                </div>

                <CapacityGauge
                    level={decisions.operations.shiftLevel}
                    onChange={(level) => setOperations('shiftLevel', level)}
                />
            </section>

            {/* Section 2: Assets & Maintenance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="glass-panel rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                            <Cog size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Machine Assets</h3>
                    </div>

                    <div className="space-y-6">
                        <HighVisInput
                            label="Buy Machines"
                            value={decisions.operations.buyMachines}
                            min={0} max={5}
                            onChange={(v) => setOperations('buyMachines', v)}
                            helperText="£50k each"
                        />
                        <HighVisInput
                            label="Sell Machines"
                            value={decisions.operations.sellMachines}
                            min={0} max={Math.min(5, player.machines)}
                            onChange={(v) => setOperations('sellMachines', v)}
                            helperText="Recovers £25k"
                        />
                    </div>
                </section>

                <section className="glass-panel rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                            <Wrench size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Maintenance</h3>
                        <InfoTooltip text="Hours spent per machine per quarter. Needs >20h to prevent efficiency loss." />
                    </div>

                    <HighVisInput
                        label="Maintenance Hours / Machine"
                        value={decisions.operations.maintenanceHours}
                        min={0} max={100}
                        onChange={(v) => setOperations('maintenanceHours', v)}
                    />

                    {decisions.operations.maintenanceHours < 20 && (
                        <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                            ⚠️ Low maintenance may cause machine efficiency degradation.
                        </div>
                    )}
                </section>
            </div>

            {/* Section 3: Personnel */}
            <section className="glass-panel rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Workforce Management</h3>
                        <p className="text-sm text-slate-400">
                            Current Staff: {player.employees} •
                            Morale: <span className={player.morale > 60 ? 'text-emerald-400' : player.morale > 40 ? 'text-amber-400' : 'text-rose-400'}>{player.morale}%</span> •
                            Productivity: {(player.productivity * 100).toFixed(0)}%
                        </p>
                    </div>
                </div>

                {/* Morale Gauge */}
                <div className="mb-6 p-4 rounded-lg bg-slate-800/50">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>Workforce Morale</span>
                        <span className="font-mono">{player.morale}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            style={{ width: `${player.morale}%` }}
                            className={`h-full transition-all ${player.morale > 60 ? 'bg-emerald-500' :
                                    player.morale > 40 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <HighVisInput
                        label="Recruit Workers"
                        value={decisions.personnel.recruitWorkers}
                        min={0} max={20}
                        onChange={(v) => setPersonnel('recruitWorkers', v)}
                    />
                    <HighVisInput
                        label="Dismiss Workers"
                        value={decisions.personnel.dismissWorkers}
                        min={0} max={Math.min(20, player.employees)}
                        onChange={(v) => setPersonnel('dismissWorkers', v)}
                        helperText="Cost: 3mo wages"
                    />
                    <HighVisInput
                        label="Hourly Wage (£)"
                        prefix="£"
                        value={decisions.personnel.workerWage}
                        min={8} max={25} step={0.5}
                        onChange={(v) => setPersonnel('workerWage', v)}
                    />
                </div>

                {decisions.personnel.workerWage < 10 && (
                    <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                        ⚠️ Below-market wages may hurt morale and productivity.
                    </div>
                )}
            </section>
        </div>
    )
}
