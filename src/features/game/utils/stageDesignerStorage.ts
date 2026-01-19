/**
 * 로컬 스토리지 관리 유틸리티
 * 스테이지 디자이너에서 수정한 설정을 저장/로드/삭제
 */

import { GAME_SETTINGS, PhaseConfig } from '@/features/game/constants';

const STORAGE_KEY = 'speed_trap_custom_settings';

export interface CustomGameSettings {
    TARGET_SPEED: number;
    LANES: number;
    ZONE_BOTTOM_FIXED: number;
    PHYSICS: {
        SPEED_COEFFICIENT: number;
        SPAWN_Y_THRESHOLD: number;
        AMBULANCE_SPEED: number;
        ACTION_TRIGGER_OFFSETS: {
            TRICK: number;
            SWERVE: number;
            MOTORCYCLE: number;
        };
    };
    PHASES: Record<number, PhaseConfig>;
}

/**
 * 로컬 스토리지에서 커스텀 설정 로드
 */
export const loadCustomSettings = (): CustomGameSettings | null => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        return JSON.parse(stored);
    } catch (error) {
        console.error('Failed to load custom settings:', error);
        return null;
    }
};

/**
 * 로컬 스토리지에 커스텀 설정 저장
 */
export const saveCustomSettings = (settings: CustomGameSettings): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings, null, 2));
    } catch (error) {
        console.error('Failed to save custom settings:', error);
    }
};

/**
 * 로컬 스토리지에서 커스텀 설정 삭제
 */
export const clearCustomSettings = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear custom settings:', error);
    }
};

/**
 * 기본 설정 가져오기 (constants.ts의 원본 값)
 */
export const getDefaultSettings = (): CustomGameSettings => {
    return {
        TARGET_SPEED: GAME_SETTINGS.TARGET_SPEED,
        LANES: GAME_SETTINGS.LANES,
        ZONE_BOTTOM_FIXED: GAME_SETTINGS.ZONE_BOTTOM_FIXED,
        PHYSICS: {
            SPEED_COEFFICIENT: GAME_SETTINGS.PHYSICS.SPEED_COEFFICIENT,
            SPAWN_Y_THRESHOLD: GAME_SETTINGS.PHYSICS.SPAWN_Y_THRESHOLD,
            AMBULANCE_SPEED: GAME_SETTINGS.PHYSICS.AMBULANCE_SPEED,
            ACTION_TRIGGER_OFFSETS: {
                TRICK: GAME_SETTINGS.PHYSICS.ACTION_TRIGGER_OFFSETS.TRICK,
                SWERVE: GAME_SETTINGS.PHYSICS.ACTION_TRIGGER_OFFSETS.SWERVE,
                MOTORCYCLE: GAME_SETTINGS.PHYSICS.ACTION_TRIGGER_OFFSETS.MOTORCYCLE,
            },
        },
        PHASES: { ...GAME_SETTINGS.PHASES },
    };
};

/**
 * 현재 적용 중인 설정 가져오기 (커스텀 설정이 있으면 커스텀, 없으면 기본)
 */
export const getCurrentSettings = (): CustomGameSettings => {
    const custom = loadCustomSettings();
    return custom || getDefaultSettings();
};

/**
 * TypeScript 코드 형식으로 설정을 export (constants.ts에 바로 복사 가능)
 */
export const exportSettingsAsCode = (settings: CustomGameSettings): string => {
    const phasesCode = Object.entries(settings.PHASES)
        .map(([phaseNum, config]) => {
            return `        ${phaseNum}: {
            scoreLimit: ${config.scoreLimit},
            zoneHeight: ${config.zoneHeight},
            trickProb: ${config.trickProb},
            nitroProb: ${config.nitroProb},
            swerveProb: ${config.swerveProb},
            stopAndGoProb: ${config.stopAndGoProb},
            motorcycleProb: ${config.motorcycleProb},
            ambulanceProb: ${config.ambulanceProb},
            spawnInterval: ${config.spawnInterval},
            spawnYThreshold: ${config.spawnYThreshold},
            minSpeed: ${config.minSpeed},
            maxSpeed: ${config.maxSpeed},
            overspeedProb: ${config.overspeedProb},
            description: "${config.description}"
        }`;
        })
        .join(',\n');

    return `/**
 * 특명! 파파라치! - 게임 밸런스 설정 파일
 * 스테이지 디자이너에서 Export한 설정입니다.
 * 이 코드를 constants.ts의 GAME_SETTINGS 부분에 복사하세요.
 */

export const GAME_SETTINGS = {
    /** 기본 규칙 설정 */
    TARGET_SPEED: ${settings.TARGET_SPEED},
    LANES: ${settings.LANES},
    ZONE_BOTTOM_FIXED: ${settings.ZONE_BOTTOM_FIXED},

    /** 물리 및 시스템 설정 */
    PHYSICS: {
        SPEED_COEFFICIENT: ${settings.PHYSICS.SPEED_COEFFICIENT},
        SPAWN_Y_THRESHOLD: ${settings.PHYSICS.SPAWN_Y_THRESHOLD},
        AMBULANCE_SPEED: ${settings.PHYSICS.AMBULANCE_SPEED},
        ACTION_TRIGGER_OFFSETS: {
            TRICK: ${settings.PHYSICS.ACTION_TRIGGER_OFFSETS.TRICK},
            SWERVE: ${settings.PHYSICS.ACTION_TRIGGER_OFFSETS.SWERVE},
            MOTORCYCLE: ${settings.PHYSICS.ACTION_TRIGGER_OFFSETS.MOTORCYCLE},
        }
    },

    /** 스테이지(PHASE)별 상세 난이도 설정 */
    PHASES: {
${phasesCode}
    } as Record<number, PhaseConfig>
};
`;
};

/**
 * 설정을 파일로 다운로드
 */
export const downloadSettingsAsFile = (settings: CustomGameSettings): void => {
    const code = exportSettingsAsCode(settings);
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-settings-${new Date().toISOString().slice(0, 10)}.ts`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
