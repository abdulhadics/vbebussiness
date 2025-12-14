'use client';
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glow?: 'blue' | 'purple' | 'emerald' | 'amber' | 'none';
    delay?: number;
}

export function GlassCard({
    children,
    className = "",
    hover = true,
    glow = 'none',
    delay = 0,
    ...motionProps
}: GlassCardProps) {

    const glowStyles: Record<string, string> = {
        blue: 'hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.25)]',
        purple: 'hover:shadow-[0_25px_50px_-12px_rgba(139,92,246,0.25)]',
        emerald: 'hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25)]',
        amber: 'hover:shadow-[0_25px_50px_-12px_rgba(245,158,11,0.25)]',
        none: ''
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
            whileHover={hover ? {
                y: -4,
                transition: { duration: 0.2 }
            } : undefined}
            className={`
                bg-white/5 
                backdrop-blur-xl 
                border border-white/10 
                rounded-2xl 
                p-6
                shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]
                transition-all duration-300
                ${glowStyles[glow]}
                ${className}
            `}
            {...motionProps}
        >
            {children}
        </motion.div>
    );
}

// Simplified version without animation
export function StaticGlassCard({
    children,
    className = ""
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`
            bg-white/5 
            backdrop-blur-xl 
            border border-white/10 
            rounded-2xl 
            p-6
            shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]
            ${className}
        `}>
            {children}
        </div>
    );
}
