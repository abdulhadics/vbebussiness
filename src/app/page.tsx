'use client';
import { CompanyHeader } from "@/components/dashboard/CompanyHeader";
import { CompanySwitcher } from "@/components/dashboard/CompanySwitcher";
import { MarketingDecisions } from "@/components/dashboard/MarketingDecisions";
import { OperationsDecisions } from "@/components/dashboard/OperationsDecisions";
import { SalesDecisions } from "@/components/dashboard/SalesDecisions";
import { FinanceDashboard } from "@/components/dashboard/FinanceDashboard";
import { ManagementReport } from "@/components/dashboard/ManagementReport";
import { QuarterlyReport } from "@/components/dashboard/QuarterlyReport";
import { WaitingOverlay } from "@/components/dashboard/WaitingOverlay";
import { LockedFormGuard } from "@/components/dashboard/LockedFormGuard";
import { ProcessingOverlay } from "@/components/ui/ProcessingOverlay";
import { GameModeSelect } from "@/components/GameModeSelect";
import { useGameStore, AVAILABLE_COMPANIES } from "@/store/game-store";
import { Megaphone, Cog, Users, BarChart3, FileText, RotateCcw, Rocket, Printer } from "lucide-react";
import { useState } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import { motion, AnimatePresence } from "framer-motion";

type TabType = 'marketing' | 'sales' | 'operations' | 'finance' | 'report';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('marketing');
  const [isProcessing, setIsProcessing] = useState(false);

  const gameMode = useGameStore((state) => state.gameMode);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const activeCompanyId = useGameStore((state) => state.activeCompanyId);
  const companyStates = useGameStore((state) => state.companyStates);
  const companyStatuses = useGameStore((state) => state.companyStatuses);
  const advanceQuarter = useGameStore((state) => state.advanceQuarter);
  const resetGame = useGameStore((state) => state.resetGame);

  const gameState = companyStates[activeCompanyId];
  const currentStatus = companyStatuses[activeCompanyId];
  const companyInfo = AVAILABLE_COMPANIES.find(c => c.id === activeCompanyId);

  const handleExecute = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    advanceQuarter();
    setIsProcessing(false);
  };

  const tabs = [
    { id: 'marketing' as const, label: 'Marketing', icon: <Megaphone size={18} /> },
    { id: 'sales' as const, label: 'Sales', icon: <Users size={18} /> },
    { id: 'operations' as const, label: 'Operations', icon: <Cog size={18} /> },
    { id: 'finance' as const, label: 'Finance', icon: <BarChart3 size={18} /> },
    { id: 'report' as const, label: 'Management Report', icon: <FileText size={18} /> },
  ];

  // Show game mode selection if not selected
  if (!gameMode) {
    return (
      <ClientOnly>
        <GameModeSelect onSelect={(mode) => setGameMode(mode)} />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <main className="min-h-screen bg-slate-950 pb-40">
        {/* Processing Overlay */}
        <ProcessingOverlay
          isProcessing={isProcessing}
          onComplete={() => setIsProcessing(false)}
        />

        <div className="max-w-[1400px] mx-auto pt-8 px-6">
          {/* Company Switcher - Only show in Multiplayer */}
          {gameMode === 'multiplayer' && <CompanySwitcher />}

          {/* Company Header */}
          <CompanyHeader />

          {/* Modals */}
          <QuarterlyReport />
          <WaitingOverlay />

          {/* Tab Navigation - Black/White Style */}
          <div className="bg-white rounded-2xl mb-8 p-2 flex gap-2 sticky top-4 z-40 shadow-lg">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex-1 flex items-center justify-center gap-2 
                    px-4 py-3 
                    rounded-xl 
                    font-bold text-sm 
                    transition-all duration-200
                    ${isActive
                      ? 'bg-black text-white'
                      : 'text-gray-500 hover:text-black hover:bg-gray-100'
                    }
                  `}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Content Area */}
          <LockedFormGuard>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCompanyId}-${activeTab}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {activeTab === 'marketing' && <MarketingDecisions />}
                {activeTab === 'sales' && <SalesDecisions />}
                {activeTab === 'operations' && <OperationsDecisions />}
                {activeTab === 'finance' && <FinanceDashboard />}
                {activeTab === 'report' && <ManagementReport />}
              </motion.div>
            </AnimatePresence>
          </LockedFormGuard>
        </div>

        {/* Fixed Footer Action Bar - Black/White Style */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-2xl"
        >
          <div className="max-w-[1400px] mx-auto flex justify-between items-center">
            {/* Left Side - Status */}
            <div className="flex items-center gap-4">
              {/* Company Status Pill */}
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-gray-100">
                <div
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: companyInfo?.color }}
                />
                <span className="text-sm font-bold text-black">
                  {gameState?.player.companyName}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-sm font-mono text-gray-600">
                  Quarter {gameState?.market.quarter}
                </span>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  if (confirm('Reset simulation? All progress will be lost.')) {
                    resetGame();
                    setGameMode('single'); // Force back to mode select
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>

            {/* Right Side - RUN QUARTER Button */}
            <motion.button
              onClick={handleExecute}
              disabled={isProcessing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center gap-3
                px-10 py-4
                rounded-full
                font-bold text-base
                uppercase tracking-wider
                transition-all duration-200
                ${isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800 shadow-lg'
                }
              `}
            >
              <Rocket size={20} />
              <span>Run Quarter</span>
            </motion.button>
          </div>
        </motion.div>
      </main>
    </ClientOnly>
  );
}
