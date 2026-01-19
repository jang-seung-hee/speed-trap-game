
import { useState, useCallback, useEffect } from 'react';
import { soundManager } from '../utils/SoundManager';

export type RewardEffectType = 'HEAL' | 'SHIELD' | 'SCORE' | 'TIME_SLOW' | 'ZONE_EXPAND' | 'NUKE';

export interface RewardEffect {
    type: RewardEffectType;
    value: number; // Heal amount, Score amount, Slow %, Zone %, etc.
    duration?: number; // ms, for Time Slow / Zone Expand
}

export interface ComboReward {
    id: string;
    comboThreshold: number;
    options: RewardEffect[];
}

export const USE_COMBO_REWARDS = {
    20: [
        { type: 'HEAL', value: 20 },
        { type: 'SHIELD', value: 1 },
        { type: 'SCORE', value: 200 }
    ],
    30: [
        { type: 'HEAL', value: 30 },
        { type: 'SHIELD', value: 1 },
        { type: 'SCORE', value: 300 }
    ],
    40: [
        { type: 'HEAL', value: 40 },
        { type: 'SHIELD', value: 1 },
        { type: 'SCORE', value: 400 },
        { type: 'NUKE', value: 200 }, // value per car
        { type: 'ZONE_EXPAND', value: 20, duration: 20000 } // Zone +20%, Time -20% (handled in logic)
    ],
    50: [
        { type: 'HEAL', value: 50 },
        { type: 'SCORE', value: 500 },
        { type: 'NUKE', value: 200 },
        { type: 'ZONE_EXPAND', value: 20, duration: 20000 }
    ]
} as const;

interface UseComboRewardsProps {
    combo: number;
}

export const useComboRewards = ({ combo }: UseComboRewardsProps) => {
    const [availableReward, setAvailableReward] = useState<{ threshold: number } | null>(null);

    // Watch combo milestones
    useEffect(() => {
        if ([20, 30, 40, 50].includes(combo)) {
            setAvailableReward({ threshold: combo });
            soundManager.playPowerUp(); // Alarm for reward availability
        }
        if (combo === 0) {
            setAvailableReward(null);
        }
    }, [combo]);

    const claimReward = useCallback((onComplete: (effect: RewardEffect) => void) => {
        if (!availableReward) return;

        const threshold = availableReward.threshold as keyof typeof USE_COMBO_REWARDS;
        const options = USE_COMBO_REWARDS[threshold];

        if (!options) return;

        // Randomly select one effect
        const selected = options[Math.floor(Math.random() * options.length)] as RewardEffect;

        onComplete(selected);
        setAvailableReward(null);
    }, [availableReward]);

    return {
        availableReward,
        claimReward
    };
};
