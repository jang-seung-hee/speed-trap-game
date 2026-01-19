import React from 'react';
import { motion } from 'framer-motion';

interface PauseOverlayProps {
    isPaused: boolean;
    onResume: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({ isPaused, onResume }) => {
    if (!isPaused) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[150] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onResume}
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-black/60 border border-white/10 p-8 rounded-3xl flex flex-col items-center gap-4"
            >
                <div className="text-4xl font-black text-white italic tracking-tighter">PAUSED</div>
                <div className="text-sm text-white/50 animate-pulse">TAP TO RESUME</div>
            </motion.div>
        </motion.div>
    );
};
