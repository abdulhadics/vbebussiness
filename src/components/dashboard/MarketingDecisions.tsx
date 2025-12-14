'use client';
import { useGameStore } from "@/store/game-store";
import { GlassCard } from "@/components/ui/GlassCard";
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
        { id: 'p1' as const, name: 'Product 1', emoji: '📦', color: '#10b981' },
        { id: 'p2' as const, name: 'Product 2', emoji: '📱', color: '#8b5cf6' },
        { id: 'p3' as const, name: 'Product 3', emoji: '💎', color: '#f59e0b' },
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
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl p-6 shadow-lg border-l-4"
                            style={{ borderColor: product.color }}
                        >
                            {/* Product Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                                    style={{ backgroundColor: product.color }}
                                >
                                    {product.emoji}
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-black">{product.name}</h3>
                                    <div className="text-sm text-gray-500">Marketing Strategy</div>
                                </div>
                            </div>

                            {/* Price Input - Featured */}
                            <div className="mb-6 p-4 rounded-2xl bg-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <DollarSign size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Unit Price</span>
                                    </div>
                                    <PriceIndicator price={productData.price} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-2xl">£</span>
                                    <input
                                        type="number"
                                        value={productData.price}
                                        min={50}
                                        max={500}
                                        onChange={(e) => setProductDecision(product.id, 'price', Number(e.target.value))}
                                        className="w-full bg-white text-black text-4xl font-bold font-mono outline-none border-2 border-gray-200 rounded-xl p-2 focus:border-black transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Regional Marketing Grid */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-500 mb-3">
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
                            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-sm text-gray-500">Total Marketing</span>
                                <motion.div
                                    key={totalMarketing}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-2xl font-mono font-bold text-black">
                                        £{totalMarketing.toLocaleString()}
                                    </span>
                                    <TrendingUp size={16} className="text-green-500" />
                                </motion.div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

function PriceIndicator({ price }: { price: number }) {
    let label = 'Budget';
    let className = 'bg-blue-100 text-blue-700';

    if (price > 200) {
        label = 'Premium';
        className = 'bg-amber-100 text-amber-700';
    } else if (price > 120) {
        label = 'Mid-Range';
        className = 'bg-green-100 text-green-700';
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${className}`}>
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
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-xl bg-gray-50 p-3 border-2 border-gray-200 hover:border-gray-300 transition-all"
        >
            <div className="flex items-center gap-2 mb-2">
                <span>{emoji}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
            </div>

            <div className="flex items-center gap-1">
                <span className="text-gray-400">£</span>
                <input
                    type="number"
                    value={value}
                    min={0}
                    max={50000}
                    step={1000}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full bg-white text-black text-lg font-bold font-mono outline-none border border-gray-200 rounded-lg p-1 focus:border-black transition-colors"
                />
            </div>
        </motion.div>
    );
}
