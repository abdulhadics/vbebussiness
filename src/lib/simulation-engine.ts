import { GameState, DetailedDecisions, CompanyState, Competitor, Financials, MarketState, QuarterResult } from './types';

export class SimulationEngine {

    /**
     * Main Execution Pipeline - The "Server Side" Logic
     */
    static processQuarter(currentState: GameState, playerDecisions: DetailedDecisions): GameState {
        const newState = JSON.parse(JSON.stringify(currentState)); // Deep copy
        const logs: string[] = [];

        // 1. AI Logic: Generate Decisions for Competitors
        const aiDecisionsMap = this.runAILogic(newState.competitors, newState.market);

        // 2. Global Market Updates (Stochastic Shocks)
        this.updateMarketConditions(newState.market, logs);

        // 3. Process Player Company
        this.processCompany(newState.player, playerDecisions, newState.market, logs);

        // 4. Process AI Companies (Simplified Simulation for them)
        // In a full version, we'd run the exact same processCompany function for them.
        // For now, we simulate their results to update the "Market Comparison".
        newState.competitors.forEach((comp: any) => {
            // Simple AI simulation just to keep their stock prices moving
            const aiDec = aiDecisionsMap.get(comp.id);
            if (aiDec) {
                // Logic to drift AI stock price based on their personality success
                comp.state.sharePrice *= (0.95 + Math.random() * 0.15);
            }
        });

        newState.market.quarter += 1;
        newState.logs = [...newState.logs, ...logs];

        return newState;
    }

    /**
     * Component 1: Market Dynamics & AI
     */
    private static runAILogic(competitors: Competitor[], market: MarketState): Map<string, DetailedDecisions> {
        const decisions = new Map();
        competitors.forEach(comp => {
            // Basic AI Generator
            // In real implementation, this would look at 'comp.personality' and adjust price/spend
            decisions.set(comp.id, {});
        });
        return decisions;
    }

    private static updateMarketConditions(market: MarketState, logs: string[]) {
        // 10% chance of a shock
        if (Math.random() < 0.1) {
            const shockType = Math.random();
            if (shockType > 0.5) {
                market.interestRate += 0.02;
                logs.push("Global Market Shock: Interest rates spiked by 2% due to inflation.");
            } else {
                market.materialCost *= 1.15;
                logs.push("Supply Chain Crisis: Raw material costs surged by 15%.");
            }
        }
        // Natural Growth
        market.totalDemand *= market.gdpGrowth;
    }

