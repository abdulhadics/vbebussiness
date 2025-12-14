import { create } from 'zustand';
import { GameState, DetailedDecisions, INITIAL_GAME_STATE, INITIAL_DECISIONS } from '@/lib/types';
import { SimulationEngine } from '@/lib/simulation-engine';

// Company types
export type CompanyStatus = 'PENDING' | 'SUBMITTED' | 'LOCKED';

export interface CompanyInfo {
    id: string;
    name: string;
    color: string; // For visual differentiation
}

// Available companies in the simulation
export const AVAILABLE_COMPANIES: CompanyInfo[] = [
    { id: 'company1', name: 'Company 1', color: '#10b981' }, // Emerald
    { id: 'company2', name: 'Company 2', color: '#8b5cf6' }, // Violet
    { id: 'company3', name: 'Company 3', color: '#f59e0b' }, // Amber
    { id: 'company4', name: 'Company 4', color: '#3b82f6' }, // Blue
];

interface GameStore {
    // Multi-company state
    activeCompanyId: string;
    drafts: Record<string, DetailedDecisions>; // Decision drafts per company
    companyStatuses: Record<string, CompanyStatus>; // Status per company
    companyStates: Record<string, GameState>; // Game state per company

    // UI state
    showReport: boolean;
    isWaitingForOthers: boolean;
    waitingMessage: string;

    // Current active company helpers (computed-like)
    getActiveDecisions: () => DetailedDecisions;
    getActiveGameState: () => GameState;
    getActiveCompanyInfo: () => CompanyInfo;

    // Multi-company actions
    switchCompany: (companyId: string) => void;
    initializeCompanies: (companyIds: string[]) => void;

    // Type-safe Setters for Deep State (now company-aware)
    setProductDecision: (product: 'p1' | 'p2' | 'p3', field: keyof DetailedDecisions['products']['p1'], value: any) => void;
    setMarketing: (product: 'p1' | 'p2' | 'p3', region: 'south' | 'west' | 'north' | 'export', value: number) => void;
    setOperations: (field: keyof DetailedDecisions['operations'], value: any) => void;
    setPersonnel: (field: keyof DetailedDecisions['personnel'], value: number) => void;
    setRegionalStaff: (region: 'south' | 'west' | 'north' | 'export', field: 'salesReps' | 'marketingStaff', value: number) => void;

    // Game mode
    gameMode: 'single' | 'multiplayer' | null;
    setGameMode: (mode: 'single' | 'multiplayer') => void;

    // Game actions
    submitDecisions: () => Promise<void>; // Submit current company's decisions
    advanceQuarter: () => void; // Local simulation (single-player mode)
    resetGame: () => void;
    closeReport: () => void;
    openReport: () => void;

    // Status updates (for polling)
    updateCompanyStatus: (companyId: string, status: CompanyStatus) => void;
    setWaitingState: (waiting: boolean, message?: string) => void;
}

// Helper to create initial state for a company
const createInitialCompanyState = (companyId: string, companyName: string): GameState => ({
    ...INITIAL_GAME_STATE,
    player: {
        ...INITIAL_GAME_STATE.player,
        companyName: companyName
    }
});

// Initialize drafts for all companies
const createInitialDrafts = (): Record<string, DetailedDecisions> => {
    const drafts: Record<string, DetailedDecisions> = {};
    AVAILABLE_COMPANIES.forEach(c => {
        drafts[c.id] = JSON.parse(JSON.stringify(INITIAL_DECISIONS));
    });
    return drafts;
};

// Initialize statuses for all companies
const createInitialStatuses = (): Record<string, CompanyStatus> => {
    const statuses: Record<string, CompanyStatus> = {};
    AVAILABLE_COMPANIES.forEach(c => {
        statuses[c.id] = 'PENDING';
    });
    return statuses;
};

// Initialize game states for all companies
const createInitialGameStates = (): Record<string, GameState> => {
    const states: Record<string, GameState> = {};
    AVAILABLE_COMPANIES.forEach(c => {
        states[c.id] = createInitialCompanyState(c.id, c.name);
    });
    return states;
};

