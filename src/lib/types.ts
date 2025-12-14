export interface Financials {
    revenue: number;
    cogs: number;
    grossProfit: number;
    expenses: {
        marketing: number;
        rd: number;
        depreciation: number;
        interest: number;
        tax: number;
        personnel: number;
        salesforce: number;
    };
    netProfit: number;
    assets: {
        cash: number;
        inventory: number;
        machines: number;
    };
    liabilities: {
        loans: number;
        payables: number;
    };
    equity: {
        netWorth: number;
        retainedEarnings: number;
    };
}

export interface MarketState {
    gdpGrowth: number;       // e.g., 1.02 for 2% growth
    interestRate: number;    // e.g., 0.05 for 5%
    materialCost: number;     // Cost per unit raw material
    totalDemand: number;
    quarter: number;
}

export interface Competitor {
    id: string;
    name: string;
    type: 'AI' | 'HUMAN';
    personality?: 'COST_LEADER' | 'QUALITY_INNOVATOR' | 'AGGRESSIVE_MARKETER';
    state: CompanyState;
    lastDecisions?: DetailedDecisions;
}

// Regional Staff Structure
export interface RegionalStaff {
    salesReps: number;
    marketingStaff: number;
}

export interface CompanyState {
    companyName: string;
    sharePrice: number;
    shareCount: number; // For EPS calc

    // Personnel
    employees: number;
    morale: number;        // 0-100
    productivity: number;  // Multiplier, e.g., 1.0

    // Regional Staff
    regionalStaff: {
        south: RegionalStaff;
        west: RegionalStaff;
        north: RegionalStaff;
        export: RegionalStaff;
    };

    // Ops
    machines: number;
    machineEfficiency: number; // 0-100%
    inventory: {
        p1: number;
        p2: number;
        p3: number;
    };

    // Financials
    cash: number;
    loans: number;
    netWorth: number;
    creditRating: number; // Determines interest rate

    history: QuarterResult[];
}

export interface GameState {
    market: MarketState;
    player: CompanyState;
    competitors: Competitor[];
    logs: string[];
    isGameOver: boolean;
}

// Product Marketing with Regional Budget
export interface ProductDecisions {
    price: number;
    marketing: { south: number; west: number; north: number; export: number; };
    production: number;
}

// Regional Staff Decisions
export interface RegionalStaffDecisions {
    south: RegionalStaff;
    west: RegionalStaff;
    north: RegionalStaff;
    export: RegionalStaff;
}

export interface DetailedDecisions {
    products: { p1: ProductDecisions; p2: ProductDecisions; p3: ProductDecisions; };
    operations: { shiftLevel: 1 | 2 | 3; maintenanceHours: number; buyMachines: number; sellMachines: number; };
    personnel: { recruitSales: number; dismissSales: number; salesSalary: number; recruitWorkers: number; dismissWorkers: number; workerWage: number; };
    regionalStaff: RegionalStaffDecisions;
    intelligence: { buyCompetitorInfo: boolean; buyMarketShareInfo: boolean; };
}

export interface SalesData {
    region: string;
    p1: number;
    p2: number;
    p3: number;
    total: number;
}

export interface QuarterResult {
    quarter: number;
    financials: Financials;
    metrics: {
        marketShare: number;
        stockPrice: number;
        unitsSold: number;
        employeeMorale: number;
    };
    salesByRegion?: SalesData[];
    salesByProduct?: { product: string; units: number; revenue: number; }[];
}

export const INITIAL_REGIONAL_STAFF: RegionalStaffDecisions = {
    south: { salesReps: 4, marketingStaff: 2 },
    west: { salesReps: 4, marketingStaff: 2 },
    north: { salesReps: 4, marketingStaff: 2 },
    export: { salesReps: 4, marketingStaff: 2 },
};

export const INITIAL_GAME_STATE: GameState = {
    market: {
        gdpGrowth: 1.02,
        interestRate: 0.08,
        materialCost: 15,
        totalDemand: 10000,
        quarter: 1
    },
    player: {
        companyName: "Company 1",
        sharePrice: 1.00,
        shareCount: 1000000,
        employees: 50,
        morale: 75,
        productivity: 1.0,
        machines: 10,
        machineEfficiency: 0.95,
        inventory: { p1: 500, p2: 200, p3: 0 },
        cash: 500000,
        loans: 0,
        netWorth: 1000000,
        creditRating: 100,
        regionalStaff: {
            south: { salesReps: 4, marketingStaff: 2 },
            west: { salesReps: 4, marketingStaff: 2 },
            north: { salesReps: 4, marketingStaff: 2 },
            export: { salesReps: 4, marketingStaff: 2 },
        },
        history: []
    },
    competitors: [
        {
            id: 'cpu1', name: "Apex Corp", type: 'AI', personality: 'AGGRESSIVE_MARKETER',
            state: { ...null as any, sharePrice: 1.00, netWorth: 500000 } // partial init
        }
    ],
    logs: [],
    isGameOver: false
};

export const INITIAL_DECISIONS: DetailedDecisions = {
    products: {
        p1: { price: 100, marketing: { south: 5000, west: 5000, north: 5000, export: 5000 }, production: 2000 },
        p2: { price: 120, marketing: { south: 4000, west: 4000, north: 4000, export: 4000 }, production: 1000 },
        p3: { price: 150, marketing: { south: 2000, west: 2000, north: 2000, export: 0 }, production: 0 },
    },
    operations: { shiftLevel: 1, maintenanceHours: 40, buyMachines: 0, sellMachines: 0 },
    personnel: { recruitSales: 0, dismissSales: 0, salesSalary: 2000, recruitWorkers: 0, dismissWorkers: 0, workerWage: 12 },
    regionalStaff: INITIAL_REGIONAL_STAFF,
    intelligence: { buyCompetitorInfo: false, buyMarketShareInfo: false }
};
