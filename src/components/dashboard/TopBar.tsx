'use client';
import { useGameStore } from "@/store/game-store";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, DollarSign, Calendar, Activity, RotateCcw } from "lucide-react";

export function TopBar() {
    const { gameState, resetGame } = useGameStore();

    const handleReset = () => {
        if (confirm("Are you sure you want to reset the simulation? All progress will be lost.")) {
            resetGame();
        }
    };

    return (
        <div className="w-full flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 shadow-md mb-6 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900/30 rounded-lg border border-blue-500/30">
                    <Activity className="text-blue-400" size={24} />
                </div>
                <span className="text-xl font-bold tracking-widest text-white">
                    TOPAZ<span className="text-blue-500">VBE</span>
                </span>
            </div>

            <div className="flex items-center gap-6">
                <Metric
                    label="Cash"
                    value={formatCurrency(gameState.cash)}
                    icon={<DollarSign size={16} className="text-emerald-400" />}
                    valueColor={gameState.cash < 0 ? "text-rose-400" : "text-emerald-400"}
                />

                <Metric
                    label="Stock"
                    value={formatCurrency(gameState.stockPrice)}
                    icon={<TrendingUp size={16} className="text-blue-400" />}
                    valueColor="text-blue-400"
                />

                <div className="h-8 w-px bg-slate-700 mx-2"></div>

                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                    title="Reset Simulation"
                >
                    <RotateCcw size={14} />
                    <span>Reset</span>
                </button>
            </div>
        </div>
    )
}

function Metric({ label, value, icon, valueColor }: any) {
    return (
        <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-0.5 font-bold">
                {label}
            </span>
            <span className={`text-lg font-mono font-bold ${valueColor} tabular-nums leading-none`}>
                {value}
            </span>
        </div>
    )
}
