'use client';
import { useGameStore } from "@/store/game-store";
import { formatCurrency } from "@/lib/utils";
import { DecisionModule } from "../ui/DecisionModule";
import { HighVisInput } from "../ui/HighVisInput";
import { DollarSign, Users, Megaphone, FlaskConical, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function DecisionsPanel() {
    const gameState = useGameStore((state) => state.gameState);
    const decisions = useGameStore((state) => state.decisions);
    const advanceQuarter = useGameStore((state) => state.advanceQuarter);
    const setProductDecision = useGameStore((state) => state.setProductDecision);

    // Use product 1 as the primary product for this legacy panel
    const productDecisions = decisions.products.p1;
    const totalMarketing = Object.values(productDecisions.marketing).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                        Decision Cockpit
                    </h2>
                    <div className="text-sm text-slate-400">Quarter {gameState.market.quarter} | Status: <span className="text-emerald-400 font-bold uppercase">Active</span></div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={advanceQuarter}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest rounded shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all border border-blue-400/20"
                >
                    Execute Quarter <ArrowRight size={18} />
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. SALES Module */}
                <DecisionModule title="Sales Strategy" icon={<DollarSign size={18} />} projectedImpact={{ label: 'Price', amount: productDecisions.price }}>
                    <HighVisInput
                        label="Unit Price"
                        prefix="£"
                        value={productDecisions.price}
                        min={50} max={300} step={1}
                        onChange={(v) => setProductDecision('p1', 'price', v)}
                        helperText={productDecisions.price > 150 ? "Premium" : "Budget"}
                    />
                    <div className="text-xs text-slate-500 mt-2">
                        Market Target: <span className="text-slate-300 font-mono">£100-200</span>
                    </div>
                </DecisionModule>

                {/* 2. PRODUCTION Module */}
                <DecisionModule title="Production & Ops" icon={<Users size={18} />} projectedImpact={{ label: 'Target', amount: productDecisions.production }}>
                    <HighVisInput
                        label="Production Vol"
                        value={productDecisions.production}
                        min={0} max={10000} step={100}
                        onChange={(v) => setProductDecision('p1', 'production', v)}
                        helperText={`${Math.round((productDecisions.production / 10000) * 100)}% Cap`}
                    />
                    <div className="text-xs text-slate-500 mt-2">
                        Current Stock: <span className="text-slate-300 font-mono">{gameState.player.inventory.p1} units</span>
                    </div>
                </DecisionModule>

                {/* 3. MARKETING Module */}
                <DecisionModule title="Marketing" icon={<Megaphone size={18} />} projectedImpact={{ label: 'Budget', amount: totalMarketing }}>
                    <HighVisInput
                        label="South Region"
                        prefix="£"
                        value={productDecisions.marketing.south}
                        min={0} max={50000} step={1000}
                        onChange={(v) => setProductDecision('p1', 'marketing', { ...productDecisions.marketing, south: v })}
                        helperText={totalMarketing > 30000 ? "Aggressive" : "Conservative"}
                    />
                    <div className="text-xs text-slate-500 mt-2">
                        Total Spend: <span className="text-slate-300 font-mono">{formatCurrency(totalMarketing)}</span>
                    </div>
                </DecisionModule>

                {/* 4. WORKFORCE Module */}
                <DecisionModule title="Workforce" icon={<FlaskConical size={18} />} projectedImpact={{ label: 'Employees', amount: gameState.player.employees }}>
                    <HighVisInput
                        label="Hourly Wage"
                        prefix="£"
                        value={decisions.personnel.workerWage}
                        min={8} max={25} step={0.5}
                        onChange={() => { }}
                        helperText={decisions.personnel.workerWage > 15 ? "Above Market" : "Market Rate"}
                    />
                    <div className="text-xs text-slate-500 mt-2">
                        Morale: <span className="text-slate-300 font-mono">{gameState.player.morale}%</span>
                    </div>
                </DecisionModule>
            </div>
        </div>
    )
}
