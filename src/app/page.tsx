'use client';
import { CompanyHeader } from "@/components/dashboard/CompanyHeader";
import { CompanySwitcher } from "@/components/dashboard/CompanySwitcher";
import { MarketingDecisions } from "@/components/dashboard/MarketingDecisions";
import { OperationsDecisions } from "@/components/dashboard/OperationsDecisions";
import { FinanceDashboard } from "@/components/dashboard/FinanceDashboard";
import { QuarterlyReport } from "@/components/dashboard/QuarterlyReport";
import { WaitingOverlay } from "@/components/dashboard/WaitingOverlay";
import { LockedFormGuard } from "@/components/dashboard/LockedFormGuard";
import { ProcessingOverlay } from "@/components/ui/ProcessingOverlay";
import { GlassCard } from "@/components/ui/GlassCard";
import { BubbleButton, ExecuteButton } from "@/components/ui/BubbleButton";
import { useGameStore, AVAILABLE_COMPANIES } from "@/store/game-store";
import { Rocket, BarChart3, Megaphone, Cog, FileText, RotateCcw, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'marketing' | 'operations' | 'finance'>('marketing');
  const [isProcessing, setIsProcessing] = useState(false);

  const activeCompanyId = useGameStore((state) => state.activeCompanyId);
  const companyStates = useGameStore((state) => state.companyStates);
  const companyStatuses = useGameStore((state) => state.companyStatuses);
  const advanceQuarter = useGameStore((state) => state.advanceQuarter);
  const submitDecisions = useGameStore((state) => state.submitDecisions);
  const openReport = useGameStore((state) => state.openReport);
  const resetGame = useGameStore((state) => state.resetGame);

  const gameState = companyStates[activeCompanyId];
  const currentStatus = companyStatuses[activeCompanyId];
  const companyInfo = AVAILABLE_COMPANIES.find(c => c.id === activeCompanyId);

  const hasHistory = gameState?.player.history.length > 0;
  const isSubmitted = currentStatus === 'SUBMITTED';

  const handleExecute = async () => {
    setIsProcessing(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    advanceQuarter();
    setIsProcessing(false);
  };

  const tabs = [
    { id: 'marketing' as const, label: 'Marketing', icon: <Megaphone size={18} />, color: 'from-pink-500 to-rose-500' },
    { id: 'operations' as const, label: 'Operations', icon: <Cog size={18} />, color: 'from-blue-500 to-cyan-500' },
    { id: 'finance' as const, label: 'Finance', icon: <BarChart3 size={18} />, color: 'from-amber-500 to-orange-500' },
  ];

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <ClientOnly>
      <main className="min-h-screen pb-40 relative">
        {/* Processing Overlay */}
        <ProcessingOverlay
          isProcessing={isProcessing}
          onComplete={() => setIsProcessing(false)}
        />

        <div className="max-w-[1400px] mx-auto pt-8 px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Company Switcher */}
            <motion.div variants={itemVariants}>
              <CompanySwitcher />
            </motion.div>

            {/* Company Header */}
            <motion.div variants={itemVariants}>
              <CompanyHeader />
            </motion.div>

            {/* Modals */}
            <QuarterlyReport />
            <WaitingOverlay />

            {/* Tab Navigation - Bubble Style */}
            <motion.div
              variants={itemVariants}
              className="glass-card mb-8 p-3 flex gap-3 sticky top-4 z-40"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex-1 flex items-center justify-center gap-3 
                      px-6 py-4 
                      rounded-xl 
                      font-bold text-sm uppercase tracking-wider 
                      transition-all duration-300
                      ${isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {tab.icon}
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 rounded-xl border-2 border-white/20"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Content Area with Lock Guard */}
            <LockedFormGuard>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCompanyId}-${activeTab}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {activeTab === 'marketing' && <MarketingDecisions />}
                  {activeTab === 'operations' && <OperationsDecisions />}
                  {activeTab === 'finance' && <FinanceDashboard />}
                </motion.div>
              </AnimatePresence>
            </LockedFormGuard>
          </motion.div>
        </div>

        {/* Fixed Footer Action Bar */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 glass-card rounded-none border-x-0 border-b-0 p-5 z-50"
        >
          <div className="max-w-[1400px] mx-auto flex justify-between items-center">
            {/* Left Side - Status & Quick Actions */}
            <div className="flex items-center gap-4">
              {/* Company Status Pill */}
              <div
                className="flex items-center gap-3 px-5 py-2.5 rounded-full border"
                style={{
                  backgroundColor: `${companyInfo?.color}10`,
                  borderColor: `${companyInfo?.color}30`
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: companyInfo?.color }}
                />
                <span className="text-sm font-bold text-white">
                  {gameState?.player.companyName}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-sm font-mono text-emerald-400">
                  Q{gameState?.market.quarter}
                </span>
              </div>

              {/* Quick Actions */}
              {hasHistory && (
                <BubbleButton
                  variant="ghost"
                  size="sm"
                  onClick={openReport}
                  icon={<FileText size={16} />}
                >
                  View Report
                </BubbleButton>
              )}

              <BubbleButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('Reset simulation? All progress will be lost.')) {
                    resetGame();
                  }
                }}
                icon={<RotateCcw size={16} />}
              >
                Reset
              </BubbleButton>
            </div>

            {/* Right Side - Primary Actions */}
            <div className="flex gap-4 items-center">
              {/* Submit Button (Multiplayer) */}
              <BubbleButton
                variant="secondary"
                onClick={() => submitDecisions()}
                disabled={isSubmitted}
                icon={<Send size={16} />}
              >
                {isSubmitted ? 'Submitted' : 'Submit'}
              </BubbleButton>

              {/* Execute Button (Primary Action) */}
              <ExecuteButton
                onClick={handleExecute}
                disabled={isProcessing}
              >
                Execute Quarter
              </ExecuteButton>
            </div>
          </div>
        </motion.div>
      </main>
    </ClientOnly>
  );
}
