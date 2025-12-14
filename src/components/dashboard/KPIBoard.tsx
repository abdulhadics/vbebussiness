'use client';
import { useGameStore } from "@/store/game-store";
import { formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { QuarterResult } from '@/lib/types';

export function KPIBoard() {
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);
    const companyStates = useGameStore((state) => state.companyStates);

    const gameState = companyStates[activeCompanyId];
    if (!gameState) return null;

    // Build chart data from history
    const data = gameState.player.history.length > 0
        ? gameState.player.history.map((q: QuarterResult) => ({
            quarter: q.quarter,
            revenue: q.financials.revenue,
            profit: q.financials.netProfit,
            stockPrice: q.metrics.stockPrice
        }))
        : [{ quarter: 0, revenue: 0, profit: 0, stockPrice: 1 }];

    // Get market share from last quarter or default
    const lastQuarter = gameState.player.history[gameState.player.history.length - 1];
    const marketShare = lastQuarter?.metrics.marketShare || 25;
    const morale = gameState.player.morale || 75;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Market Share */}
            <div className="glass-panel p-6 flex flex-col items-center justify-center rounded-xl">
                <h3 className="text-slate-400 text-sm uppercase mb-4 w-full text-center font-bold tracking-wider">Market Share</h3>
                <div className="w-24 h-24">
                    <CircularProgressbar
                        value={marketShare}
                        text={`${marketShare.toFixed(1)}%`}
                        styles={buildStyles({
                            pathColor: '#10b981',
                            textColor: '#fff',
                            trailColor: 'rgba(255,255,255,0.1)',
                            textSize: '18px'
                        })}
                    />
                </div>
            </div>

            {/* Employee Morale */}
            <div className="glass-panel p-6 flex flex-col items-center justify-center rounded-xl">
                <h3 className="text-slate-400 text-sm uppercase mb-4 w-full text-center font-bold tracking-wider">Employee Morale</h3>
                <div className="w-24 h-24">
                    <CircularProgressbar
                        value={morale}
                        maxValue={100}
                        text={`${Math.round(morale)}%`}
                        styles={buildStyles({
                            pathColor: morale > 60 ? '#10b981' : morale > 40 ? '#f59e0b' : '#ef4444',
                            textColor: '#fff',
                            trailColor: 'rgba(255,255,255,0.1)',
                            textSize: '18px'
                        })}
                    />
                </div>
            </div>

            {/* Financial Trend Chart */}
            <div className="glass-panel p-4 col-span-1 md:col-span-2 relative rounded-xl">
                <h3 className="text-slate-400 text-sm uppercase mb-2 font-bold tracking-wider">Financial Trend</h3>
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="quarter" hide />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8 }}
                                itemStyle={{ color: '#94a3b8' }}
                                formatter={(value: number) => formatCurrency(value)}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Revenue" />
                            <Line type="monotone" dataKey="profit" stroke="#ef4444" strokeWidth={2} dot={false} name="Profit" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between px-2 mt-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Revenue</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> Profit</div>
                </div>
            </div>
        </div>
    )
}
