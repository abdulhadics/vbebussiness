import { create } from 'zustand';
import { GameState, DetailedDecisions, INITIAL_GAME_STATE, INITIAL_DECISIONS } from '@/lib/types';
import { SimulationEngine } from '@/lib/simulation-engine';

interface GameStore {
    gameState: GameState;
    decisions: DetailedDecisions;
    showReport: boolean;

    // Type-safe Setters for Deep State
    setProductDecision: (product: 'p1' | 'p2' | 'p3', field: keyof DetailedDecisions['products']['p1'], value: any) => void;
    setMarketing: (product: 'p1' | 'p2' | 'p3', region: 'south' | 'west' | 'north' | 'export', value: number) => void;
    setOperations: (field: keyof DetailedDecisions['operations'], value: any) => void;
    setPersonnel: (field: keyof DetailedDecisions['personnel'], value: number) => void;

    advanceQuarter: () => void;
    resetGame: () => void;
    closeReport: () => void;
    openReport: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    gameState: INITIAL_GAME_STATE,
    decisions: INITIAL_DECISIONS,
    showReport: false,

    setProductDecision: (p, field, value) => set(state => ({
        decisions: {
            ...state.decisions,
            products: {
                ...state.decisions.products,
                [p]: { ...state.decisions.products[p], [field]: value }
            }
        }
    })),

    setMarketing: (p, region, value) => set(state => ({
        decisions: {
            ...state.decisions,
            products: {
                ...state.decisions.products,
                [p]: {
                    ...state.decisions.products[p],
                    marketing: {
                        ...state.decisions.products[p].marketing,
                        [region]: value
                    }
                }
            }
        }
    })),

    setOperations: (field, value) => set(state => ({
        decisions: {
            ...state.decisions,
            operations: { ...state.decisions.operations, [field]: value }
        }
    })),

    setPersonnel: (field, value) => set(state => ({
        decisions: {
            ...state.decisions,
            personnel: { ...state.decisions.personnel, [field]: value }
        }
    })),

    advanceQuarter: () => {
        const { gameState, decisions } = get();
        const newGameState = SimulationEngine.processQuarter(gameState, decisions);
        set({ gameState: newGameState, showReport: true });
    },

    resetGame: () => set({
        gameState: INITIAL_GAME_STATE,
        decisions: INITIAL_DECISIONS,
        showReport: false
    }),

    closeReport: () => set({ showReport: false }),
    openReport: () => set({ showReport: true })
}));
