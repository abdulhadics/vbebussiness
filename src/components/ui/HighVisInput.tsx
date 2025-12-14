'use client';
import { useState, useEffect } from 'react';

interface HighVisInputProps {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (val: number) => void;
    helperText?: string;
    prefix?: string;
    step?: number;
}

export function HighVisInput({ label, value, min, max, onChange, helperText, prefix = '', step = 1 }: HighVisInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (newValue: number) => {
        setLocalValue(newValue);
        onChange(newValue);
    };

    // Dynamic helper chip logic
    const getHelperChip = () => {
        const ratio = (localValue - min) / (max - min);
        if (ratio > 0.8) return { text: 'Maximum', type: 'danger' };
        if (ratio > 0.6) return { text: 'High', type: 'warning' };
        if (ratio < 0.2 && localValue > 0) return { text: 'Low', type: 'neutral' };
        return null;
    };

    const chip = getHelperChip();
    const percentage = ((localValue - min) / (max - min)) * 100;

    return (
        <div className="space-y-3 group">
            {/* Label Row */}
            <div className="flex justify-between items-center">
                {label && (
                    <label className="text-sm font-bold uppercase text-slate-300 tracking-widest">
                        {label}
                    </label>
                )}
                <div className="flex items-center gap-2">
                    {helperText && (
                        <span className="helper-chip">{helperText}</span>
                    )}
                    {chip && (
                        <span className={`helper-chip ${chip.type === 'danger' ? 'danger' : chip.type === 'warning' ? 'warning' : ''}`}>
                            {chip.text}
                        </span>
                    )}
                </div>
            </div>

            {/* Input Container - ENHANCED VISIBILITY */}
            <div className={`control-module relative flex items-center transition-all ${isFocused ? 'neon-glow border-emerald-500' : ''}`}>
                {prefix && (
                    <span className="pl-4 text-emerald-400 font-bold text-lg select-none">{prefix}</span>
                )}

                <input
                    type="number"
                    value={localValue}
                    min={min} max={max} step={step}
                    onChange={(e) => handleChange(Number(e.target.value))}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full bg-transparent text-white font-mono text-xl font-bold p-4 outline-none placeholder-slate-600"
                    placeholder="0"
                    style={{ fontSize: '20px' }}
                />

                {/* Visual indicator dot */}
                <div className="pr-4 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full transition-all ${localValue > max * 0.75 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]' :
                            localValue > max * 0.5 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]' :
                                'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]'
                        }`}></div>
                </div>
            </div>

            {/* Range Slider - ENHANCED VISIBILITY */}
            <div className="relative h-4 group/slider">
                {/* Track Background */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-slate-700 rounded-full overflow-hidden">
                    {/* Filled Track */}
                    <div
                        style={{ width: `${percentage}%` }}
                        className={`h-full transition-all ${percentage > 75 ? 'bg-gradient-to-r from-emerald-500 to-rose-500' :
                                percentage > 50 ? 'bg-gradient-to-r from-emerald-500 to-amber-500' :
                                    'bg-emerald-500'
                            }`}
                    ></div>
                </div>

                {/* Invisible Range Input */}
                <input
                    type="range"
                    min={min} max={max} step={step}
                    value={localValue}
                    onChange={(e) => handleChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {/* Visible Thumb */}
                <div
                    style={{ left: `${percentage}%` }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-lg pointer-events-none transition-all border-2 border-emerald-500 group-hover/slider:scale-125"
                ></div>
            </div>

            {/* Min/Max Labels */}
            <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>{prefix}{min}</span>
                <span>{prefix}{max}</span>
            </div>
        </div>
    )
}
