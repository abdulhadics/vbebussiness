import { NextRequest, NextResponse } from 'next/server';

// Shared game store (in production, use database)
// This should be imported from a shared module in production
const gameStore: Record<string, {
    companies: Record<string, {
        status: 'PENDING' | 'SUBMITTED';
        decisions: any;
        submittedAt?: Date;
    }>;
    currentQuarter: number;
    results: any[];
}> = {};

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    if (!gameId) {
        return NextResponse.json(
            { error: 'gameId query parameter is required' },
            { status: 400 }
        );
    }

    const game = gameStore[gameId];

    if (!game) {
        // Return default state for new/unknown games
        return NextResponse.json({
            gameId,
            exists: false,
            currentQuarter: 1,
            companies: [],
            allSubmitted: false,
            message: 'Game session not found. Start a new game or join an existing one.'
        });
    }

    const companies = Object.entries(game.companies).map(([id, data]) => ({
        companyId: id,
        status: data.status,
        submittedAt: data.submittedAt?.toISOString()
    }));

    const allSubmitted = companies.length > 0 &&
        companies.every(c => c.status === 'SUBMITTED');

    const pendingCount = companies.filter(c => c.status === 'PENDING').length;
    const submittedCount = companies.filter(c => c.status === 'SUBMITTED').length;

    return NextResponse.json({
        gameId,
        exists: true,
        currentQuarter: game.currentQuarter,
        companies,
        stats: {
            total: companies.length,
            submitted: submittedCount,
            pending: pendingCount
        },
        allSubmitted,
        message: allSubmitted
            ? 'All companies have submitted. Ready to run simulation.'
            : `Waiting for ${pendingCount} company/companies to submit.`
    });
}
