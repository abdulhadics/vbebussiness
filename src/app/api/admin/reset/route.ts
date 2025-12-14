import { NextRequest, NextResponse } from 'next/server';

// Shared game store (in production, use database)
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
        const { gameId, adminKey } = body;

        // Basic admin authentication (in production, use proper auth)
        if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'topaz-admin-2024') {
            return NextResponse.json(
                { error: 'Unauthorized. Invalid admin key.' },
                { status: 401 }
            );
        }

        if (!gameId) {
            return NextResponse.json(
                { error: 'gameId is required' },
                { status: 400 }
            );
        }

        // Reset the game
        if (gameStore[gameId]) {
            // Reset to initial state
            const companiesCount = Object.keys(gameStore[gameId].companies).length;

            // Reset all company statuses to PENDING
            Object.keys(gameStore[gameId].companies).forEach(companyId => {
                gameStore[gameId].companies[companyId] = {
                    status: 'PENDING',
                    decisions: null,
                    submittedAt: undefined
                };
            });

            // Reset quarter and results
            gameStore[gameId].currentQuarter = 1;
            gameStore[gameId].results = [];

            console.log(`[ADMIN] Game ${gameId} reset. ${companiesCount} companies restored to Q1.`);

            return NextResponse.json({
                success: true,
                message: `Game ${gameId} has been reset successfully.`,
                details: {
                    currentQuarter: 1,
                    companiesReset: companiesCount,
                    resultsCleared: true
                }
            });
        }

        // Game doesn't exist
        return NextResponse.json({
            success: false,
            message: `Game ${gameId} not found. Nothing to reset.`
        });

    } catch (error) {
        console.error('Admin reset error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

// GET endpoint to list all active games (admin only)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');

    if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'topaz-admin-2024') {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const games = Object.entries(gameStore).map(([gameId, game]) => ({
        gameId,
        currentQuarter: game.currentQuarter,
        companiesCount: Object.keys(game.companies).length,
        status: Object.values(game.companies).every(c => c.status === 'SUBMITTED')
            ? 'ALL_SUBMITTED'
            : 'WAITING'
    }));

    return NextResponse.json({
        totalGames: games.length,
        games
    });
}
