
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/SoundManager';

interface ComboRewardButtonProps {
    availableReward: { threshold: number } | null;
    onClaim: () => void;
}

export const ComboRewardButton: React.FC<ComboRewardButtonProps> = ({ availableReward, onClaim }) => {
    if (!availableReward) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="absolute top-28 right-4 z-50 flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0.5, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <div className="absolute -inset-4 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />

                <button
                    onClick={() => {
                        soundManager.playClick();
                        onClaim();
                    }}
                    className="relative group"
                >
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.6)] flex flex-col items-center justify-center border-2 border-yellow-200 transform hover:scale-105 active:scale-95 transition-transform">
                        <span className="text-[10px] font-black italic text-yellow-900 uppercase">Supplies</span>
                        <div className="text-3xl">🎁</div>
                        <span className="text-[8px] font-bold text-yellow-900 mt-1 bg-white/30 px-1 rounded">CLICK!</span>
                    </div>

                    {/* Badge */}
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                        !
                    </div>

                    {/* Tooltip-ish text */}
                    <div className="absolute top-1/2 right-full mr-3 -translate-y-1/2 whitespace-nowrap">
                        <div className="bg-black/80 backdrop-blur text-yellow-400 text-sm font-bold px-3 py-1 rounded-lg border border-yellow-400/30">
                            {availableReward.threshold} COMBO REWARD
                        </div>
                    </div>
                </button>
            </motion.div>
        </AnimatePresence>
    );
};
