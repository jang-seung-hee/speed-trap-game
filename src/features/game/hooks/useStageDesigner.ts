/**
 * 스테이지 디자이너 상태 관리 훅
 * 로컬 스토리지 연동 및 스테이지 추가/삭제/수정 로직
 */

import { useState, useEffect } from 'react';
import { PhaseConfig } from '@/features/game/constants';
import {
    CustomGameSettings,
    loadCustomSettings,
    saveCustomSettings,
    getDefaultSettings,
    getCurrentSettings,
    downloadSettingsAsFile
} from '@/features/game/utils/stageDesignerStorage';

export const useStageDesigner = () => {
    const [settings, setSettings] = useState<CustomGameSettings>(getCurrentSettings());
    const [selectedStage, setSelectedStage] = useState<number>(1);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // 로컬 스토리지에서 설정 로드
    useEffect(() => {
        const loaded = getCurrentSettings();
        setSettings(loaded);
    }, []);

    // 전역 설정 업데이트
    const updateGlobalSettings = (newSettings: CustomGameSettings) => {
        setSettings(newSettings);
        setHasUnsavedChanges(true);
    };

    // 특정 스테이지 설정 업데이트
    const updateStageConfig = (stageNum: number, config: PhaseConfig) => {
        setSettings((prev) => ({
            ...prev,
            PHASES: {
                ...prev.PHASES,
                [stageNum]: config
            }
        }));
        setHasUnsavedChanges(true);
    };

    // 스테이지 추가 (특정 스테이지 뒤에 삽입)
    const addStageAfter = (afterStage: number) => {
        const newPhases: Record<number, PhaseConfig> = {};
        const stageNumbers = Object.keys(settings.PHASES).map(Number).sort((a, b) => a - b);

        // 기본 템플릿 (afterStage의 설정을 복사)
        const templateConfig = settings.PHASES[afterStage] || settings.PHASES[1];

        stageNumbers.forEach((num) => {
            if (num <= afterStage) {
                newPhases[num] = settings.PHASES[num];
            } else {
                newPhases[num + 1] = settings.PHASES[num];
            }
        });

        // 새 스테이지 삽입
        newPhases[afterStage + 1] = {
            ...templateConfig,
            description: `새 스테이지 ${afterStage + 1}`
        };

        setSettings((prev) => ({
            ...prev,
            PHASES: newPhases
        }));
        setSelectedStage(afterStage + 1);
        setHasUnsavedChanges(true);
    };

    // 스테이지 삭제
    const deleteStage = (stageNum: number) => {
        const newPhases: Record<number, PhaseConfig> = {};
        const stageNumbers = Object.keys(settings.PHASES).map(Number).sort((a, b) => a - b);

        let newNum = 1;
        stageNumbers.forEach((num) => {
            if (num !== stageNum) {
                newPhases[newNum] = settings.PHASES[num];
                newNum++;
            }
        });

        setSettings((prev) => ({
            ...prev,
            PHASES: newPhases
        }));

        if (selectedStage === stageNum) {
            setSelectedStage(1);
        } else if (selectedStage > stageNum) {
            setSelectedStage(selectedStage - 1);
        }

        setHasUnsavedChanges(true);
    };

    // 설정 저장 (로컬 스토리지)
    const saveSettings = () => {
        saveCustomSettings(settings);
        setHasUnsavedChanges(false);
        alert('설정이 저장되었습니다!');
    };

    // 특정 스테이지를 기본값으로 초기화
    const resetStage = (stageNum: number) => {
        const defaultSettings = getDefaultSettings();
        if (defaultSettings.PHASES[stageNum]) {
            updateStageConfig(stageNum, defaultSettings.PHASES[stageNum]);
        }
    };

    // 모든 설정을 기본값으로 초기화
    const resetAllSettings = () => {
        if (confirm('모든 설정을 기본값으로 초기화하시겠습니까?')) {
            const defaultSettings = getDefaultSettings();
            setSettings(defaultSettings);
            setHasUnsavedChanges(false);
        }
    };

    // TypeScript 파일로 다운로드
    const exportSettings = () => {
        downloadSettingsAsFile(settings);
    };

    return {
        settings,
        selectedStage,
        setSelectedStage,
        hasUnsavedChanges,
        updateGlobalSettings,
        updateStageConfig,
        addStageAfter,
        deleteStage,
        saveSettings,
        resetStage,
        resetAllSettings,
        exportSettings,
        totalStages: Object.keys(settings.PHASES).length
    };
};
