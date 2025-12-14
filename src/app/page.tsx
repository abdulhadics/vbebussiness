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
import { GameControlsDock } from "@/components/ui/GameControlsDock";
import { GameModeSelect } from "@/components/GameModeSelect";
import { useGameStore, AVAILABLE_COMPANIES } from "@/store/game-store";
import { Megaphone, Cog, Users, BarChart3, FileText } from "lucide-react";
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

  const handleSave = () => {
    alert('✅ Decisions saved for this quarter!');
  };

  const handleDiscard = () => {
    if (confirm('Discard all changes for this quarter?')) {
      window.location.reload();
    }
  };

  const handleReset = () => {
    if (confirm('🔄 Reset entire simulation? All progress will be lost!')) {
      resetGame();
      setGameMode(null);
    }
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
      <main className="min-h-screen bg-slate-950 pb-40 flex flex-col relative">
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

        {/* Premium Floating Glass Dock */}
        <GameControlsDock
          onRunQuarter={handleExecute}
          onSave={handleSave}
          onDiscard={handleDiscard}
          onReset={handleReset}
          isProcessing={isProcessing}
          isLocked={currentStatus === 'SUBMITTED' || currentStatus === 'LOCKED'}
          currentQuarter={gameState?.market.quarter}
          companyName={gameState?.player.companyName}
        />
      </main>
    </ClientOnly>
  );
}

