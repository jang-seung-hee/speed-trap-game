
import { useState, useCallback, useEffect } from 'react';
import { soundManager } from '../utils/SoundManager';
import { RewardEffect, PhaseConfig } from '../constants';

interface UseComboRewardsProps {
    combo: number;
    phaseConfig: PhaseConfig;
}

export const useComboRewards = ({ combo, phaseConfig }: UseComboRewardsProps) => {
    const [availableReward, setAvailableReward] = useState<{ threshold: number } | null>(null);

    // 콤보 마일스톤 체크 (20, 30, 40, 50)
    useEffect(() => {
        if ([20, 30, 40, 50].includes(combo)) {
            setAvailableReward({ threshold: combo });
            soundManager.playPowerUp(); // 보상 사용 가능 알림
        }
        if (combo === 0) {
            setAvailableReward(null);
        }
    }, [combo]);

    const claimReward = useCallback((onComplete: (effect: RewardEffect) => void) => {
        if (!availableReward) return;

        // 스테이지별 설정된 확률에 따라 랜덤 선택
        const probs = phaseConfig.rewardProbs;
        const effects: RewardEffect[] = [
            'HEAL_50',
            'HEAL_100',
            'SHIELD',
            'BOMB_ALL',
            'BOMB_HALF',
            'ROAD_NARROW',
            'CAMERA_BOOST',
            'SLOW_TIME'
        ];

        // 확률 배열 생성
        const probArray = effects.map(effect => probs[effect]);
        const totalProb = probArray.reduce((sum, p) => sum + p, 0);

        // 랜덤 선택
        let random = Math.random() * totalProb;
        let selectedEffect: RewardEffect = 'HEAL_50';

        for (let i = 0; i < effects.length; i++) {
            random -= probArray[i];
            if (random <= 0) {
                selectedEffect = effects[i];
                break;
            }
        }

        onComplete(selectedEffect);
        setAvailableReward(null);
    }, [availableReward, phaseConfig]);

    return {
        availableReward,
        claimReward
    };
};
