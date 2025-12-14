'use client';
import { useGameStore } from "@/store/game-store";
import { Lock } from "lucide-react";

interface LockedFormGuardProps {
    children: React.ReactNode;
}

export function LockedFormGuard({ children }: LockedFormGuardProps) {
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);
    const companyStatuses = useGameStore((state) => state.companyStatuses);

    const currentStatus = companyStatuses[activeCompanyId];
    const isLocked = currentStatus === 'SUBMITTED' || currentStatus === 'LOCKED';

    if (!isLocked) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            {/* Locked Overlay */}
            <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Lock size={32} className="text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Decisions Locked</h3>
                    <p className="text-slate-400 text-sm max-w-xs">
                        This company has submitted decisions for this quarter.
                        Waiting for other companies to finish before the simulation runs.
                    </p>
                </div>
            </div>

            {/* Disabled content underneath */}
            <div className="pointer-events-none opacity-30">
                {children}
            </div>
        </div>
    );
}

// Hook to check if current company is locked
export function useIsCompanyLocked(): boolean {
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);
    const companyStatuses = useGameStore((state) => state.companyStatuses);
    const status = companyStatuses[activeCompanyId];
    return status === 'SUBMITTED' || status === 'LOCKED';
}
