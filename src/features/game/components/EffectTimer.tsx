import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EffectTimerProps {
    roadNarrowEndTime: number;
    roadNarrowTimerValid: boolean;
    cameraBoostEndTime: number;
    cameraBoostTimerValid: boolean;
    slowTimeEndTime: number;
    slowTimeTimerValid: boolean;
    doubleScoreEndTime: number;
    doubleScoreTimerValid: boolean;
    searchlightEndTime: number;
    searchlightTimerValid: boolean;
}

interface ActiveEffect {
    name: string;
    color: string;
    remaining: number;
}

export const EffectTimer: React.FC<EffectTimerProps> = ({
    roadNarrowEndTime,
    roadNarrowTimerValid,
    cameraBoostEndTime,
    cameraBoostTimerValid,
    slowTimeEndTime,
    slowTimeTimerValid,
    doubleScoreEndTime,
    doubleScoreTimerValid,
    searchlightEndTime,
    searchlightTimerValid
}) => {
    const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const effects: ActiveEffect[] = [];

            // 도로 정비
            if (roadNarrowEndTime > now && roadNarrowTimerValid) {
                const remaining = Math.ceil((roadNarrowEndTime - now) / 1000);
                if (remaining <= 5) {
                    effects.push({ name: '도로 정비', color: '#f39c12', remaining });
                }
            }

            // 카메라 강화
            if (cameraBoostEndTime > now && cameraBoostTimerValid) {
                const remaining = Math.ceil((cameraBoostEndTime - now) / 1000);
                if (remaining <= 5) {
                    effects.push({ name: '카메라 강화', color: '#ffa502', remaining });
                }
            }

            // 슬로우
            if (slowTimeEndTime > now && slowTimeTimerValid) {
                const remaining = Math.ceil((slowTimeEndTime - now) / 1000);
                if (remaining <= 5) {
                    effects.push({ name: '슬로우', color: '#a55eea', remaining });
                }
            }

            // 더블득점
            if (doubleScoreEndTime > now && doubleScoreTimerValid) {
                const remaining = Math.ceil((doubleScoreEndTime - now) / 1000);
                if (remaining <= 5) {
                    effects.push({ name: '더블득점', color: '#FFD700', remaining });
                }
            }

            // 서치라이트
            if (searchlightEndTime > now && searchlightTimerValid) {
                const remaining = Math.ceil((searchlightEndTime - now) / 1000);
                if (remaining <= 5) {
                    effects.push({ name: '서치라이트', color: '#00CED1', remaining });
                }
            }

            setActiveEffects(effects);
        }, 100); // 100ms마다 업데이트

        return () => clearInterval(interval);
    }, [roadNarrowEndTime, roadNarrowTimerValid, cameraBoostEndTime, cameraBoostTimerValid, slowTimeEndTime, slowTimeTimerValid, doubleScoreEndTime, doubleScoreTimerValid, searchlightEndTime, searchlightTimerValid]);

    return (
        <div className="absolute top-32 left-6 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {activeEffects.map((effect) => (
                    <motion.div
                        key={effect.name}
                        initial={{ opacity: 0, x: -20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.8 }}
                        className="flex items-center gap-3 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full border-2"
                        style={{ borderColor: effect.color }}
                    >
                        <span
                            className="text-sm font-bold"
                            style={{ color: effect.color }}
                        >
                            {effect.name}
                        </span>
                        <motion.div
                            key={effect.remaining}
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-center w-8 h-8 rounded-full font-black text-lg"
                            style={{
                                backgroundColor: `${effect.color}20`,
                                color: effect.color,
                                boxShadow: `0 0 15px ${effect.color}80`
                            }}
                        >
                            {effect.remaining}
                        </motion.div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
