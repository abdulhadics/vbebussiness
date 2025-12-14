'use client';
import { ReactNode } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DecisionModuleProps {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    projectedImpact?: { label: string, amount: number };
}

export function DecisionModule({ title, icon, children, projectedImpact }: DecisionModuleProps) {
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-blue-900/50 to-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon && <div className="text-blue-400">{icon}</div>}
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">{title}</h3>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 space-y-6 flex-grow">
                {children}
            </div>

            {/* Projected Impact Footer (Mini-Bar visualization) */}
            {projectedImpact && (
                <div className="bg-slate-900/50 p-4 border-t border-slate-700">
                    <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-slate-400">Projected Impact</span>
                        <span className={`font-mono font-bold ${projectedImpact.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {projectedImpact.amount > 0 ? '+' : ''}{formatCurrency(projectedImpact.amount)}
                        </span>
                    </div>
                    {/* Mini Bar Chart */}
                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, Math.abs(projectedImpact.amount) / 1000)}%` }} // Dummy scale for viz
                            className={`h-full ${projectedImpact.amount >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
