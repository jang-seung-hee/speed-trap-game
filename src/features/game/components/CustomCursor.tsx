import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomCursorProps {
    isVisible: boolean;
    cursorRef: React.RefObject<HTMLDivElement | null>;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ isVisible, cursorRef }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    // Outer container handles Position (via Ref) and Opacity (via Framer)
                    // We DO NOT animate x/y or scale here to avoid conflict with manual ref updates
                    ref={cursorRef as any}
                    className="fixed top-0 left-0 z-[300] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    style={{ willChange: 'transform' }}
                >
                    {/* Inner container handles Scale animation safely */}
                    <motion.div
                        className="relative w-12 h-12 flex items-center justify-center"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.5 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                    >
                        <div className="absolute w-full h-full border-[3px] border-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
                        <div className="absolute w-8 h-1 bg-white border border-black/50" />
                        <div className="absolute h-8 w-1 bg-white border border-black/50" />
                        <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full border border-black shadow-lg" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
