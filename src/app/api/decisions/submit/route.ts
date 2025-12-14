import { NextRequest, NextResponse } from 'next/server';

// In-memory store for demo purposes
// In production, replace with actual database (Supabase, MongoDB, etc.)
const gameStore: Record<string, {
    companies: Record<string, {
        status: 'PENDING' | 'SUBMITTED';
        decisions: any;
        submittedAt?: Date;
    }>;
    currentQuarter: number;
    results: any[];
}> = {};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { gameId, companyId, quarter, payload } = body;

        // Validate input
        if (!gameId || !companyId || !quarter || !payload) {
            return NextResponse.json(
                { error: 'Missing required fields: gameId, companyId, quarter, payload' },
                { status: 400 }
            );
        }

        // Initialize game if not exists
        if (!gameStore[gameId]) {
            gameStore[gameId] = {
                companies: {},
                currentQuarter: 1,
                results: []
            };
        }

        const game = gameStore[gameId];

        // Step 1: Save the decision and mark as SUBMITTED
        game.companies[companyId] = {
            status: 'SUBMITTED',
            decisions: payload,
            submittedAt: new Date()
        };

        console.log(`[${gameId}] Company ${companyId} submitted decisions for Q${quarter}`);

        // Step 2: The Barrier Check
        const allCompanies = Object.keys(game.companies);
        const pendingCompanies = allCompanies.filter(
            id => game.companies[id].status === 'PENDING'
        );
        const submittedCompanies = allCompanies.filter(
            id => game.companies[id].status === 'SUBMITTED'
        );

        // Step 3: Check if all companies are ready
        if (pendingCompanies.length > 0) {
            // Still waiting for other players
            return NextResponse.json({
                status: 'WAITING',
                message: `Waiting for ${pendingCompanies.length} other company/companies to submit...`,
                submitted: submittedCompanies.length,
                total: allCompanies.length,
                pendingCompanies: pendingCompanies
            });
        }

        // All companies have submitted - trigger simulation
        console.log(`[${gameId}] All companies submitted. Running simulation for Q${quarter}...`);

        // In production: Call SimulationEngine.runQuarter(gameId)
        // For now, we'll return a success response

        // Reset all companies to PENDING for next quarter
        allCompanies.forEach(id => {
            game.companies[id].status = 'PENDING';
        });
        game.currentQuarter++;

        return NextResponse.json({
            status: 'COMPLETED',
            message: `Quarter ${quarter} simulation complete!`,
            nextQuarter: game.currentQuarter,
            results: {
                processedAt: new Date().toISOString(),
                companiesProcessed: allCompanies.length
            }
        });

    } catch (error) {
        console.error('Decision submit error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

// GET endpoint to check submission status
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    const companyId = searchParams.get('companyId');

    if (!gameId) {
        return NextResponse.json(
            { error: 'gameId is required' },
            { status: 400 }
        );
    }

    const game = gameStore[gameId];

    if (!game) {
        return NextResponse.json({
            exists: false,
            message: 'Game not found'
        });
    }

    if (companyId) {
        // Return status for specific company
        const company = game.companies[companyId];
        return NextResponse.json({
            status: company?.status || 'PENDING',
            submittedAt: company?.submittedAt
        });
    }

    // Return status for all companies
    return NextResponse.json({
        gameId,
        currentQuarter: game.currentQuarter,
        companies: Object.entries(game.companies).map(([id, data]) => ({
            companyId: id,
            status: data.status,
            submittedAt: data.submittedAt
        }))
    });
}
