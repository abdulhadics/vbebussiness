'use client';
import { useGameStore } from "@/store/game-store";
import { formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export function KPIBoard() {
    const { gameState } = useGameStore();

    // Fallback data if no history yet
    const data = gameState.history.length > 0 ? gameState.history : [{ quarter: 0, revenue: 0, profit: 0, stockPrice: 50 }];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Market Share */}
            <div className="glass-card p-6 flex flex-col items-center justify-center">
                <h3 className="text-gray-400 text-sm uppercase mb-4 w-full text-center">Market Share</h3>
                <div className="w-24 h-24">
                    <CircularProgressbar
                        value={gameState.marketShare}
                        text={`${gameState.marketShare.toFixed(1)}%`}
                        styles={buildStyles({
                            pathColor: '#00e5ff',
                            textColor: '#fff',
                            trailColor: 'rgba(255,255,255,0.1)',
                            textSize: '18px'
                        })}
                    />
                </div>
            </div>

            {/* Brand Equity */}
            <div className="glass-card p-6 flex flex-col items-center justify-center">
                <h3 className="text-gray-400 text-sm uppercase mb-4 w-full text-center">Brand Equity</h3>
                <div className="w-24 h-24">
                    <CircularProgressbar
                        value={gameState.brandEquity}
                        maxValue={100}
                        text={`${Math.round(gameState.brandEquity)}`}
                        styles={buildStyles({
                            pathColor: '#bd00ff',
                            textColor: '#fff',
                            trailColor: 'rgba(255,255,255,0.1)',
                            textSize: '18px'
                        })}
                    />
                </div>
            </div>

            {/* Financial Trend Chart */}
            <div className="glass-card p-4 col-span-1 md:col-span-2 relative">
                <h3 className="text-gray-400 text-sm uppercase mb-2">Financial Trend</h3>
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="quarter" hide />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                itemStyle={{ color: '#ccc' }}
                                formatter={(value: number) => formatCurrency(value)}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#00e5ff" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                            <Line type="monotone" dataKey="profit" stroke="#ff4d4d" strokeWidth={2} dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between px-2 mt-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#00e5ff] rounded-full"></div> Revenue</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#ff4d4d] rounded-full"></div> Profit</div>
                </div>
            </div>
        </div>
    )
}
