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
        POLICE_SPEED: number;
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

        const settings = JSON.parse(stored);

        // 옛날 확률 방식 -> 새로운 배열 방식으로 자동 마이그레이션
        if (settings.PHASES) {
            Object.keys(settings.PHASES).forEach(phaseKey => {
                const phase = settings.PHASES[Number(phaseKey)];
                if (phase.comboRewards) {
                    Object.keys(phase.comboRewards).forEach(comboKey => {
                        const rewards = phase.comboRewards[Number(comboKey)];

                        // 확률 객체 형식인지 확인 (예: { HEAL_50: 0.15, ... })
                        if (rewards && typeof rewards === 'object' && !Array.isArray(rewards)) {
                            // 확률이 있는 모든 효과를 배열로 변환
                            phase.comboRewards[Number(comboKey)] = Object.keys(rewards);
                            console.log(`Migrated combo ${comboKey} rewards from probability to array format`);
                        }
                    });
                }
            });
        }

        return settings;
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
            POLICE_SPEED: GAME_SETTINGS.PHYSICS.POLICE_SPEED,
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
            const num = Number(phaseNum);
            const defaultPhase = GAME_SETTINGS.PHASES[num] || GAME_SETTINGS.PHASES[1];


            const comboRewards = config.comboRewards || defaultPhase.comboRewards || {
                10: ['HEAL_50', 'HEAL_100', 'SHIELD', 'BOMB_ALL', 'BOMB_HALF', 'ROAD_NARROW', 'CAMERA_BOOST', 'SLOW_TIME'],
                20: ['HEAL_50', 'HEAL_100', 'SHIELD', 'BOMB_ALL', 'BOMB_HALF', 'ROAD_NARROW', 'CAMERA_BOOST', 'SLOW_TIME'],
                30: ['HEAL_50', 'HEAL_100', 'SHIELD', 'BOMB_ALL', 'BOMB_HALF', 'ROAD_NARROW', 'CAMERA_BOOST', 'SLOW_TIME'],
                40: ['HEAL_50', 'HEAL_100', 'SHIELD', 'BOMB_ALL', 'BOMB_HALF', 'ROAD_NARROW', 'CAMERA_BOOST', 'SLOW_TIME']
            };

            const comboRewardsStr = JSON.stringify(comboRewards, null, 4)
                .replace(/"/g, "'")
                .replace(/\n/g, '\n            ');

            return `        ${phaseNum}: {
            scoreLimit: ${config.scoreLimit ?? defaultPhase.scoreLimit},      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: ${config.zoneHeight ?? defaultPhase.zoneHeight},       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: ${config.lanes ?? defaultPhase.lanes},            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: ${config.speedCoefficient ?? defaultPhase.speedCoefficient}, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: ${config.trickProb ?? defaultPhase.trickProb},        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: ${config.nitroProb ?? defaultPhase.nitroProb},        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: ${config.swerveProb ?? defaultPhase.swerveProb},       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: ${config.stopAndGoProb ?? defaultPhase.stopAndGoProb},    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: ${config.motorcycleProb ?? defaultPhase.motorcycleProb},   // 오토바이 등장 확률
            hasAmbulance: ${config.hasAmbulance ?? defaultPhase.hasAmbulance},    // 병원차 등장 여부
            hasPolice: ${config.hasPolice ?? defaultPhase.hasPolice},      // 경찰차 등장 여부
            spawnInterval: ${config.spawnInterval ?? defaultPhase.spawnInterval},    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: ${config.spawnYThreshold ?? defaultPhase.spawnYThreshold},  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: ${config.minSpeed ?? defaultPhase.minSpeed},         // 주행 최소 속도 (km/h)
            maxSpeed: ${config.maxSpeed ?? defaultPhase.maxSpeed},         // 주행 최대 속도 (km/h)
            overspeedProb: ${config.overspeedProb ?? defaultPhase.overspeedProb},    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: ${comboRewardsStr},
            description: \`${config.description || defaultPhase.description}\`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        }`;
        })
        .join(',\n');

    return `/**
 * 특명! 파파라치! - 게임 밸런스 설정 파일
 * 스테이지 디자이너에서 Export한 설정입니다.
 * 이 코드를 constants.ts의 GAME_SETTINGS 부분에 복사하세요.
 */

export type CarType = 'NORMAL' | 'TRICK' | 'NITRO' | 'SWERVE' | 'STOP_AND_GO' | 'AMBULANCE' | 'POLICE';

/**
 * 콤보 보상 효과 타입
 */
export type RewardEffect =
    | 'HEAL_50'      // 체력 50% 회복
    | 'HEAL_100'     // 체력 100% 회복
    | 'SHIELD'       // 쉴드 +3
    | 'BOMB_ALL'     // 올킬 (모든 차량 제거)
    | 'BOMB_HALF'    // 하프킬 (절반 차량 제거)
    | 'ROAD_NARROW'  // 도로 정비 (60초간 2칸)
    | 'CAMERA_BOOST' // 고성능 카메라 (단속 구역 40%)
    | 'SLOW_TIME'    // 슬로우 (60초간 속도 계수 250)
    | 'DOUBLE_SCORE' // 더블득점 (1분간 퍼펙트/굿/배드 점수 2배, 콤보 점수 제외)
    | 'SEARCHLIGHT'; // 서치라이트 (1분간 모든 속도계기판 전체 표시)

export interface PhaseConfig {
    scoreLimit: number;      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
    zoneHeight: number;       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
    lanes: number;            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
    speedCoefficient: number; // 주행 속도 계수 (낮을수록 빠름)
    trickProb: number;        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
    nitroProb: number;        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
    swerveProb: number;       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
    stopAndGoProb: number;    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
    motorcycleProb: number;   // 오토바이 등장 확률
    hasAmbulance: boolean;    // 병원차 등장 여부 (스테이지당 1회)
    hasPolice: boolean;       // 경찰차 등장 여부 (스테이지당 1회)
    spawnInterval: number;    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
    spawnYThreshold: number;  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
    minSpeed: number;         // 주행 최소 속도 (km/h)
    maxSpeed: number;         // 주행 최대 속도 (km/h)
    overspeedProb: number;    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
    description: string;      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
    // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
    comboRewards: {
        [key: number]: RewardEffect[];
    };
}

export const GAME_SETTINGS = {
    /** 기본 규칙 설정 */
    TARGET_SPEED: ${settings.TARGET_SPEED ?? GAME_SETTINGS.TARGET_SPEED},       // [과속 기준] 이 속도를 초과하면 빨간 숫자로 표시되며 단속 대상이 됩니다.
    LANES: ${settings.LANES ?? GAME_SETTINGS.LANES},                // [도로 환경] 도로의 전체 차선 수 (숫자를 바꾸면 실시간으로 차선 수가 변경됩니다)
    ZONE_BOTTOM_FIXED: ${settings.ZONE_BOTTOM_FIXED ?? GAME_SETTINGS.ZONE_BOTTOM_FIXED},   // [단속 구역 위치] 단속 게이트가 화면 하단으로부터 몇 % 지점에 고정될지 설정

    /** 물리 및 시스템 설정 */
    PHYSICS: {
        /**
         * [주행 속도 계수] 화면에 보이는 차량의 실제 주행 속도감 조절
         * - 예시: 150 (매우 빠름, 긴장감 높음), 300 (보통), 500 (느림)
         */
        SPEED_COEFFICIENT: ${settings.PHYSICS?.SPEED_COEFFICIENT ?? GAME_SETTINGS.PHYSICS.SPEED_COEFFICIENT},

        /**
         * [전역 겹침 방지 임계값] 차선별 최저 간격 유지 (스테이지 설정이 없을 때 기본값으로 사용)
         */
        SPAWN_Y_THRESHOLD: ${settings.PHYSICS?.SPAWN_Y_THRESHOLD ?? GAME_SETTINGS.PHYSICS.SPAWN_Y_THRESHOLD},
        AMBULANCE_SPEED: ${settings.PHYSICS?.AMBULANCE_SPEED ?? GAME_SETTINGS.PHYSICS.AMBULANCE_SPEED},
        POLICE_SPEED: ${(settings.PHYSICS as any)?.POLICE_SPEED ?? (GAME_SETTINGS.PHYSICS as any).POLICE_SPEED},
        /** 자동차 행동 트리거 임계값 (%) - 노란선으로부터의 거리 */
        ACTION_TRIGGER_OFFSETS: {
            TRICK: ${settings.PHYSICS?.ACTION_TRIGGER_OFFSETS?.TRICK ?? GAME_SETTINGS.PHYSICS.ACTION_TRIGGER_OFFSETS.TRICK},        // 브레이크 시작 위치 (기존 12 -> 5로 단축)
            SWERVE: ${settings.PHYSICS?.ACTION_TRIGGER_OFFSETS?.SWERVE ?? GAME_SETTINGS.PHYSICS.ACTION_TRIGGER_OFFSETS.SWERVE},       // 차선 변경 시작 위치 (기존 12 -> 4로 단축)
            MOTORCYCLE: ${settings.PHYSICS?.ACTION_TRIGGER_OFFSETS?.MOTORCYCLE ?? GAME_SETTINGS.PHYSICS.ACTION_TRIGGER_OFFSETS.MOTORCYCLE},  // 오토바이는 기존의 여유 있는 타이밍 유지
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
    try {
        const code = exportSettingsAsCode(settings);
        const blob = new Blob(['\uFEFF' + code], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        a.download = `game-settings-${timestamp}.ts`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to export settings:', error);
        alert('설정 내보내기 중 오류가 발생했습니다.\\n' + error);
    }
};