export const useGameStore = create<GameStore>((set, get) => ({
    // Initial multi-company state
    activeCompanyId: 'company1',
    drafts: createInitialDrafts(),
    companyStatuses: createInitialStatuses(),
    companyStates: createInitialGameStates(),

    // UI state
    showReport: false,
    isWaitingForOthers: false,
    waitingMessage: '',

    // Computed helpers
    getActiveDecisions: () => {
        const { activeCompanyId, drafts } = get();
        return drafts[activeCompanyId] || INITIAL_DECISIONS;
    },

    getActiveGameState: () => {
        const { activeCompanyId, companyStates } = get();
        return companyStates[activeCompanyId] || INITIAL_GAME_STATE;
    },

    getActiveCompanyInfo: () => {
        const { activeCompanyId } = get();
        return AVAILABLE_COMPANIES.find(c => c.id === activeCompanyId) || AVAILABLE_COMPANIES[0];
    },

    // Switch between companies
    switchCompany: (companyId) => {
        set({ activeCompanyId: companyId });
    },

    // Initialize specific companies for a game session
    initializeCompanies: (companyIds) => {
        const drafts: Record<string, DetailedDecisions> = {};
        const statuses: Record<string, CompanyStatus> = {};
        const states: Record<string, GameState> = {};

        companyIds.forEach(id => {
            const info = AVAILABLE_COMPANIES.find(c => c.id === id);
            if (info) {
                drafts[id] = JSON.parse(JSON.stringify(INITIAL_DECISIONS));
                statuses[id] = 'PENDING';
                states[id] = createInitialCompanyState(id, info.name);
            }
        });

        set({
            drafts,
            companyStatuses: statuses,
            companyStates: states,
            activeCompanyId: companyIds[0]
        });
    },

    // Decision setters (now write to drafts[activeCompanyId])
    setProductDecision: (p, field, value) => set(state => ({
        drafts: {
            ...state.drafts,
            [state.activeCompanyId]: {
                ...state.drafts[state.activeCompanyId],
                products: {
                    ...state.drafts[state.activeCompanyId].products,
                    [p]: {
                        ...state.drafts[state.activeCompanyId].products[p],
                        [field]: value
                    }
                }
            }
        }
    })),

    setMarketing: (p, region, value) => set(state => ({
        drafts: {
            ...state.drafts,
            [state.activeCompanyId]: {
                ...state.drafts[state.activeCompanyId],
                products: {
                    ...state.drafts[state.activeCompanyId].products,
                    [p]: {
                        ...state.drafts[state.activeCompanyId].products[p],
                        marketing: {
                            ...state.drafts[state.activeCompanyId].products[p].marketing,
                            [region]: value
                        }
                    }
                }
            }
        }
    })),

    setOperations: (field, value) => set(state => ({
        drafts: {
            ...state.drafts,
            [state.activeCompanyId]: {
                ...state.drafts[state.activeCompanyId],
                operations: {
                    ...state.drafts[state.activeCompanyId].operations,
                    [field]: value
                }
            }
        }
    })),

    setPersonnel: (field, value) => set(state => ({
        drafts: {
            ...state.drafts,
            [state.activeCompanyId]: {
                ...state.drafts[state.activeCompanyId],
                personnel: {
                    ...state.drafts[state.activeCompanyId].personnel,
                    [field]: value
                }
            }
        }
    })),

    setRegionalStaff: (region, field, value) => set(state => ({
        drafts: {
            ...state.drafts,
            [state.activeCompanyId]: {
                ...state.drafts[state.activeCompanyId],
                regionalStaff: {
                    ...state.drafts[state.activeCompanyId].regionalStaff,
                    [region]: {
                        ...state.drafts[state.activeCompanyId].regionalStaff[region],
                        [field]: value
                    }
                }
            }
        }
    })),

    // Game mode
    gameMode: null,
    setGameMode: (mode) => set({ gameMode: mode }),

    // Submit decisions for current company
    submitDecisions: async () => {
        const { activeCompanyId, drafts, companyStates } = get();
        const decisions = drafts[activeCompanyId];

        // Mark as submitted locally
        set(state => ({
            companyStatuses: {
                ...state.companyStatuses,
                [activeCompanyId]: 'SUBMITTED'
            }
        }));

        // In multiplayer mode, this would call the API
        // For now, check if all companies are submitted
        const { companyStatuses } = get();
        const allSubmitted = Object.values(companyStatuses).every(s => s === 'SUBMITTED');

        if (allSubmitted) {
            // Run simulation for all companies
            const newStates: Record<string, GameState> = {};
            Object.keys(companyStates).forEach(companyId => {
                const currentState = companyStates[companyId];
                const companyDecisions = drafts[companyId];
                newStates[companyId] = SimulationEngine.processQuarter(currentState, companyDecisions);
            });

            // Reset all to pending for next quarter
            const newStatuses: Record<string, CompanyStatus> = {};
            Object.keys(companyStatuses).forEach(id => {
                newStatuses[id] = 'PENDING';
            });

            set({
                companyStates: newStates,
                companyStatuses: newStatuses,
                showReport: true,
                isWaitingForOthers: false
            });
        } else {
            set({
                isWaitingForOthers: true,
                waitingMessage: 'Waiting for other companies to submit...'
            });
        }
    },

    // Local advance (single-player mode)
    advanceQuarter: () => {
        const { activeCompanyId, drafts, companyStates } = get();
        const decisions = drafts[activeCompanyId];
        const currentState = companyStates[activeCompanyId];

        const newGameState = SimulationEngine.processQuarter(currentState, decisions);

        set(state => ({
            companyStates: {
                ...state.companyStates,
                [activeCompanyId]: newGameState
            },
            showReport: true
        }));
    },

    resetGame: () => set({
        drafts: createInitialDrafts(),
        companyStatuses: createInitialStatuses(),
        companyStates: createInitialGameStates(),
        activeCompanyId: 'company1',
        showReport: false,
        isWaitingForOthers: false,
        waitingMessage: ''
    }),

    closeReport: () => set({ showReport: false }),
    openReport: () => set({ showReport: true }),

    // Status updates
    updateCompanyStatus: (companyId, status) => set(state => ({
        companyStatuses: {
            ...state.companyStatuses,
            [companyId]: status
        }
    })),

    setWaitingState: (waiting, message = '') => set({
        isWaitingForOthers: waiting,
        waitingMessage: message
    })
}));

// Legacy compatibility - expose gameState and decisions as getters
// This allows existing components to still work
export const useActiveGameState = () => useGameStore(state => state.companyStates[state.activeCompanyId]);
export const useActiveDecisions = () => useGameStore(state => state.drafts[state.activeCompanyId]);
