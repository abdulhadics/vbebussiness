'use client';

import { motion, LayoutGroup } from 'framer-motion';
import { Rocket, Save, Trash2, RotateCcw, Pause, Play, Lock } from 'lucide-react';
import { useState } from 'react';

interface GameControlsDockProps {
    onRunQuarter: () => void;
    onSave: () => void;
    onDiscard: () => void;
    onReset: () => void;
    isProcessing?: boolean;
    isLocked?: boolean;
    currentQuarter?: number;
    companyName?: string;
}

export function GameControlsDock({
    onRunQuarter,
    onSave,
    onDiscard,
    onReset,
    isProcessing = false,
    isLocked = false,
    currentQuarter = 1,
    companyName = 'Company 1',
}: GameControlsDockProps) {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    // Button configuration
    const secondaryButtons = [
        {
            id: 'save',
            icon: Save,
            label: 'Save',
            onClick: onSave,
            color: 'hover:bg-blue-500/20 hover:text-blue-400',
        },
        {
            id: 'discard',
            icon: Trash2,
            label: 'Discard',
            onClick: onDiscard,
            color: 'hover:bg-amber-500/20 hover:text-amber-400',
        },
        {
            id: 'reset',
            icon: RotateCcw,
            label: 'Reset',
            onClick: onReset,
            color: 'hover:bg-rose-500/20 hover:text-rose-400',
        },
    ];

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                delay: 0.2,
            }}
            className="sticky bottom-6 mx-auto z-[100] w-max max-w-[95vw] pointer-events-none mb-6"
        >
            {/* The Floating Glass Dock */}
            <LayoutGroup>
                <motion.div
                    layout
                    className={`
            flex items-center gap-2 sm:gap-4
            px-4 py-3 sm:px-6
            rounded-full
            bg-slate-900/80
            backdrop-blur-xl
            border border-white/10
            shadow-2xl
            pointer-events-auto
            transition-all duration-300
            ${isLocked ? 'grayscale opacity-75 pointer-events-none' : ''}
          `}
                    style={{
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    }}
                >
                    {/* Company/Quarter Indicator */}
                    <motion.div
                        layout
                        className="flex items-center gap-3 pr-4 border-r border-white/10"
                    >
                        <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-slate-500' : 'bg-emerald-400 animate-pulse'}`} />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium">
                                {companyName}
                            </span>
                            <span className="text-sm font-bold text-white">
                                Quarter {currentQuarter}
                            </span>
                        </div>
                    </motion.div>

                    {/* Secondary Buttons - Save, Discard, Reset */}
                    <div className="flex items-center gap-2">
                        {secondaryButtons.map((button) => (
                            <motion.button
                                key={button.id}
                                layout
                                onClick={button.onClick}
                                onHoverStart={() => setHoveredButton(button.id)}
                                onHoverEnd={() => setHoveredButton(null)}
                                whileHover={{ scale: 1.15, y: -4 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={isLocked}
                                className={`
                  relative
                  w-11 h-11
                  flex items-center justify-center
                  rounded-full
                  bg-white/5
                  text-gray-400
                  transition-colors duration-200
                  ${button.color}
                  ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                            >
                                <button.icon size={18} />

                                {/* Tooltip */}
                                {!isLocked && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                        animate={{
                                            opacity: hoveredButton === button.id ? 1 : 0,
                                            y: hoveredButton === button.id ? 0 : 10,
                                            scale: hoveredButton === button.id ? 1 : 0.8,
                                        }}
                                        className="
                    absolute -top-10 left-1/2 -translate-x-1/2
                    px-3 py-1.5
                    rounded-lg
                    bg-slate-800
                    text-white text-xs font-medium
                    whitespace-nowrap
                    pointer-events-none
                    border border-white/10
                  "
                                    >
                                        {button.label}
                                    </motion.span>
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="w-px h-8 bg-white/10" />

                    {/* Primary Button - RUN QUARTER */}
                    <motion.button
                        layout
                        onClick={onRunQuarter}
                        disabled={isProcessing || isLocked}
                        onHoverStart={() => setHoveredButton('run')}
                        onHoverEnd={() => setHoveredButton(null)}
                        whileHover={!isLocked ? { scale: 1.08, y: -2 } : {}}
                        whileTap={!isLocked ? { scale: 0.95 } : {}}
                        className={`
              relative
              flex items-center gap-3
              h-12 px-8
              rounded-full
              font-bold text-sm
              uppercase tracking-wider
              transition-all duration-300
              ${isProcessing || isLocked
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-white/5'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-emerald-500/30'
                            }
            `}
                        style={{
                            boxShadow: (isProcessing || isLocked)
                                ? 'none'
                                : '0 8px 32px rgba(16, 185, 129, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        }}
                    >
                        {/* Pulse effect ring (Only if active and not locked) */}
                        {!isProcessing && !isLocked && (
                            <motion.div
                                className="absolute inset-0 rounded-full bg-emerald-500/30"
                                animate={{
                                    scale: [1, 1.15, 1],
                                    opacity: [0.5, 0, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                        )}

                        {/* Button content */}
                        {isLocked ? (
                            <Lock size={20} className="text-gray-500" />
                        ) : (
                            <motion.div
                                animate={isProcessing ? {} : { rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                            >
                                <Rocket size={20} className={isProcessing ? '' : ''} />
                            </motion.div>
                        )}

                        <span className="relative z-10">
                            {isLocked ? 'Locked' : isProcessing ? 'Processing...' : 'Run Quarter'}
                        </span>
                    </motion.button>
                </motion.div>
            </LayoutGroup>

            {/* Glow effect under the dock (Hide if locked) */}
            {!isLocked && (
                <div
                    className="
          absolute -bottom-4 left-1/2 -translate-x-1/2
          w-3/4 h-8
          bg-gradient-to-r from-emerald-500/20 via-teal-500/30 to-emerald-500/20
          blur-2xl
          rounded-full
          pointer-events-none
        "
                />
            )}
        </motion.div>
    );
}
