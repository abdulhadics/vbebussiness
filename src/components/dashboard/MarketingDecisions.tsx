'use client';
import { useGameStore } from "@/store/game-store";
import { Megaphone, MapPin, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function MarketingDecisions() {
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);
    const drafts = useGameStore((state) => state.drafts);
    const setProductDecision = useGameStore((state) => state.setProductDecision);
    const setMarketing = useGameStore((state) => state.setMarketing);

    // Get decisions for the active company
    const decisions = drafts[activeCompanyId];

    if (!decisions) return null;

    const products = [
        { id: 'p1' as const, name: 'Product 1', color: 'emerald' },
        { id: 'p2' as const, name: 'Product 2', color: 'violet' },
        { id: 'p3' as const, name: 'Product 3', color: 'amber' },
    ];

    const regions = ['south', 'west', 'north', 'export'] as const;

    return (
        <div className="space-y-8">
            {products.map((product, index) => (
                <motion.section
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                <Megaphone size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">{product.name}</h3>
                        </div>

                        {/* Price Control */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-400">Unit Price</span>
                            <div className="control-module flex items-center px-4 py-2">
                                <span className="text-slate-500 mr-1">£</span>
                                <input
                                    type="number"
                                    value={decisions.products[product.id].price}
                                    min={50}
                                    max={500}
                                    onChange={(e) => setProductDecision(product.id, 'price', Number(e.target.value))}
                                    className="w-20 bg-transparent text-white font-mono text-lg outline-none"
                                />
                            </div>
                            <PriceIndicator price={decisions.products[product.id].price} />
                        </div>
                    </div>

                    {/* Regional Marketing Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {regions.map((region) => (
                            <HeatmapSlider
                                key={region}
                                label={region.charAt(0).toUpperCase() + region.slice(1)}
                                value={decisions.products[product.id].marketing[region]}
                                onChange={(v) => setMarketing(product.id, region, v)}
                            />
                        ))}
                    </div>

                    {/* Total Spend Summary */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-sm text-slate-400">Total Marketing Spend</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-mono font-bold text-white">
                                £{Object.values(decisions.products[product.id].marketing).reduce((a, b) => a + b, 0).toLocaleString()}
                            </span>
                            <TrendingUp size={16} className="text-emerald-400" />
                        </div>
                    </div>
                </motion.section>
            ))}
        </div>
    );
}

function PriceIndicator({ price }: { price: number }) {
    let label = 'Budget';
    let chipClass = '';

    if (price > 200) {
        label = 'Premium';
        chipClass = '';
    } else if (price > 120) {
        label = 'Mid-Range';
        chipClass = 'warning';
    }

    return (
        <span className={`helper-chip ${chipClass}`}>
            {label}
        </span>
    );
}

interface HeatmapSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

function HeatmapSlider({ label, value, onChange }: HeatmapSliderProps) {
    const intensity = value / 50000; // 0 to 1

    // Color interpolation from blue (cold) to red (hot)
    const hue = 200 - (intensity * 200); // 200 (blue) to 0 (red)
    const bgColor = `hsl(${hue}, 70%, 50%)`;

    return (
        <div className="control-module p-4 relative overflow-hidden group">
            {/* Heatmap Background */}
            <div
                className="absolute inset-0 opacity-20 transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${bgColor}, transparent)` }}
            />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{label}</span>
                </div>

                <div className="flex items-end justify-between mb-3">
                    <span className="text-2xl font-mono font-bold text-white">
                        £{(value / 1000).toFixed(0)}k
                    </span>
                    {value > 30000 && (
                        <span className="helper-chip danger">High</span>
                    )}
                </div>

                {/* Slider Track with Heatmap Effect */}
                <div className="relative h-2">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full overflow-hidden"
                        style={{ background: `linear-gradient(90deg, #3b82f6, #eab308, #ef4444)` }}>
                    </div>
                    <div
                        className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-slate-800"
                        style={{ left: `${intensity * 100}%`, right: 0 }}
                    ></div>
                    <input
                        type="range"
                        min={0}
                        max={50000}
                        step={1000}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {/* Thumb */}
                    <div
                        style={{ left: `${intensity * 100}%` }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none transition-all group-hover:scale-125"
                    ></div>
                </div>
            </div>
        </div>
    );
}
