/**
 * 특명! 파파라치! - 게임 밸런스 설정 파일
 * 이 파일의 수치를 변경하여 게임의 난이도, 속도, 스테이지 구성을 직접 조정할 수 있습니다.
 */

export type CarType = 'NORMAL' | 'TRICK' | 'NITRO' | 'SWERVE' | 'STOP_AND_GO' | 'AMBULANCE';

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
    ambulanceProb: number;    // 병원차 등장 확률 (10%)
    spawnInterval: number;    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
    spawnYThreshold: number;  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
    minSpeed: number;         // 주행 최소 속도 (km/h)
    maxSpeed: number;         // 주행 최대 속도 (km/h)
    overspeedProb: number;    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
    description: string;      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
}

export const GAME_SETTINGS = {
    /** 기본 규칙 설정 */
    TARGET_SPEED: 100,       // [과속 기준] 이 속도를 초과하면 빨간 숫자로 표시되며 단속 대상이 됩니다.
    LANES: 5,                // [도로 환경] 도로의 전체 차선 수 (숫자를 바꾸면 실시간으로 차선 수가 변경됩니다)
    ZONE_BOTTOM_FIXED: 90,   // [단속 구역 위치] 단속 게이트가 화면 하단으로부터 몇 % 지점에 고정될지 설정

    /** 물리 및 시스템 설정 */
    PHYSICS: {
        /**
         * [주행 속도 계수] 화면에 보이는 차량의 실제 주행 속도감 조절
         * - 예시: 150 (매우 빠름, 긴장감 높음), 300 (보통), 500 (느림)
         */
        SPEED_COEFFICIENT: 160,

        /**
         * [전역 겹침 방지 임계값] 차선별 최저 간격 유지 (스테이지 설정이 없을 때 기본값으로 사용)
         */
        SPAWN_Y_THRESHOLD: 30,
        AMBULANCE_SPEED: 200,
        /** 자동차 행동 트리거 임계값 (%) - 노란선으로부터의 거리 */
        ACTION_TRIGGER_OFFSETS: {
            TRICK: 5,        // 브레이크 시작 위치 (기존 12 -> 5로 단축)
            SWERVE: 5,       // 차선 변경 시작 위치 (기존 12 -> 4로 단축)
            MOTORCYCLE: 10,  // 오토바이는 기존의 여유 있는 타이밍 유지
        }
    },

    /** 스테이지(PHASE)별 상세 난이도 설정 */
    PHASES: {
        1: {
            scoreLimit: 2000,
            zoneHeight: 20,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0.0,
            spawnInterval: 1000,
            spawnYThreshold: 30,
            minSpeed: 88,
            maxSpeed: 110,
            overspeedProb: 0.6,
            description: "기초 단속: 100km/h 초과 차량을 촬영하세요."
        },
        2: {
            scoreLimit: 1000,
            zoneHeight: 22,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0.3,
            nitroProb: 0,
            swerveProb: 0,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0.0,
            spawnInterval: 1000,
            spawnYThreshold: 30,
            minSpeed: 92,
            maxSpeed: 125,
            overspeedProb: 0.6,
            description: "주의: 갑자기 속도를 줄이는 차량이 나타납니다."
        },
        3: {
            scoreLimit: 1500,
            zoneHeight: 22,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0.0,
            nitroProb: 0.0,
            swerveProb: 0.3,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0.0,
            spawnInterval: 1100,
            spawnYThreshold: 35,
            minSpeed: 88,
            maxSpeed: 115,
            overspeedProb: 0.6,
            description: "위험: 차선을 변경하며 단속을 회피합니다."
        },
        4: {
            scoreLimit: 1500,
            zoneHeight: 25,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0.0,
            nitroProb: 0.3,
            swerveProb: 0,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0.0,
            spawnInterval: 1300,
            spawnYThreshold: 40,
            minSpeed: 88,
            maxSpeed: 115,
            overspeedProb: 0.6,
            description: "경고: 급가속하는 차량이 있습니다."
        },
        5: {
            scoreLimit: 1500,
            zoneHeight: 20,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0,
            stopAndGoProb: 0.4,
            motorcycleProb: 0,
            ambulanceProb: 0.0,
            spawnInterval: 1100,
            spawnYThreshold: 35,
            minSpeed: 88,
            maxSpeed: 120,
            overspeedProb: 0.6,
            description: "주의: 정지선 앞에서 멈췄다 도주하는 차량이 있습니다."
        },
        6: {
            scoreLimit: 1500,
            zoneHeight: 20,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0.5,
            stopAndGoProb: 0,
            motorcycleProb: 0.4,
            ambulanceProb: 0.0,
            spawnInterval: 1100,
            spawnYThreshold: 30,
            minSpeed: 95,
            maxSpeed: 130,
            overspeedProb: 0.6,
            description: "경고: 작고 빠른 오토바이 부대가 출현했습니다."
        },
        7: {
            scoreLimit: 2500,
            zoneHeight: 18,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0,
            stopAndGoProb: 0.2,
            motorcycleProb: 0,
            ambulanceProb: 0.1,
            spawnInterval: 800,
            spawnYThreshold: 20,
            minSpeed: 98,
            maxSpeed: 140,
            overspeedProb: 0.6,
            description: "경고 : 차들이 더 많고 더 빠릅니다"
        },
        8: {
            scoreLimit: 2500,
            zoneHeight: 18,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0.5,
            nitroProb: 0.5,
            swerveProb: 0.0,
            stopAndGoProb: 0.1,
            motorcycleProb: 0,
            ambulanceProb: 0.1,
            spawnInterval: 800,
            spawnYThreshold: 20,
            minSpeed: 98,
            maxSpeed: 150,
            overspeedProb: 0.6,
            description: "경고: 혼란이 점점 가중되고 있습니다"
        },
        9: {
            scoreLimit: 2500,
            zoneHeight: 18,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0.3,
            nitroProb: 0.3,
            swerveProb: 0.5,
            stopAndGoProb: 0.3,
            motorcycleProb: 0.3,
            ambulanceProb: 0.1,
            spawnInterval: 800,
            spawnYThreshold: 20,
            minSpeed: 98,
            maxSpeed: 150,
            overspeedProb: 0.6,
            description: "경고: 오토바이가 또 등장 했습니다"
        },
        10: {
            scoreLimit: 2500,
            zoneHeight: 18,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0.2,
            nitroProb: 0.2,
            swerveProb: 0.2,
            stopAndGoProb: 0.2,
            motorcycleProb: 0.2,
            ambulanceProb: 0.1,
            spawnInterval: 800,
            spawnYThreshold: 20,
            minSpeed: 99,
            maxSpeed: 160,
            overspeedProb: 0.8,
            description: "경고: 거의 모든 차들이 과속입니다."
        },

        11: {
            scoreLimit: 99999,
            zoneHeight: 18,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0.5,
            nitroProb: 0.5,
            swerveProb: 0.5,
            stopAndGoProb: 0.5,
            motorcycleProb: 0.2,
            ambulanceProb: 0.05,
            spawnInterval: 700,
            spawnYThreshold: 20,
            minSpeed: 99,
            maxSpeed: 180,
            overspeedProb: 0.7,
            description: "무한 단속: 최고의 파파라치임을 증명하세요!"
        },
    } as Record<number, PhaseConfig>
};
