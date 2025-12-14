'use client';
import { useGameStore, AVAILABLE_COMPANIES } from "@/store/game-store";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { Users, MapPin, TrendingUp, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';

export function SalesDecisions() {
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);
    const drafts = useGameStore((state) => state.drafts);
    const companyStates = useGameStore((state) => state.companyStates);
    const setRegionalStaff = useGameStore((state) => state.setRegionalStaff);

    const decisions = drafts[activeCompanyId];
    const gameState = companyStates[activeCompanyId];
    const companyInfo = AVAILABLE_COMPANIES.find(c => c.id === activeCompanyId);

    if (!decisions || !gameState) return null;

    const regions = [
        { id: 'south' as const, name: 'South', emoji: '🌴', color: '#10b981' },
        { id: 'west' as const, name: 'West', emoji: '🌅', color: '#f59e0b' },
        { id: 'north' as const, name: 'North', emoji: '❄️', color: '#3b82f6' },
        { id: 'export' as const, name: 'Export', emoji: '🌍', color: '#8b5cf6' },
    ];

    // Calculate totals
    const totalSalesReps = Object.values(decisions.regionalStaff).reduce((sum, r) => sum + r.salesReps, 0);
    const totalMarketingStaff = Object.values(decisions.regionalStaff).reduce((sum, r) => sum + r.marketingStaff, 0);

    // Sales data from history for charts
    const history = gameState.player.history;
    const salesChartData = history.map((q, i) => ({
        quarter: `Q${q.quarter}`,
        units: q.metrics.unitsSold,
        revenue: q.financials.revenue,
    }));

    // Regional distribution data for pie chart
    const regionalData = regions.map(r => ({
        name: r.name,
        salesReps: decisions.regionalStaff[r.id].salesReps,
        marketingStaff: decisions.regionalStaff[r.id].marketingStaff,
        color: r.color,
    }));

    // Salesforce cost
    const salesforceCost = totalSalesReps * 2500 + totalMarketingStaff * 3000;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            {/* Header Stats */}
            <div className="grid grid-cols-4 gap-4">
                <StatsCard
                    label="Total Sales Reps"
                    value={totalSalesReps}
                    icon={<Users size={18} />}
                    color="#10b981"
                />
                <StatsCard
                    label="Marketing Staff"
                    value={totalMarketingStaff}
                    icon={<Users size={18} />}
                    color="#8b5cf6"
                />
                <StatsCard
                    label="Regions Active"
                    value={4}
                    icon={<MapPin size={18} />}
                    color="#f59e0b"
                />
                <StatsCard
                    label="Monthly Cost"
                    value={`£${salesforceCost.toLocaleString()}`}
                    icon={<TrendingUp size={18} />}
                    color="#ef4444"
                    isText
                />
            </div>

            {/* Regional Staff Management */}
            <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Regional Staff Allocation</h3>
                        <p className="text-sm text-slate-400">Assign sales reps and marketing staff per region</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {regions.map((region) => (
                        <RegionStaffCard
                            key={region.id}
                            region={region}
                            salesReps={decisions.regionalStaff[region.id].salesReps}
                            marketingStaff={decisions.regionalStaff[region.id].marketingStaff}
                            onChangeSalesReps={(v) => setRegionalStaff(region.id, 'salesReps', v)}
                            onChangeMarketingStaff={(v) => setRegionalStaff(region.id, 'marketingStaff', v)}
                        />
                    ))}
                </div>
            </GlassCard>

            {/* Sales Charts */}
            {history.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Units Sold Chart */}
                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <BarChart3 size={18} className="text-emerald-400" />
                            Units Sold by Quarter
                        </h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="quarter" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            border: '1px solid #374151',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Bar dataKey="units" fill="#10b981" radius={[4, 4, 0, 0]} name="Units" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    {/* Revenue Chart */}
                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={18} className="text-indigo-400" />
                            Revenue Trend
                        </h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="quarter" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            border: '1px solid #374151',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        formatter={(value: number) => [`£${value.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        dot={{ fill: '#6366f1', strokeWidth: 2 }}
                                        name="Revenue"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Staff Distribution Pie Chart */}
            <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Staff Distribution by Region</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div style={{ height: '350px', width: '100%' }}>
                        <h4 className="text-sm text-slate-400 mb-2 text-center">Sales Reps</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={regionalData}
                                    dataKey="salesReps"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {regionalData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ height: '350px', width: '100%' }}>
                        <h4 className="text-sm text-slate-400 mb-2 text-center">Marketing Staff</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={regionalData}
                                    dataKey="marketingStaff"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {regionalData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}

function StatsCard({ label, value, icon, color, isText }: { label: string; value: number | string; icon: React.ReactNode; color: string; isText?: boolean }) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-5 shadow-lg"
        >
            <div className="flex items-center gap-2 mb-2" style={{ color }}>
                {icon}
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</span>
            </div>
            <div className="text-3xl font-bold text-black font-mono">
                {isText ? value : value.toLocaleString()}
            </div>
        </motion.div>
    );
}

interface RegionStaffCardProps {
    region: { id: string; name: string; emoji: string; color: string };
    salesReps: number;
    marketingStaff: number;
    onChangeSalesReps: (v: number) => void;
    onChangeMarketingStaff: (v: number) => void;
}

function RegionStaffCard({ region, salesReps, marketingStaff, onChangeSalesReps, onChangeMarketingStaff }: RegionStaffCardProps) {
    return (
        <div
            className="bg-white rounded-2xl p-5 border-l-4 shadow-md"
            style={{ borderColor: region.color }}
        >
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{region.emoji}</span>
                <h4 className="font-bold text-black">{region.name}</h4>
            </div>

            <div className="space-y-4">
                {/* Sales Reps Input */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                        Sales Reps
                    </label>
                    <input
                        type="number"
                        value={salesReps}
                        min={0}
                        max={20}
                        onChange={(e) => onChangeSalesReps(Number(e.target.value))}
                        className="w-full bg-gray-100 text-black text-xl font-bold font-mono p-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                </div>

                {/* Marketing Staff Input */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                        Marketing Staff
                    </label>
                    <input
                        type="number"
                        value={marketingStaff}
                        min={0}
                        max={10}
                        onChange={(e) => onChangeMarketingStaff(Number(e.target.value))}
                        className="w-full bg-gray-100 text-black text-xl font-bold font-mono p-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Cost Display */}
            <div className="mt-4 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">Monthly Cost: </span>
                <span className="font-bold text-black">
                    £{(salesReps * 2500 + marketingStaff * 3000).toLocaleString()}
                </span>
            </div>
        </div>
    );
}
