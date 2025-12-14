'use client';
import { useGameStore } from "@/store/game-store";
import { SimulationEngine } from "@/lib/simulation-engine";
import { formatCurrency } from "@/lib/utils";
import { DecisionModule } from "../ui/DecisionModule";
import { HighVisInput } from "../ui/HighVisInput";
import { DollarSign, Users, Megaphone, FlaskConical, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function DecisionsPanel() {
    const { gameState, currentDecisions, setDecision, advanceQuarter } = useGameStore();

    const prediction = SimulationEngine.predictOutcome(gameState, currentDecisions);
    const prevProfit = gameState.history[gameState.history.length - 1]?.profit || 0;
    const profitChange = prediction.estimatedProfit - prevProfit;

    const getPriceHelper = (price: number) => {
        if (price < gameState.competitorPrice * 0.9) return "Discounter";
        if (price > gameState.competitorPrice * 1.1) return "Premium";
        return "Market Avg";
    };

    const getMarketingHelper = (budget: number) => {
        if (budget > 50000) return "Aggressive";
        if (budget < 10000) return "Conservative";
        return "Balanced";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                        Decision Cockpit
                    </h2>
                    <div className="text-sm text-slate-400">Quarter {gameState.currentQuarter} | Status: <span className="text-emerald-400 font-bold uppercase">Active</span></div>
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
                <DecisionModule title="Sales Strategy" icon={<DollarSign size={18} />} projectedImpact={{ label: 'Revenue', amount: prediction.estimatedRevenue }}>
                    <HighVisInput
                        label="Unit Price"
                        prefix="$"
                        value={currentDecisions.price}
                        min={50} max={300} step={1}
                        onChange={(v) => setDecision('price', v)}
                        helperText={getPriceHelper(currentDecisions.price)}
                    />
                    <div className="text-xs text-slate-500 mt-2">
                        Competitor Avg: <span className="text-slate-300 font-mono">${gameState.competitorPrice.toFixed(0)}</span>
                    </div>
                </DecisionModule>

                {/* 2. PRODUCTION Module */}
                <DecisionModule title="Production & Ops" icon={<Users size={18} />} projectedImpact={{ label: 'Inventory', amount: gameState.inventory + currentDecisions.production }}>
                    <HighVisInput
                        label="Production Vol"
                        value={currentDecisions.production}
                        min={1000} max={20000} step={100}
                        onChange={(v) => setDecision('production', v)}
                        helperText={`${Math.round((currentDecisions.production / 20000) * 100)}% Cap`}
                    />
                    <div className="text-xs text-slate-500 mt-2">
                        Current Stock: <span className="text-slate-300 font-mono">{gameState.inventory} units</span>
                    </div>
                </DecisionModule>

                {/* 3. MARKETING Module */}
                <DecisionModule title="Marketing" icon={<Megaphone size={18} />} projectedImpact={{ label: 'Brand', amount: gameState.brandEquity }}>
                    <HighVisInput
                        label="Ad Spend"
                        prefix="$"
                        value={currentDecisions.marketingBudget}
                        min={0} max={100000} step={1000}
                        onChange={(v) => setDecision('marketingBudget', v)}
                        helperText={getMarketingHelper(currentDecisions.marketingBudget)}
                    />
                    <div className="text-xs text-slate-500 mt-2">
                        Brand Equity: <span className="text-slate-300 font-mono">{Math.round(gameState.brandEquity)}pts</span>
                    </div>
                </DecisionModule>

                {/* 4. R&D Module */}
                <DecisionModule title="Research & Dev" icon={<FlaskConical size={18} />} projectedImpact={{ label: 'Cost Redux', amount: -currentDecisions.rAndDBudget }}>
                    <HighVisInput
                        label="Innovation Budget"
                        prefix="$"
                        value={currentDecisions.rAndDBudget}
                        min={0} max={100000} step={1000}
                        onChange={(v) => setDecision('rAndDBudget', v)}
                        helperText={currentDecisions.rAndDBudget > 20000 ? "High Innovation" : "Maintenance"}
                    />
                    <div className="text-xs text-slate-500 mt-2">
                        Current Unit Cost: <span className="text-slate-300 font-mono">${gameState.unitCost.toFixed(2)}</span>
                    </div>
                </DecisionModule>
            </div>
        </div>
    )
}
