'use client';
import { useGameStore } from "@/store/game-store";
import { formatCurrency } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, PieChart, Pie, Legend, CartesianGrid, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank, AlertTriangle, Printer, FileText, Download } from 'lucide-react';
import { useState } from 'react';

export function FinanceDashboard() {
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);
    const companyStates = useGameStore((state) => state.companyStates);
    const [loanAmount, setLoanAmount] = useState(0);
    const [dividendPerShare, setDividendPerShare] = useState(0);

    const gameState = companyStates[activeCompanyId];
    if (!gameState) return null;

    const player = gameState.player;
    const lastQuarter = player.history[player.history.length - 1];

    const financials = lastQuarter?.financials || {
        revenue: 0,
        cogs: 0,
        grossProfit: 0,
        expenses: { marketing: 0, rd: 0, depreciation: 0, interest: 0, tax: 0, personnel: 0 },
        netProfit: 0
    };

    // Historical data for charts
    const historicalData = player.history.map((q, i) => {
        const p1 = q.salesByProduct?.find(p => p.product === 'P1')?.revenue || 0;
        const p2 = q.salesByProduct?.find(p => p.product === 'P2')?.revenue || 0;
        const p3 = q.salesByProduct?.find(p => p.product === 'P3')?.revenue || 0;

        return {
            quarter: `Q${q.quarter}`,
            revenue: q.financials.revenue,
            profit: q.financials.netProfit,
            cogs: q.financials.cogs,
            cash: q.financials.assets.cash,
            stockPrice: q.metrics.stockPrice,
            marketShare: q.metrics.marketShare,
            p1, p2, p3
        };
    });

    // Expense breakdown for pie chart
    const expenseData = [
        { name: 'Marketing', value: financials.expenses.marketing, color: '#8b5cf6' },
        { name: 'Personnel', value: financials.expenses.personnel, color: '#3b82f6' },
        { name: 'Depreciation', value: financials.expenses.depreciation, color: '#f59e0b' },
        { name: 'Tax', value: financials.expenses.tax, color: '#ef4444' },
    ].filter(e => e.value > 0);

    const interestRate = gameState.market.interestRate;
    const projectedInterest = loanAmount * (interestRate / 4);
    const hasData = player.history.length > 0;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8">
            {/* Action Bar */}
            <div className="flex justify-between items-center no-print">
                <h2 className="text-2xl font-bold text-white">Financial Dashboard</h2>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-slate-600 transition-all"
                    >
                        <Printer size={16} />
                        Print Report
                    </button>
                </div>
            </div>

            {/* No Data Message */}
            {!hasData && (
                <div className="glass-panel rounded-xl p-12 text-center">
                    <div className="text-8xl mb-6">📊</div>
                    <h3 className="text-2xl font-bold text-white mb-3">No Financial Data Yet</h3>
                    <p className="text-slate-400 text-lg mb-6">Make your decisions, then click <strong className="text-white">"Run Quarter"</strong> in the footer below to simulate and see financial reports.</p>
                    <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black/30 text-sm text-slate-300 border border-white/10">
                        <span>👇</span>
                        <span>Look for the <strong className="text-white">RUN QUARTER</strong> button at the bottom of the screen</span>
                    </div>
                </div>
            )}

            {/* P&L Statement */}
            <section className="glass-panel rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Wallet className="text-emerald-400" size={24} />
                    Profit & Loss Statement
                    <span className="text-sm font-normal text-slate-400 uppercase tracking-widest ml-auto">
                        {hasData ? `Q${gameState.market.quarter - 1} Results` : 'Awaiting Data'}
                    </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <MetricBox label="Revenue" value={financials.revenue} positive />
                    <MetricBox label="Cost of Goods Sold" value={-financials.cogs} negative />
                    <MetricBox label="Gross Profit" value={financials.grossProfit} positive={financials.grossProfit >= 0} />
                </div>

                {/* Expenses Table */}
                <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Operating Expenses</div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <ExpenseItem label="Marketing" value={financials.expenses.marketing} />
                        <ExpenseItem label="Personnel" value={financials.expenses.personnel} />
                        <ExpenseItem label="Depreciation" value={financials.expenses.depreciation} />
                        <ExpenseItem label="Interest" value={financials.expenses.interest} />
                        <ExpenseItem label="Tax" value={financials.expenses.tax} />
                    </div>
                </div>

                {/* Net Profit */}
                <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center p-4 rounded-lg bg-slate-800/50">
                        <div>
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Net Profit (After Tax)</div>
                            <div className={`text-4xl font-mono font-bold ${financials.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                <AnimatedNumber value={financials.netProfit} prefix="£" />
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold ${financials.netProfit >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {financials.netProfit >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                            {financials.revenue > 0 ? ((financials.netProfit / financials.revenue) * 100).toFixed(1) : 0}% Margin
                        </div>
                    </div>
                </div>
            </section>

            {/* Charts Section */}
            {hasData && (
                <>
                    {/* Revenue & Profit Trend */}
                    <section className="glass-panel rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6">📈 Revenue & Profit Trend</h3>
                        <div style={{ height: '400px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historicalData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="quarter" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} />
                                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                                    <Area type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" name="Profit" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    {/* NEW: Product Sales & Net Income Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Sales Breakdown */}
                        <section className="glass-panel rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">🛍️ Product Sales Breakdown</h3>
                            <div style={{ height: '300px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={historicalData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="quarter" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} formatter={(v: number) => formatCurrency(v)} />
                                        <Legend />
                                        <Bar dataKey="p1" name="Product 1" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="p2" name="Product 2" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="p3" name="Product 3" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        {/* Net Income History chart */}
                        <section className="glass-panel rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">💰 Net Income History</h3>
                            <div style={{ height: '300px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={historicalData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="quarter" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} formatter={(v: number) => formatCurrency(v)} />
                                        <Bar dataKey="profit" name="Net Profit" radius={[4, 4, 0, 0]}>
                                            {historicalData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                    </div>

                    {/* Stock Price & Expense (Lower Grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Stock Price Chart */}
                        <section className="glass-panel rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">📊 Stock Price History</h3>
                            <div style={{ height: '300px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={historicalData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="quarter" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickFormatter={(v) => `£${v.toFixed(2)}`} />
                                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                                        <Line type="monotone" dataKey="stockPrice" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 5 }} name="Share Price" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        {/* Expense Breakdown */}
                        <section className="glass-panel rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">🥧 Expense Breakdown</h3>
                            <div style={{ height: '300px', width: '100%' }}>
                                {expenseData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={expenseData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                                label
                                            >
                                                {expenseData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-500">No expense data</div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Cash Flow Chart */}
                    <section className="glass-panel rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <PiggyBank className="text-violet-400" size={24} />
                            Cash Position Over Time
                        </h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={historicalData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="quarter" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} />
                                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} formatter={(v: number) => formatCurrency(v)} />
                                    <Bar dataKey="cash" radius={[4, 4, 0, 0]} name="Cash Balance">
                                        {historicalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.cash >= 0 ? '#10b981' : '#ef4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                </>
            )}

            {/* Loan & Dividend Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
                <section className="glass-panel rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                        <CreditCard className="text-amber-400" size={20} />
                        Loan Management
                    </h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-800/50 rounded-lg">
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Current Loans</div>
                                <div className="text-xl font-mono font-bold text-white">{formatCurrency(player.loans)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Interest Rate (Annual)</div>
                                <div className="text-xl font-mono font-bold text-amber-400">{(interestRate * 100).toFixed(1)}%</div>
                            </div>
                        </div>

                        <div className="control-module p-4">
                            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3 block">
                                Request New Loan
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={500000}
                                step={10000}
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-700"
                                style={{ accentColor: '#f59e0b' }}
                            />
                            <div className="flex justify-between mt-3">
                                <span className="text-2xl font-mono font-bold text-white">
                                    {formatCurrency(loanAmount)}
                                </span>
                                {loanAmount > 0 && (
                                    <span className="helper-chip warning">
                                        +{formatCurrency(projectedInterest)}/Q
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="glass-panel rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                        <PiggyBank className="text-emerald-400" size={20} />
                        Dividend Distribution
                    </h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-800/50 rounded-lg">
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Shares Outstanding</div>
                                <div className="text-xl font-mono font-bold text-white">{player.shareCount.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Share Price</div>
                                <div className="text-xl font-mono font-bold text-emerald-400">{formatCurrency(player.sharePrice)}</div>
                            </div>
                        </div>

                        <div className="control-module p-4">
                            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3 block">
                                Dividend Per Share (pence)
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={50}
                                step={1}
                                value={dividendPerShare}
                                onChange={(e) => setDividendPerShare(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-700"
                                style={{ accentColor: '#10b981' }}
                            />
                            <div className="flex justify-between mt-3">
                                <span className="text-2xl font-mono font-bold text-white">{dividendPerShare}p</span>
                                {dividendPerShare > 0 && (
                                    <div className="text-right">
                                        <div className="text-xs text-slate-400">Total Payout</div>
                                        <div className="font-mono text-lg font-bold text-emerald-400">
                                            {formatCurrency((dividendPerShare / 100) * player.shareCount)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {dividendPerShare > 0 && player.cash < (dividendPerShare / 100) * player.shareCount && (
                            <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                                <AlertTriangle size={18} />
                                <span className="font-bold">Insufficient cash for this dividend level!</span>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function MetricBox({ label, value, positive, negative }: { label: string; value: number; positive?: boolean; negative?: boolean }) {
    return (
        <div className="control-module p-5">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</div>
            <div className={`text-3xl font-mono font-bold ${positive ? 'text-emerald-400' : negative ? 'text-rose-400' : 'text-white'}`}>
                <AnimatedNumber value={Math.abs(value)} prefix={value < 0 ? '-£' : '£'} />
            </div>
        </div>
    );
}

function ExpenseItem({ label, value }: { label: string; value: number }) {
    return (
        <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-lg font-mono font-bold text-slate-200">
                {formatCurrency(value)}
            </div>
        </div>
    );
}
