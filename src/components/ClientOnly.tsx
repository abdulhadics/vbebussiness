'use client';
import { useEffect, useState } from 'react';

export function ClientOnly({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-emerald-400 font-bold tracking-widest text-sm uppercase">Loading Simulation...</div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
