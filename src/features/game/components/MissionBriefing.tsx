import React from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/SoundManager';
import { GAME_SETTINGS } from '../constants';

interface MissionBriefingProps {
    phase: number;
    prevStageResult: { type: 'PERFECT' | 'NORMAL' | null, value: number } | null;
    countdown: number | null;
    onStartPhase: () => void;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({ phase, prevStageResult, countdown, onStartPhase }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl"
        >
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="text-center px-8"
            >
                <motion.div
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-yellow-400 text-sm font-black uppercase tracking-[0.5em] mb-4"
                >
                    {prevStageResult ? (prevStageResult.type === 'PERFECT' ? 'PERFECT MISSION CLEAR!' : 'MISSION COMPLETE') : 'Mission Briefing'}
                </motion.div>

                {prevStageResult && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mb-8 p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md"
                    >
                        <div className={`text-2xl font-black italic mb-1 ${prevStageResult.type === 'PERFECT' ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {prevStageResult.type === 'PERFECT' ? 'MAX HP POWER UP!' : 'HP RECOVERED'}
                        </div>
                        <div className="text-4xl font-black text-white">
                            {prevStageResult.type === 'PERFECT' ? `+10%` : `+${Math.round(prevStageResult.value)}`}
                        </div>
                        <div className="text-[10px] text-white/50 uppercase tracking-widest mt-1">
                            {prevStageResult.type === 'PERFECT' ? 'PERFECT REWARD' : 'FIELD REPAIR'}
                        </div>
                    </motion.div>
                )}

                <h2 className="text-5xl font-black text-white italic tracking-tighter mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    PHASE #{phase}
                </h2>

                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-8" />

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 backdrop-blur-sm max-w-sm mx-auto">
                    <p className="text-blue-100 text-lg font-bold leading-snug break-keep mb-4">
                        {GAME_SETTINGS.PHASES[phase]?.description}
                    </p>
                    <div className="flex justify-center gap-4 text-[9px] text-white/30 font-bold uppercase tracking-[0.2em]">
                        <span>Target: {GAME_SETTINGS.TARGET_SPEED}km/h</span>
                        <span>•</span>
                        <span>Lanes: {GAME_SETTINGS.LANES}</span>
                    </div>
                </div>

                {countdown === null ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            soundManager.playClick();
                            onStartPhase();
                        }}
                        className="px-10 py-4 bg-yellow-400 text-black text-xl font-black italic rounded-full shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_rgba(234,179,8,0.5)] transition-all whitespace-nowrap"
                    >
                        READY TO ACTION
                    </motion.button>
                ) : (
                    <motion.div
                        key={countdown}
                        initial={{ scale: 2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-9xl font-black text-white italic"
                    >
                        {countdown}
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};
