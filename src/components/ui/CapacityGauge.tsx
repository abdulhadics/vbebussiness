'use client';
import { motion } from 'framer-motion';

interface CapacityGaugeProps {
    level: 1 | 2 | 3;
    onChange: (level: 1 | 2 | 3) => void;
}

export function CapacityGauge({ level, onChange }: CapacityGaugeProps) {
    const segments = [
        { level: 1 as const, label: 'Standard', capacity: '576h', cost: '1.0x' },
        { level: 2 as const, label: 'Overtime', capacity: '1068h', cost: '1.5x' },
        { level: 3 as const, label: 'Maximum', capacity: '1602h', cost: '2.0x' },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                {segments.map((seg, idx) => (
                    <motion.button
                        key={seg.level}
                        onClick={() => onChange(seg.level)}
                        className={`flex-1 h-10 rounded-md transition-all relative overflow-hidden ${level >= seg.level
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500'
                                : 'bg-slate-800 border border-slate-700'
                            }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {level >= seg.level && (
                            <motion.div
                                className="absolute inset-0 bg-white/10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.2, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="flex justify-between text-xs">
                {segments.map(seg => (
                    <button
                        key={seg.level}
                        onClick={() => onChange(seg.level)}
                        className={`flex-1 text-center py-2 rounded transition-all ${level === seg.level
                                ? 'text-emerald-400 bg-emerald-500/10'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <div className="font-bold">{seg.label}</div>
                        <div className="font-mono opacity-70">{seg.capacity}</div>
                        <div className={`mt-1 ${level === seg.level ? 'text-amber-400' : ''}`}>{seg.cost} wages</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
