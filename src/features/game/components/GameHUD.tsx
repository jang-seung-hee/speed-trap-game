import React from 'react';
import { motion } from 'framer-motion';

interface GameHUDProps {
    hp: number;
    maxHp: number;
    score: number;
    comboScore: number;
    phase: number;
    shield?: number;
    doubleScoreActive?: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({ hp, maxHp, score, comboScore, phase, shield = 0, doubleScoreActive = false }) => {
    return (
        <div className="absolute top-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center w-36">
                    <span className="text-[10px] font-black text-white/50 tracking-widest uppercase italic">Battery / HP</span>
                    <span className="text-xs font-bold text-red-500">{Math.round(hp)} / {Math.round(maxHp)}</span>
                </div>
                <div className="w-36 h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        className="h-full bg-gradient-to-r from-red-600 to-orange-400"
                        animate={{ width: `${(hp / maxHp) * 100}%` }}
                    />
                </div>

                {/* Shield Display */}
                {shield > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mt-2 flex items-center gap-2"
                    >
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                            <div className="w-3 h-3 bg-cyan-400 rounded-sm transform rotate-45" />
                        </div>
                        <span className="text-cyan-400 font-bold text-sm italic">SHIELD x{shield}</span>
                    </motion.div>
                )}
            </div>

            <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-white/50 tracking-widest uppercase italic">Score</span>
                <div className="flex items-center gap-2">
                    <div className="text-4xl font-black text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)] italic tracking-tighter">
                        {(score + comboScore).toString().padStart(6, '0')}
                    </div>
                    {/* Double Score Indicator */}
                    {doubleScoreActive && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/20 border-2 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                        >
                            <span className="text-yellow-400 font-black text-lg italic">×2</span>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white/50 tracking-widest uppercase italic">Phase</span>
                <div className="text-2xl font-black text-yellow-400 italic">#{phase}</div>
            </div>
        </div>
    );
};