    /**
     * Component 2: Core Processing Engine (The "Decision Processing" Table)
     */
    private static processCompany(company: CompanyState, decisions: DetailedDecisions, market: MarketState, logs: string[]) {

        // --- A. PERSONNEL (HR) ---
        // Impact: Wage -> Morale -> Productivity
        const marketWage = 12; // Base
        const wageRatio = decisions.personnel.workerWage / marketWage;

        // Morale Adjustment
        let moraleDelta = 0;
        if (wageRatio > 1.1) moraleDelta += 5;
        else if (wageRatio < 0.9) moraleDelta -= 10;
        if (decisions.personnel.dismissWorkers > 0) moraleDelta -= 15; // Firing hurts morale

        company.morale = Math.max(0, Math.min(100, company.morale + moraleDelta));

        // Productivity Formula
        // Base 1.0, + factor of morale, + factor of training (ignored for now, assume high wage = better work)
        company.productivity = 0.8 + (company.morale / 100 * 0.4); // Ranges 0.8 to 1.2


        // --- B. OPERATIONS (Production) ---
        const products = ['p1', 'p2', 'p3'] as const;
        let totalProductionCost = 0;
        let totalUnitsProduced = 0;

        const machineCapacity = company.machines * 500; // units per machine base
        let effectiveCapacity = machineCapacity * company.productivity;

        // Shift Multipliers
        if (decisions.operations.shiftLevel === 2) effectiveCapacity *= 1.5;
        if (decisions.operations.shiftLevel === 3) effectiveCapacity *= 2.0;

        // Calculate Production per product (Available Capacity split)
        // Logic: Just fulfill requested production up to capacity limit
        const requestedTotal = decisions.products.p1.production + decisions.products.p2.production + decisions.products.p3.production;
        const fulfillmentRatio = Math.min(1, effectiveCapacity / Math.max(1, requestedTotal));

        if (fulfillmentRatio < 1) logs.push(`Warning: Production capped at ${Math.floor(effectiveCapacity)} units due to capacity constraints.`);

        products.forEach(p => {
            const requested = decisions.products[p].production;
            const actualObj = Math.floor(requested * fulfillmentRatio);

            company.inventory[p] += actualObj;
            totalUnitsProduced += actualObj;

            // Cost accumulation
            const materialCost = actualObj * market.materialCost;
            // Labor Cost: (Units / Rate) * Wage. Simplified: Assume 1 unit takes 1 hour for now.
            const laborHours = actualObj * (1.5 / company.productivity); // Higher productivity = less hours
            const shiftPremium = decisions.operations.shiftLevel === 1 ? 1 : decisions.operations.shiftLevel === 2 ? 1.3 : 1.5;
            const laborCost = laborHours * decisions.personnel.workerWage * shiftPremium;

            totalProductionCost += (materialCost + laborCost);
        });

        // Fixed Ops Costs
        const maintenanceCost = company.machines * decisions.operations.maintenanceHours * 20; // $20/hr
        const machineBuyCost = decisions.operations.buyMachines * 50000;
        const machineSellIncome = decisions.operations.sellMachines * 25000;

        company.machines += (decisions.operations.buyMachines - decisions.operations.sellMachines);


        // --- C. MARKETING (Sales) ---
        let totalRevenue = 0;
        let totalMarketingSpend = 0;
        let totalUnitsSold = 0;

        const salesByProduct: { product: string; units: number; revenue: number; }[] = [];

        const regions = ['south', 'west', 'north', 'export'] as const;
        const regionalRevenue = {
            south: { p1: 0, p2: 0, p3: 0 },
            west: { p1: 0, p2: 0, p3: 0 },
            north: { p1: 0, p2: 0, p3: 0 },
            export: { p1: 0, p2: 0, p3: 0 }
        };

        products.forEach(p => {
            const prodDec = decisions.products[p];

            // Demand Function: Derived from The Math section
            // Demand = Base * (1/Price^E) * (Marketing^0.5)
            const elasticity = 1.5;
            const baseDemand = market.totalDemand / 3; // Split market roughly

            // Price Factor
            const price = prodDec.price;
            const priceFactor = Math.pow(150 / price, elasticity); // 150 is reference price

            // Marketing Factor (Sum of all regions)
            const totalMarketing = prodDec.marketing.south + prodDec.marketing.west + prodDec.marketing.north + prodDec.marketing.export;
            const marketingFactor = 1 + (Math.log(totalMarketing + 1) / 10); // Logarithmic returns

            let demand = Math.floor(baseDemand * priceFactor * marketingFactor * 0.1); // Scale down to realistic unit counts

            // Sales Fulfillment
            const sold = Math.min(demand, company.inventory[p]);
            company.inventory[p] -= sold;

            const revenue = sold * price;
            totalRevenue += revenue;
            totalUnitsSold += sold;
            totalMarketingSpend += totalMarketing;

            salesByProduct.push({
                product: p.toUpperCase(),
                units: sold,
                revenue: revenue
            });

            // Distribute sales to regions based on marketing weight
            // Base weight 1000 ensures some sales even with 0 marketing
            let totalWeight = 0;
            const weights: Record<string, number> = {};

            regions.forEach(r => {
                const w = 1000 + prodDec.marketing[r];
                weights[r] = w;
                totalWeight += w;
            });

            regions.forEach(r => {
                const ratio = weights[r] / totalWeight;
                const rUnits = Math.floor(sold * ratio);
                const rRev = rUnits * price;

                regionalRevenue[r][p] += rRev;
            });
        });


        // --- D. FINANCE (P&L) ---
        // COGS Calculation
        // Weighted average cost of inventory is complex. 
        // Simplified: COGS = (TotalProductionCost / TotalProduced) * UnitsSold
        const avgUnitCost = totalUnitsProduced > 0 ? totalProductionCost / totalUnitsProduced : 0;
        const cogs = avgUnitCost * totalUnitsSold;

        // Expenses
        const salaries = (company.employees * 3000) + (decisions.personnel.salesSalary * 10); // Fixed admin overhead
        const interestExpense = company.loans * (market.interestRate / 4); // Quarterly interest

        const salesforceExpense = (decisions.regionalStaff?.south?.salesReps || 0) * 2500 +
            (decisions.regionalStaff?.west?.salesReps || 0) * 2500 +
            (decisions.regionalStaff?.north?.salesReps || 0) * 2500 +
            (decisions.regionalStaff?.export?.salesReps || 0) * 2500 +
            (decisions.regionalStaff?.south?.marketingStaff || 0) * 3000 +
            (decisions.regionalStaff?.west?.marketingStaff || 0) * 3000 +
            (decisions.regionalStaff?.north?.marketingStaff || 0) * 3000 +
            (decisions.regionalStaff?.export?.marketingStaff || 0) * 3000;

        const expenses = {
            marketing: totalMarketingSpend,
            rd: 0, // Not in input yet, assume 0
            depreciation: company.machines * 500, // Fixed depreciation
            interest: interestExpense,
            tax: 0,
            personnel: salaries + maintenanceCost,
            salesforce: salesforceExpense
        };

        const totalOpex = Object.values(expenses).reduce((a, b) => a + b, 0);
        const grossProfit = totalRevenue - cogs;
        const ebit = grossProfit - totalOpex;
        const tax = ebit > 0 ? ebit * 0.2 : 0; // 20% Tax
        expenses.tax = tax;

        const netProfit = ebit - tax;

        // Update Balance Sheet vars
        company.cash += (netProfit + machineSellIncome - machineBuyCost);
        company.netWorth += netProfit;

        // Share Price Formula
        // Price = Price + (EPS * P/E ratio adjustment)
        const eps = netProfit / company.shareCount;
        const priceChange = eps * 5; // P/E of 5 roughly
        company.sharePrice = Math.max(0.1, company.sharePrice + priceChange);

        // --- E. REPORT GENERATION ---
        const result: QuarterResult = {
            quarter: market.quarter,
            financials: {
                revenue: totalRevenue,
                cogs,
                grossProfit,
                expenses,
                netProfit,
                assets: {
                    cash: company.cash,
                    inventory: (company.inventory.p1 + company.inventory.p2 + company.inventory.p3) * avgUnitCost,
                    machines: company.machines * 40000 // Book value
                },
                liabilities: {
                    loans: company.loans,
                    payables: 0
                },
                equity: {
                    netWorth: company.netWorth,
                    retainedEarnings: 0
                }
            },
            metrics: {
                marketShare: totalUnitsSold / market.totalDemand * 100, // Very rough
                stockPrice: company.sharePrice,
                unitsSold: totalUnitsSold,
                employeeMorale: company.morale
            },
            salesByProduct: salesByProduct,
            salesByRegion: regions.map(r => ({
                region: r.charAt(0).toUpperCase() + r.slice(1),
                p1: regionalRevenue[r].p1,
                p2: regionalRevenue[r].p2,
                p3: regionalRevenue[r].p3,
                total: regionalRevenue[r].p1 + regionalRevenue[r].p2 + regionalRevenue[r].p3
            }))
        };

        company.history.push(result);
    }
}
