'use client';
import { useGameStore, AVAILABLE_COMPANIES } from "@/store/game-store";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Printer } from "lucide-react";

export function QuarterlyReport() {
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);
    const companyStates = useGameStore((state) => state.companyStates);
    const showReport = useGameStore((state) => state.showReport);
    const closeReport = useGameStore((state) => state.closeReport);

    const gameState = companyStates[activeCompanyId];
    const companyInfo = AVAILABLE_COMPANIES.find(c => c.id === activeCompanyId);

    if (!showReport || !gameState) return null;

    const history = gameState.player.history;
    const currentQ = history[history.length - 1];

    if (!currentQ) return null;

    const revenue = currentQ.financials.revenue;
    const profit = currentQ.financials.netProfit;
    const cash = currentQ.financials.assets.cash;
    const cogs = currentQ.financials.cogs;
    const expenses = currentQ.financials.expenses;

    const prevQ = history.length > 1 ? history[history.length - 2] : null;
    const revenueGrowth = prevQ && prevQ.financials.revenue > 0
        ? ((revenue - prevQ.financials.revenue) / prevQ.financials.revenue) * 100
        : 0;

    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    const handlePrint = () => {
        window.print();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="modal-overlay"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="modal-content w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto"
                >
                    {/* Header with company color */}
                    <div
                        className="p-6 text-white flex justify-between items-center sticky top-0 z-10"
                        style={{ background: `linear-gradient(135deg, ${companyInfo?.color || '#10b981'}, ${companyInfo?.color}99)` }}
                    >
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Quarter {currentQ.quarter} Results</h4>
                            <h2 className="text-2xl font-bold tracking-tight">{gameState.player.companyName} - Management Report</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors font-bold text-sm"
                            >
                                <Printer size={16} />
                                Print
                            </button>
                            <button
                                onClick={closeReport}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-slate-900 p-8 text-white">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <SummaryCard label="Revenue" value={revenue} prefix="£" positive />
                            <SummaryCard label="COGS" value={-cogs} prefix="£" negative />
                            <SummaryCard label="Net Profit" value={profit} prefix="£" positive={profit >= 0} />
                            <SummaryCard label="Closing Cash" value={cash} prefix="£" warning={cash < 0} />
                        </div>

                        {/* Detailed P&L Table */}
                        <div className="glass-panel rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3">Profit & Loss Statement</h3>

                            <table className="w-full text-sm">
                                <tbody>
                                    <TableRow label="Sales Revenue" value={revenue} bold />
                                    <TableRow label="Less: Cost of Goods Sold" value={-cogs} negative />
                                    <TableRow label="Gross Profit" value={revenue - cogs} bold highlight />

                                    <tr><td colSpan={2} className="py-3"></td></tr>

                                    <TableRow label="Less: Operating Expenses" subheader />
                                    <TableRow label="  Marketing & Advertising" value={-expenses.marketing} indent />
                                    <TableRow label="  Personnel Costs" value={-expenses.personnel} indent />
                                    <TableRow label="  Depreciation" value={-expenses.depreciation} indent />
                                    <TableRow label="  Interest Expense" value={-expenses.interest} indent />

                                    <tr><td colSpan={2} className="py-2"></td></tr>

                                    <TableRow label="Profit Before Tax" value={profit + expenses.tax} bold />
                                    <TableRow label="Less: Corporate Tax" value={-expenses.tax} negative />
                                    <TableRow label="Net Profit After Tax" value={profit} bold highlight final />
                                </tbody>
                            </table>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="glass-panel rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">📊 Performance Metrics</h3>
                                <div className="space-y-4">
                                    <MetricRow label="Revenue Growth" value={`${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`} positive={revenueGrowth >= 0} />
                                    <MetricRow label="Profit Margin" value={`${profitMargin.toFixed(1)}%`} positive={profitMargin > 0} />
                                    <MetricRow label="Units Sold" value={currentQ.metrics.unitsSold.toLocaleString()} />
                                    <MetricRow label="Market Share" value={`${currentQ.metrics.marketShare.toFixed(1)}%`} />
                                </div>
                            </div>

                            <div className="glass-panel rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">💡 Board Analysis</h3>
                                <div className="space-y-4">
                                    <AnalysisItem
                                        positive={profit > 0}
                                        text={profit > 0
                                            ? "Strong margins achieved. Consider reinvesting in R&D or marketing expansion."
                                            : "Loss recorded. Immediate review of pricing strategy or cost reduction required."
                                        }
                                    />
                                    {revenueGrowth > 5 && (
                                        <AnalysisItem
                                            positive
                                            text="Excellent revenue growth. Marketing investments are paying off."
                                        />
                                    )}
                                    {cash < 50000 && (
                                        <AnalysisItem
                                            positive={false}
                                            text="Cash reserves running low. Consider securing a loan or reducing dividend."
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={closeReport}
                                style={{ backgroundColor: companyInfo?.color }}
                                className="px-8 py-3 hover:opacity-90 text-white font-bold text-sm uppercase tracking-widest rounded-lg transition-all"
                            >
                                Close Report
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

function SummaryCard({ label, value, prefix = '', positive, negative, warning }: { label: string; value: number; prefix?: string; positive?: boolean; negative?: boolean; warning?: boolean }) {
    let colorClass = 'text-white';
    if (positive && value > 0) colorClass = 'text-emerald-400';
    if (negative || value < 0) colorClass = 'text-rose-400';
    if (warning) colorClass = 'text-amber-400';

    return (
        <div className="control-module p-4 text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</div>
            <div className={`text-2xl font-mono font-bold ${colorClass}`}>
                {prefix}{Math.abs(value).toLocaleString()}
            </div>
        </div>
    );
}

function TableRow({ label, value, bold, negative, highlight, indent, subheader, final }: { label: string; value?: number; bold?: boolean; negative?: boolean; highlight?: boolean; indent?: boolean; subheader?: boolean; final?: boolean }) {
    if (subheader) {
        return (
            <tr>
                <td className="py-2 text-slate-400 font-bold">{label}</td>
                <td></td>
            </tr>
        );
    }

    return (
        <tr className={`${highlight ? 'bg-slate-800/50' : ''} ${final ? 'border-t-2 border-white/20' : ''}`}>
            <td className={`py-2 ${bold ? 'font-bold text-white' : 'text-slate-300'} ${indent ? 'pl-4' : ''}`}>
                {label}
            </td>
            <td className={`py-2 text-right font-mono ${bold ? 'font-bold' : ''} ${(value !== undefined && value < 0) || negative ? 'text-rose-400' : value !== undefined && value > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                {value !== undefined ? `£${Math.abs(value).toLocaleString()}` : ''}
            </td>
        </tr>
    );
}

function MetricRow({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-slate-400">{label}</span>
            <span className={`font-mono font-bold ${positive === true ? 'text-emerald-400' : positive === false ? 'text-rose-400' : 'text-white'}`}>
                {value}
            </span>
        </div>
    );
}

function AnalysisItem({ positive, text }: { positive: boolean; text: string }) {
    return (
        <div className="flex gap-3">
            <div className={`mt-0.5 flex-shrink-0 ${positive ? 'text-emerald-400' : 'text-amber-400'}`}>
                {positive ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
        </div>
    );
}
