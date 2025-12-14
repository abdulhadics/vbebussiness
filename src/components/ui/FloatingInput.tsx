'use client';
import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface FloatingInputProps {
    label: string;
    value: number | string;
    onChange: (value: number) => void;
    type?: 'number' | 'text' | 'range';
    prefix?: string;
    suffix?: string;
    min?: number;
    max?: number;
    step?: number;
    helperText?: string;
    helperType?: 'default' | 'success' | 'warning' | 'danger';
    icon?: ReactNode;
    disabled?: boolean;
}

export function FloatingInput({
    label,
    value,
    onChange,
    type = 'number',
    prefix = '',
    suffix = '',
    min,
    max,
    step = 1,
    helperText,
    helperType = 'default',
    icon,
    disabled = false
}: FloatingInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const helperColors = {
        default: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
        success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
        warning: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
        danger: 'bg-rose-500/15 text-rose-300 border-rose-500/20'
    };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`
                input-pod
                relative
                ${isFocused ? 'ring-2 ring-indigo-500/30' : ''}
                ${disabled ? 'opacity-50' : ''}
            `}
        >
            {/* Label */}
            <label className="input-pod-label flex items-center gap-2">
                {icon}
                {label}
            </label>

            {/* Input Container */}
            <div className="flex items-center gap-2">
                {prefix && (
                    <span className="text-slate-500 font-mono text-xl">{prefix}</span>
                )}

                <input
                    type={type}
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    disabled={disabled}
                    onChange={(e) => onChange(Number(e.target.value))}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="input-pod-value flex-1"
                />

                {suffix && (
                    <span className="text-slate-500 font-mono text-lg">{suffix}</span>
                )}
            </div>

            {/* Range Slider (if applicable) */}
            {type === 'number' && min !== undefined && max !== undefined && (
                <div className="mt-3 relative">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-slate-700" />
                        <div
                            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-200"
                            style={{ width: `${((Number(value) - min) / (max - min)) * 100}%` }}
                        />
                    </div>
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        disabled={disabled}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
                        style={{ opacity: 0 }}
                    />
                </div>
            )}

            {/* Helper Text */}
            {helperText && (
                <div className="mt-3 flex justify-between items-center">
                    <span className={`
                        inline-flex items-center
                        px-3 py-1
                        rounded-full
                        text-xs font-semibold
                        border
                        ${helperColors[helperType]}
                    `}>
                        {helperText}
                    </span>

                    {min !== undefined && max !== undefined && (
                        <span className="text-xs text-slate-500 font-mono">
                            {min} — {max}
                        </span>
                    )}
                </div>
            )}
        </motion.div>
    );
}

// Compact Version for Grid Layouts
export function CompactInput({
    label,
    value,
    onChange,
    prefix,
    min,
    max,
    step = 1
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    prefix?: string;
    min?: number;
    max?: number;
    step?: number;
}) {
    return (
        <div className="bg-slate-800/40 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                {label}
            </div>
            <div className="flex items-center gap-2">
                {prefix && <span className="text-slate-400">{prefix}</span>}
                <input
                    type="number"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full bg-transparent text-white text-xl font-bold font-mono outline-none"
                />
            </div>
        </div>
    );
}
