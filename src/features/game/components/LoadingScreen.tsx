import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_TIPS } from '../data/gameTips';

interface LoadingScreenProps {
    onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [tip, setTip] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Random tip
        const randomTip = GAME_TIPS[Math.floor(Math.random() * GAME_TIPS.length)];
        setTip(randomTip);

        // Simulate loading
        const duration = 5000; // 5.0 seconds loading
        const interval = 20;
        const steps = duration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const newProgress = Math.min((currentStep / steps) * 100, 100);
            setProgress(newProgress);

            if (currentStep >= steps) {
                clearInterval(timer);
                setTimeout(onComplete, 500); // Slight delay after 100%
            }
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[300] bg-black flex flex-col items-center justify-center p-8"
        >
            {/* Loading Text */}
            <h2 className="text-4xl font-black text-white italic tracking-widest mb-12 animate-pulse">
                LOADING DATA...
            </h2>



            {/* Progress Bar */}
            <div className="w-full max-w-md h-2 bg-white/20 rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-yellow-400"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Tip Box */}
            <div className="max-w-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                <div className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">
                    GAME TIP
                </div>
                <p className="text-white text-lg font-medium leading-relaxed break-keep">
                    {tip}
                </p>
            </div>
        </motion.div>
    );
};
