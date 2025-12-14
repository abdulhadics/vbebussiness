'use client';
import { CompanyHeader } from "@/components/dashboard/CompanyHeader";
import { MarketingDecisions } from "@/components/dashboard/MarketingDecisions";
import { OperationsDecisions } from "@/components/dashboard/OperationsDecisions";
import { FinanceDashboard } from "@/components/dashboard/FinanceDashboard";
import { QuarterlyReport } from "@/components/dashboard/QuarterlyReport";
import { useGameStore } from "@/store/game-store";
import { Rocket, BarChart3, Megaphone, Cog, FileText, RotateCcw } from "lucide-react";
import { useState } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import { motion } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'marketing' | 'operations' | 'finance'>('marketing');
  const advanceQuarter = useGameStore((state) => state.advanceQuarter);
  const openReport = useGameStore((state) => state.openReport);
  const resetGame = useGameStore((state) => state.resetGame);
  const gameState = useGameStore((state) => state.gameState);

  const hasHistory = gameState.player.history.length > 0;

  const tabs = [
    { id: 'marketing' as const, label: 'Marketing', icon: <Megaphone size={16} /> },
    { id: 'operations' as const, label: 'Operations', icon: <Cog size={16} /> },
    { id: 'finance' as const, label: 'Finance', icon: <BarChart3 size={16} /> },
  ];

  return (
    <ClientOnly>
      <main className="min-h-screen pb-32">
        <div className="max-w-[1400px] mx-auto pt-8 px-4">
          <CompanyHeader />
          <QuarterlyReport />

          {/* Tab Navigation - Fintech Style */}
          <div className="glass-panel rounded-xl mb-8 p-2 flex gap-2 sticky top-4 z-40">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-12"
          >
            {activeTab === 'marketing' && <MarketingDecisions />}
            {activeTab === 'operations' && <OperationsDecisions />}
            {activeTab === 'finance' && <FinanceDashboard />}
          </motion.div>

          {/* Footer Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 p-4 z-50">
            <div className="max-w-[1400px] mx-auto flex justify-between items-center">
              {/* Left Side Actions */}
              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-400">
                  <span className="font-mono text-emerald-400 font-bold">Q{gameState.market.quarter}</span>
                  <span className="mx-2">•</span>
                  <span>Ready to execute decisions</span>
                </div>

                {/* View Summary Button */}
                {hasHistory && (
                  <motion.button
                    onClick={openReport}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-bold uppercase tracking-wider hover:bg-violet-500/20 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileText size={16} />
                    View Last Summary
                  </motion.button>
                )}

                {/* Reset Button */}
                <motion.button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset the simulation? All progress will be lost.')) {
                      resetGame();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-sm font-bold uppercase tracking-wider hover:text-white hover:border-slate-600 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw size={16} />
                  Reset
                </motion.button>
              </div>

              {/* Execute Button */}
              <motion.button
                onClick={advanceQuarter}
                className="group relative bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center gap-3 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Rocket size={18} className="relative z-10" />
                <span className="relative z-10">Execute Quarter</span>
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </ClientOnly>
  );
}
