
import { useState, useCallback, useEffect } from 'react';
import { soundManager } from '../utils/SoundManager';
import { RewardEffect, PhaseConfig } from '../constants';

interface UseComboRewardsProps {
    combo: number;
    phaseConfig: PhaseConfig;
}

export const useComboRewards = ({ combo, phaseConfig }: UseComboRewardsProps) => {
    const [availableReward, setAvailableReward] = useState<{ threshold: number } | null>(null);

    // 콤보 마일스톤 체크 (설정된 콤보 보상 키에 따라 동적 체크)
    useEffect(() => {
        if (!phaseConfig.comboRewards) return;

        const thresholds = Object.keys(phaseConfig.comboRewards).map(Number);

        if (thresholds.includes(combo)) {
            setAvailableReward({ threshold: combo });
            soundManager.playPowerUp(); // 보상 사용 가능 알림
        }
        if (combo === 0) {
            setAvailableReward(null);
        }
    }, [combo, phaseConfig]);

    const claimReward = useCallback((onComplete: (effect: RewardEffect) => void) => {
        if (!availableReward) return;

        // 해당 콤보 단계에 설정된 활성화된 효과 배열 가져오기
        const effects = phaseConfig.comboRewards?.[availableReward.threshold];

        if (!effects || effects.length === 0) {
            console.warn(`No active rewards for combo ${availableReward.threshold}`);
            setAvailableReward(null);
            return;
        }

        // 활성화된 효과 중 랜덤 선택
        const randomIndex = Math.floor(Math.random() * effects.length);
        const selectedEffect = effects[randomIndex];

        onComplete(selectedEffect);
        setAvailableReward(null);
    }, [availableReward, phaseConfig]);

    return {
        availableReward,
        claimReward
    };
};
