'use client';
import { useGameStore, AVAILABLE_COMPANIES } from "@/store/game-store";
import { formatCurrency } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { MicroSparkline } from "@/components/ui/MicroSparkline";
import { LineChart, DollarSign, Users, TrendingUp, Package } from "lucide-react";

export function CompanyHeader() {
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);
    const companyStates = useGameStore((state) => state.companyStates);

    const gameState = companyStates[activeCompanyId];
    const companyInfo = AVAILABLE_COMPANIES.find(c => c.id === activeCompanyId);

    if (!gameState) return null;

    const player = gameState.player;

    // Extract historical data for sparklines
    const priceHistory = player.history.map(q => q.metrics.stockPrice);
    const cashHistory = player.history.map(q => q.financials.assets.cash);

    // Add current values to history for sparkline
    if (priceHistory.length > 0) {
        priceHistory.push(player.sharePrice);
        cashHistory.push(player.cash);
    }

    return (
        <div className="w-full glass-panel rounded-xl p-8 mb-6 relative overflow-hidden">
            {/* Dynamic Gradient Accent based on company color */}
            <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, ${companyInfo?.color || '#10b981'}, transparent)` }}
            ></div>

            {/* Background glow */}
            <div
                className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-10"
                style={{ backgroundColor: companyInfo?.color || '#10b981' }}
            ></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: companyInfo?.color || '#10b981' }}
                            />
                            <h1 className="text-3xl font-bold text-white tracking-tight">{player.companyName}</h1>
                        </div>
                        <div className="text-sm text-slate-400 mt-1">Quarter {gameState.market.quarter} • Fiscal Year {Math.ceil(gameState.market.quarter / 4)}</div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <TrendingUp className="text-emerald-400" size={16} />
                        <span className="text-emerald-400 font-bold text-sm">Active</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    <MetricCard
                        label="Share Price"
                        value={player.sharePrice}
                        prefix="£"
                        decimals={2}
                        icon={<LineChart size={18} />}
                        sparklineData={priceHistory.length > 1 ? priceHistory : undefined}
                        accentColor={companyInfo?.color}
                    />
                    <MetricCard
                        label="Net Worth"
                        value={player.netWorth}
                        prefix="£"
                        icon={<DollarSign size={18} />}
                        accentColor={companyInfo?.color}
                    />
                    <MetricCard
                        label="Cash Balance"
                        value={player.cash}
                        prefix="£"
                        icon={<DollarSign size={18} />}
                        sparklineData={cashHistory.length > 1 ? cashHistory : undefined}
                        negative={player.cash < 0}
                        accentColor={companyInfo?.color}
                    />
                    <MetricCard
                        label="Workforce"
                        value={player.employees}
                        suffix=" staff"
                        icon={<Users size={18} />}
                        subtext={`${player.morale}% Morale`}
                        accentColor={companyInfo?.color}
                    />
                    <MetricCard
                        label="Machines"
                        value={player.machines}
                        suffix=" units"
                        icon={<Package size={18} />}
                        subtext={`${(player.machineEfficiency * 100).toFixed(0)}% Efficiency`}
                        accentColor={companyInfo?.color}
                    />
                </div>
            </div>
        </div>
    )
}

interface MetricCardProps {
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    icon: React.ReactNode;
    sparklineData?: number[];
    trend?: number;
    subtext?: string;
    negative?: boolean;
    accentColor?: string;
}

function MetricCard({ label, value, prefix = '', suffix = '', decimals = 0, icon, sparklineData, trend, subtext, negative, accentColor }: MetricCardProps) {
    // Calculate trend from sparkline data if available
    let calculatedTrend = trend;
    if (sparklineData && sparklineData.length > 1 && trend === undefined) {
        const first = sparklineData[0];
        const last = sparklineData[sparklineData.length - 1];
        if (first > 0) {
            calculatedTrend = ((last - first) / first) * 100;
        }
    }

    return (
        <div className="control-module p-4 relative group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
                {icon}
                <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
            </div>

            <div className="flex items-end justify-between">
                <div className={`text-2xl font-mono font-bold ${negative ? 'text-rose-400' : 'text-white'}`}>
                    <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
                </div>

                {sparklineData && sparklineData.length > 1 && (
                    <MicroSparkline data={sparklineData} color={accentColor} />
                )}
            </div>

            {calculatedTrend !== undefined && calculatedTrend !== 0 && (
                <div className={`absolute top-3 right-3 text-xs font-bold ${calculatedTrend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {calculatedTrend >= 0 ? '+' : ''}{calculatedTrend.toFixed(1)}%
                </div>
            )}

            {subtext && (
                <div className="text-xs text-slate-500 mt-2 font-mono">{subtext}</div>
            )}
        </div>
    )
}
