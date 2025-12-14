'use client';
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BubbleButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    pulse?: boolean;
    disabled?: boolean;
    className?: string;
    icon?: ReactNode;
}

export function BubbleButton({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    pulse = false,
    disabled = false,
    className = "",
    icon
}: BubbleButtonProps) {

    const variants = {
        primary: `
            bg-gradient-to-r from-emerald-500 to-emerald-600
            text-white
            shadow-[0_10px_30px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]
            hover:shadow-[0_15px_40px_rgba(16,185,129,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]
        `,
        secondary: `
            bg-gradient-to-r from-indigo-500 to-purple-600
            text-white
            shadow-[0_10px_30px_rgba(99,102,241,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
            hover:shadow-[0_15px_40px_rgba(99,102,241,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]
        `,
        ghost: `
            bg-white/5
            text-slate-300
            border border-white/10
            hover:bg-white/10
            hover:text-white
        `,
        danger: `
            bg-gradient-to-r from-rose-500 to-pink-600
            text-white
            shadow-[0_10px_30px_rgba(244,63,94,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
        `
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs gap-2',
        md: 'px-6 py-3 text-sm gap-2.5',
        lg: 'px-8 py-4 text-base gap-3'
    };

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.05, filter: "brightness(1.1)" }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            className={`
                relative
                inline-flex items-center justify-center
                rounded-full
                font-bold
                uppercase
                tracking-widest
                transition-all duration-200
                overflow-hidden
                ${variants[variant]}
                ${sizes[size]}
                ${pulse && !disabled ? 'bubble-btn-pulse' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
        >
            {/* Gloss Overlay */}
            <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-full pointer-events-none" />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {icon}
                {children}
            </span>
        </motion.button>
    );
}

// Execute Button - Special styling for the main action
export function ExecuteButton({
    onClick,
    disabled,
    children = "Execute Quarter"
}: {
    onClick?: () => void;
    disabled?: boolean;
    children?: ReactNode;
}) {
    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.05 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            className={`
                relative
                px-10 py-4
                rounded-full
                font-bold text-sm
                uppercase tracking-widest
                text-white
                bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500
                shadow-[0_10px_40px_rgba(16,185,129,0.5)]
                overflow-hidden
                group
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            animate={disabled ? {} : {
                boxShadow: [
                    '0 10px 40px rgba(16,185,129,0.5)',
                    '0 10px 60px rgba(16,185,129,0.7)',
                    '0 10px 40px rgba(16,185,129,0.5)'
                ]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {/* Shine Effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

            {/* Gloss */}
            <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full" />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-3">
                <span className="text-lg">🚀</span>
                {children}
            </span>
        </motion.button>
    );
}
