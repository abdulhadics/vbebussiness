'use client';
import { HelpCircle } from "lucide-react";
import { useState } from "react";

export function InfoTooltip({ text }: { text: string }) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block ml-2 group">
            <button
                className="text-slate-500 hover:text-white transition-colors"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                <HelpCircle size={14} />
            </button>

            {isVisible && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl border border-white/10 z-50 leading-relaxed pointer-events-none">
                    {text}
                    {/* Tiny triangle */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                </div>
            )}
        </div>
    )
}
