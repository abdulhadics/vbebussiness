'use client';
import { useGameStore, AVAILABLE_COMPANIES } from "@/store/game-store";
import { formatCurrency } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { MicroSparkline } from "@/components/ui/MicroSparkline";
import { LineChart, DollarSign, Users, TrendingUp, Package, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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

    if (priceHistory.length > 0) {
        priceHistory.push(player.sharePrice);
        cashHistory.push(player.cash);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full glass-card p-8 mb-8 relative overflow-hidden"
        >
            {/* Animated Gradient Background */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background: `radial-gradient(ellipse at top right, ${companyInfo?.color}40, transparent 50%),
                       radial-gradient(ellipse at bottom left, ${companyInfo?.color}20, transparent 50%)`
                }}
            />

            {/* Floating Orbs */}
            <motion.div
                animate={{
                    x: [0, 20, 0],
                    y: [0, -10, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-20 w-32 h-32 rounded-full blur-3xl"
                style={{ backgroundColor: companyInfo?.color }}
            />
            <motion.div
                animate={{
                    x: [0, -15, 0],
                    y: [0, 15, 0],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 right-1/3 w-48 h-48 rounded-full blur-3xl bg-indigo-600/20"
            />

            <div className="relative z-10">
                {/* Header Row */}
                <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-4">
                        {/* Company Badge */}
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, ${companyInfo?.color}, ${companyInfo?.color}99)`,
                                boxShadow: `0 10px 30px ${companyInfo?.color}40`
                            }}
                        >
                            🏢
                        </motion.div>

                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
                                {player.companyName}
                            </h1>
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-amber-400" />
                                    Quarter {gameState.market.quarter}
                                </span>
                                <span>•</span>
                                <span>Fiscal Year {Math.ceil(gameState.market.quarter / 4)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/15 border border-emerald-500/30"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-emerald-400"
                        />
                        <span className="text-emerald-400 font-bold text-sm uppercase tracking-widest">Active</span>
                    </motion.div>
                </div>

                {/* Metrics Grid - Bento Style */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <MetricCard
                        label="Share Price"
                        value={player.sharePrice}
                        prefix="£"
                        decimals={2}
                        icon={<LineChart size={18} />}
                        sparklineData={priceHistory.length > 1 ? priceHistory : undefined}
                        accentColor={companyInfo?.color}
                        large
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
        </motion.div>
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
    large?: boolean;
}

function MetricCard({ label, value, prefix = '', suffix = '', decimals = 0, icon, sparklineData, trend, subtext, negative, accentColor, large }: MetricCardProps) {
    let calculatedTrend = trend;
    if (sparklineData && sparklineData.length > 1 && trend === undefined) {
        const first = sparklineData[0];
        const last = sparklineData[sparklineData.length - 1];
        if (first > 0) {
            calculatedTrend = ((last - first) / first) * 100;
        }
    }

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`
                relative 
                bg-slate-800/30 
                backdrop-blur-sm
                border border-white/5 
                rounded-2xl 
                p-5 
                group 
                overflow-hidden
                hover:border-white/10
                hover:bg-slate-800/50
                transition-all duration-300
            `}
        >
            {/* Hover Glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(circle at center, ${accentColor}10, transparent 70%)`
                }}
            />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-slate-400">
                    <span style={{ color: accentColor }}>{icon}</span>
                    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
                </div>

                <div className="flex items-end justify-between gap-3">
                    <div className={`font-mono font-bold ${large ? 'text-3xl' : 'text-2xl'} ${negative ? 'text-rose-400' : 'text-white'}`}>
                        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
                    </div>

                    {sparklineData && sparklineData.length > 1 && (
                        <MicroSparkline data={sparklineData} color={accentColor} />
                    )}
                </div>

                {calculatedTrend !== undefined && calculatedTrend !== 0 && (
                    <div className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full ${calculatedTrend >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {calculatedTrend >= 0 ? '+' : ''}{calculatedTrend.toFixed(1)}%
                    </div>
                )}

                {subtext && (
                    <div className="text-xs text-slate-500 mt-2 font-mono">{subtext}</div>
                )}
            </div>
        </motion.div>
    )
}
