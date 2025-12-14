'use client';
import { useGameStore } from "@/store/game-store";
import { GlassCard } from "@/components/ui/GlassCard";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { Megaphone, MapPin, TrendingUp, DollarSign, Target } from "lucide-react";
import { motion } from "framer-motion";

export function MarketingDecisions() {
    const activeCompanyId = useGameStore((state) => state.activeCompanyId);
    const drafts = useGameStore((state) => state.drafts);
    const setProductDecision = useGameStore((state) => state.setProductDecision);
    const setMarketing = useGameStore((state) => state.setMarketing);

    const decisions = drafts[activeCompanyId];
    if (!decisions) return null;

    const products = [
        { id: 'p1' as const, name: 'Product 1', emoji: '📦', gradient: 'from-emerald-500 to-teal-600' },
        { id: 'p2' as const, name: 'Product 2', emoji: '📱', gradient: 'from-violet-500 to-purple-600' },
        { id: 'p3' as const, name: 'Product 3', emoji: '💎', gradient: 'from-amber-500 to-orange-600' },
    ];

    const regions = [
        { id: 'south' as const, name: 'South', emoji: '🌴' },
        { id: 'west' as const, name: 'West', emoji: '🌅' },
        { id: 'north' as const, name: 'North', emoji: '❄️' },
        { id: 'export' as const, name: 'Export', emoji: '🌍' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {products.map((product, index) => {
                    const productData = decisions.products[product.id];
                    const totalMarketing = Object.values(productData.marketing).reduce((a, b) => a + b, 0);

                    return (
                        <GlassCard
                            key={product.id}
                            delay={index * 0.1}
                            glow={index === 0 ? 'emerald' : index === 1 ? 'purple' : 'amber'}
                            className="relative"
                        >
                            {/* Product Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-2xl shadow-lg`}
                                >
                                    {product.emoji}
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                                    <div className="text-sm text-slate-400">Marketing Strategy</div>
                                </div>
                            </div>

                            {/* Price Input - Featured */}
                            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <DollarSign size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Unit Price</span>
                                    </div>
                                    <PriceIndicator price={productData.price} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500 text-2xl">£</span>
                                    <input
                                        type="number"
                                        value={productData.price}
                                        min={50}
                                        max={500}
                                        onChange={(e) => setProductDecision(product.id, 'price', Number(e.target.value))}
                                        className="w-full bg-transparent text-white text-4xl font-bold font-mono outline-none"
                                    />
                                </div>
                            </div>

                            {/* Regional Marketing Grid */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-400 mb-3">
                                    <Target size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Regional Spend</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {regions.map((region) => (
                                        <RegionInput
                                            key={region.id}
                                            emoji={region.emoji}
                                            label={region.name}
                                            value={productData.marketing[region.id]}
                                            onChange={(v) => setMarketing(product.id, region.id, v)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Total Summary */}
                            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-sm text-slate-400">Total Marketing</span>
                                <motion.div
                                    key={totalMarketing}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-2xl font-mono font-bold text-white">
                                        £{totalMarketing.toLocaleString()}
                                    </span>
                                    <TrendingUp size={16} className="text-emerald-400" />
                                </motion.div>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>
        </motion.div>
    );
}

function PriceIndicator({ price }: { price: number }) {
    let label = 'Budget';
    let className = 'bg-blue-500/15 text-blue-300 border-blue-500/20';

    if (price > 200) {
        label = 'Premium';
        className = 'bg-amber-500/15 text-amber-300 border-amber-500/20';
    } else if (price > 120) {
        label = 'Mid-Range';
        className = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20';
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${className}`}>
            {label}
        </span>
    );
}

interface RegionInputProps {
    emoji: string;
    label: string;
    value: number;
    onChange: (value: number) => void;
}

function RegionInput({ emoji, label, value, onChange }: RegionInputProps) {
    const intensity = value / 50000;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-xl bg-slate-800/50 p-3 border border-white/5 hover:border-white/10 transition-all"
        >
            {/* Intensity Bar */}
            <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${intensity * 100}%` }}
            />

            <div className="flex items-center gap-2 mb-2">
                <span>{emoji}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            </div>

            <div className="flex items-center gap-1">
                <span className="text-slate-500">£</span>
                <input
                    type="number"
                    value={value}
                    min={0}
                    max={50000}
                    step={1000}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full bg-transparent text-white text-lg font-bold font-mono outline-none"
                />
            </div>
        </motion.div>
    );
}
