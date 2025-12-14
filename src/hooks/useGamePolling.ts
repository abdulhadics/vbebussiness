import { useEffect, useRef, useCallback } from 'react';
import { useGameStore, CompanyStatus } from '@/store/game-store';

interface GameStatusResponse {
    gameId: string;
    exists: boolean;
    currentQuarter: number;
    companies: {
        companyId: string;
        status: 'PENDING' | 'SUBMITTED';
        submittedAt?: string;
    }[];
    stats: {
        total: number;
        submitted: number;
        pending: number;
    };
    allSubmitted: boolean;
    message: string;
}

/**
 * Hook for polling game status from the server.
 * Automatically updates the Zustand store with latest company statuses.
 * 
 * @param gameId - The game ID to poll
 * @param enabled - Whether polling should be active
 * @param intervalMs - Polling interval in milliseconds (default: 3000)
 */
export function useGamePolling(
    gameId: string | null,
    enabled: boolean = true,
    intervalMs: number = 3000
) {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const updateCompanyStatus = useGameStore((state) => state.updateCompanyStatus);
    const setWaitingState = useGameStore((state) => state.setWaitingState);

    const fetchStatus = useCallback(async () => {
        if (!gameId) return;

        try {
            const response = await fetch(`/api/game/status?gameId=${encodeURIComponent(gameId)}`);

            if (!response.ok) {
                console.warn('Failed to fetch game status:', response.status);
                return;
            }

            const data: GameStatusResponse = await response.json();

            // Update company statuses in the store
            if (data.companies) {
                data.companies.forEach(company => {
                    updateCompanyStatus(
                        company.companyId,
                        company.status as CompanyStatus
                    );
                });
            }

            // Update waiting state
            if (data.stats) {
                const isWaiting = data.stats.submitted > 0 && !data.allSubmitted;
                setWaitingState(
                    isWaiting,
                    isWaiting ? data.message : ''
                );
            }

            // If all submitted, trigger simulation (handled by server)
            if (data.allSubmitted) {
                console.log('All companies submitted. Simulation triggered.');
            }

        } catch (error) {
            console.error('Polling error:', error);
        }
    }, [gameId, updateCompanyStatus, setWaitingState]);

    useEffect(() => {
        if (!enabled || !gameId) {
            // Clear any existing interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Initial fetch
        fetchStatus();

        // Start polling
        intervalRef.current = setInterval(fetchStatus, intervalMs);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [enabled, gameId, intervalMs, fetchStatus]);

    return { refetch: fetchStatus };
}

/**
 * Simple interval hook for custom polling scenarios.
 */
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval
    useEffect(() => {
        if (delay === null) return;

        const id = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(id);
    }, [delay]);
}
