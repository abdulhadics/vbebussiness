'use client';
import { useGameStore, AVAILABLE_COMPANIES } from "@/store/game-store";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { FileText, Printer, DollarSign, Users, Factory, TrendingUp, Package, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export function ManagementReport() {
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);
    const companyStates = useGameStore((state) => state.companyStates);
    const drafts = useGameStore((state) => state.drafts);

    const gameState = companyStates[activeCompanyId];
    const decisions = drafts[activeCompanyId];
    const companyInfo = AVAILABLE_COMPANIES.find(c => c.id === activeCompanyId);

    if (!gameState || !decisions) {
        return (
            <div className="text-center py-20">
                <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Report Available</h3>
                <p className="text-slate-400">Run at least one quarter to generate a management report.</p>
            </div>
        );
    }

    const history = gameState.player.history;
    const latestQuarter = history[history.length - 1];
    const player = gameState.player;

    // Calculate regional staff totals
    const totalSalesReps = decisions.regionalStaff
        ? Object.values(decisions.regionalStaff).reduce((sum, r) => sum + r.salesReps, 0)
        : 0;
    const totalMarketingStaff = decisions.regionalStaff
        ? Object.values(decisions.regionalStaff).reduce((sum, r) => sum + r.marketingStaff, 0)
        : 0;

    // Chart data
    const cashData = history.map(q => ({
        quarter: `Q${q.quarter}`,
        cash: q.financials.assets.cash,
    }));

    const profitData = history.map(q => ({
        quarter: `Q${q.quarter}`,
        profit: q.financials.netProfit,
    }));

    const salesData = history.map(q => ({
        quarter: `Q${q.quarter}`,
        units: q.metrics.unitsSold,
        revenue: q.financials.revenue,
    }));

    const handlePrint = () => window.print();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-black">
                        MANAGEMENT REPORT - Q{gameState.market.quarter - 1} Y{Math.ceil((gameState.market.quarter - 1) / 4)}
                    </h2>
                    <p className="text-gray-500">{player.companyName}</p>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                    <Printer size={18} />
                    Print Report
                </button>
            </div>

            {/* Decisions Made Section */}
            <GlassCard className="p-6 bg-white">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2 border-b pb-3">
                    <FileText size={18} />
                    DECISIONS MADE (Last Quarter)
                </h3>

                <div className="grid grid-cols-2 gap-8">
                    {/* Pricing Decisions */}
                    <div>
                        <h4 className="font-bold text-gray-600 mb-3">Pricing Decisions:</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Product 1:</span>
                                <span className="font-bold text-black">£{decisions.products.p1.price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Product 2:</span>
                                <span className="font-bold text-black">£{decisions.products.p2.price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Product 3:</span>
                                <span className="font-bold text-black">£{decisions.products.p3.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Marketing Investment */}
                    <div>
                        <h4 className="font-bold text-gray-600 mb-3">Marketing Investment:</h4>
                        <div className="space-y-2 text-sm">
                            {(['p1', 'p2', 'p3'] as const).map(p => {
                                const total = Object.values(decisions.products[p].marketing).reduce((a, b) => a + b, 0);
                                return (
                                    <div key={p} className="flex justify-between">
                                        <span className="text-gray-600">{p.toUpperCase()}:</span>
                                        <span className="font-bold text-black">£{total.toLocaleString()}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Operations */}
                <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-bold text-gray-600 mb-3">Operations:</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shift Level:</span>
                                <span className="font-bold text-black">{decisions.operations.shiftLevel}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Maintenance Hours:</span>
                                <span className="font-bold text-black">{decisions.operations.maintenanceHours}h</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-600 mb-3">Machines:</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Current Stock:</span>
                                <span className="font-bold text-black">{player.machines}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Efficiency:</span>
                                <span className="font-bold text-black">{(player.machineEfficiency * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Resources Employed */}
            <GlassCard className="p-6 bg-white">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2 border-b pb-3">
                    <Factory size={18} />
                    RESOURCES EMPLOYED
                </h3>

                <div className="grid grid-cols-3 gap-6">
                    {/* Manufacturing Capacity */}
                    <div>
                        <h4 className="font-bold text-gray-600 mb-3">Manufacturing Capacity:</h4>
                        <div className="bg-gray-100 rounded-xl p-4">
                            <div className="text-3xl font-bold text-black font-mono">{player.machines * 500}</div>
                            <div className="text-sm text-gray-500">units/quarter capacity</div>
                        </div>
                    </div>

                    {/* Personnel */}
                    <div>
                        <h4 className="font-bold text-gray-600 mb-3">Personnel:</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between bg-gray-100 p-2 rounded">
                                <span className="text-gray-600">Manufacturing:</span>
                                <span className="font-bold text-black">{player.employees}</span>
                            </div>
                            <div className="flex justify-between bg-gray-100 p-2 rounded">
                                <span className="text-gray-600">Sales Reps:</span>
                                <span className="font-bold text-black">{totalSalesReps}</span>
                            </div>
                            <div className="flex justify-between bg-gray-100 p-2 rounded">
                                <span className="text-gray-600">Marketing Staff:</span>
                                <span className="font-bold text-black">{totalMarketingStaff}</span>
                            </div>
                        </div>
                    </div>

                    {/* Regional Staff Table */}
                    <div>
                        <h4 className="font-bold text-gray-600 mb-3">Personnel by Region:</h4>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left text-gray-600">Region</th>
                                    <th className="p-2 text-right text-gray-600">Sales</th>
                                    <th className="p-2 text-right text-gray-600">Mktg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {decisions.regionalStaff && ['south', 'west', 'north', 'export'].map(r => (
                                    <tr key={r} className="border-b">
                                        <td className="p-2 text-black capitalize">{r}</td>
                                        <td className="p-2 text-right font-bold text-black">{decisions.regionalStaff[r as keyof typeof decisions.regionalStaff].salesReps}</td>
                                        <td className="p-2 text-right font-bold text-black">{decisions.regionalStaff[r as keyof typeof decisions.regionalStaff].marketingStaff}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-100 font-bold">
                                    <td className="p-2 text-black">Total</td>
                                    <td className="p-2 text-right text-black">{totalSalesReps}</td>
                                    <td className="p-2 text-right text-black">{totalMarketingStaff}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </GlassCard>

            {/* Financial Performance Charts */}
            {history.length > 0 && (
                <div className="grid grid-cols-2 gap-6">
                    {/* Cash Balance Chart */}
                    <GlassCard className="p-6 bg-white">
                        <h3 className="text-lg font-bold text-black mb-4">Cash Balance</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={cashData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="quarter" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        formatter={(value: number) => [`£${value.toLocaleString()}`, 'Cash']}
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                                    />
                                    <Line type="monotone" dataKey="cash" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    {/* Net Profit Chart */}
                    <GlassCard className="p-6 bg-white">
                        <h3 className="text-lg font-bold text-black mb-4">Net Income</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={profitData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="quarter" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        formatter={(value: number) => [`£${value.toLocaleString()}`, 'Profit']}
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                                    />
                                    <Bar dataKey="profit" fill="#6b7280" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Sales by Product Charts */}
            {history.length > 0 && (
                <GlassCard className="p-6 bg-white">
                    <h3 className="text-lg font-bold text-black mb-4">Units Sold - All Products</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="quarter" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                                <Bar dataKey="units" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            )}

            {/* Profit & Loss Statement */}
            {latestQuarter && (
                <GlassCard className="p-6 bg-white">
                    <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2 border-b pb-3">
                        <DollarSign size={18} />
                        PROFIT AND LOSS STATEMENT
                    </h3>

                    <table className="w-full">
                        <tbody className="text-sm">
                            <PLRow label="Sales Revenue" value={latestQuarter.financials.revenue} bold />
                            <PLRow label="  Manufacturing Wages" value={-latestQuarter.financials.expenses.personnel} indent />
                            <PLRow label="  Cost of Goods Sold" value={-latestQuarter.financials.cogs} indent />
                            <PLRow label="Gross Profit" value={latestQuarter.financials.grossProfit} bold highlight />

                            <tr><td colSpan={2} className="py-2"></td></tr>

                            <PLRow label="  Marketing Spend" value={-latestQuarter.financials.expenses.marketing} indent />
                            <PLRow label="  Salesforce Salaries" value={-latestQuarter.financials.expenses.salesforce} indent />
                            <PLRow label="  Depreciation" value={-latestQuarter.financials.expenses.depreciation} indent />
                            <PLRow label="  Interest" value={-latestQuarter.financials.expenses.interest} indent />

                            <tr><td colSpan={2} className="py-2"></td></tr>

                            <PLRow label="Profit Before Tax" value={latestQuarter.financials.netProfit + latestQuarter.financials.expenses.tax} bold />
                            <PLRow label="  Tax" value={-latestQuarter.financials.expenses.tax} indent />
                            <PLRow label="Net Profit" value={latestQuarter.financials.netProfit} bold highlight final />
                        </tbody>
                    </table>
                </GlassCard>
            )}
        </motion.div>
    );
}

function PLRow({ label, value, bold, indent, highlight, final }: { label: string; value: number; bold?: boolean; indent?: boolean; highlight?: boolean; final?: boolean }) {
    return (
        <tr className={`${highlight ? 'bg-gray-100' : ''} ${final ? 'border-t-2 border-black' : ''}`}>
            <td className={`py-2 ${bold ? 'font-bold text-black' : 'text-gray-600'} ${indent ? 'pl-6' : ''}`}>
                {label}
            </td>
            <td className={`py-2 text-right font-mono ${bold ? 'font-bold' : ''} ${value < 0 ? 'text-red-600' : 'text-black'}`}>
                £{Math.abs(value).toLocaleString()}
            </td>
        </tr>
    );
}
