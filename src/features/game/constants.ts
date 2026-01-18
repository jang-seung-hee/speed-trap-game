/**
 * 특명! 파파라치! - 게임 밸런스 설정 파일
 * 이 파일의 수치를 변경하여 게임의 난이도, 속도, 스테이지 구성을 직접 조정할 수 있습니다.
 */

export type CarType = 'NORMAL' | 'TRICK' | 'NITRO' | 'SWERVE' | 'STOP_AND_GO' | 'AMBULANCE';

export interface PhaseConfig {
    scoreLimit: number;      // 다음 단계로 넘어가기 위한 점수 (누적 점수 기준)
    zoneHeight: number;       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
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
            TRICK: 6,        // 브레이크 시작 위치 (기존 12 -> 5로 단축)
            SWERVE: 6,       // 차선 변경 시작 위치 (기존 12 -> 4로 단축)
            MOTORCYCLE: 12,  // 오토바이는 기존의 여유 있는 타이밍 유지
        }
    },

    /** 스테이지(PHASE)별 상세 난이도 설정 */
    PHASES: {
        1: {
            scoreLimit: 2000,      // 50점을 따면 Phase 2로 레벨업
            zoneHeight: 20,      // 단속 구역이 가장 넓어 촬영하기 쉬움
            trickProb: 0,        // 브레이크 차량 없음
            nitroProb: 0,        // 가속 차량 없음
            swerveProb: 0,       // 차선 변경 차량 없음
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0.0,
            spawnInterval: 1000, // 차량이 유유자적하게 1.8초마다 한 대씩 등장
            /**
             * [spawnYThreshold 예시]
             * - 80: 앞차가 화면 80% 지점(거의 끝)까지 가야 다음 차가 나옴 (매우 널널함)
             * - 50: 앞차가 화면 중간까지 가면 다음 차가 나옴 (보통)
             * - 20: 앞차가 20%만 내려가도 바로 다음 차가 나옴 (매우 빽빽함)
             */
            spawnYThreshold: 30,
            minSpeed: 88,        // 차들의 최저 주행 속도
            maxSpeed: 110,       // 과속 차량이 내는 최고 속도
            overspeedProb: 0.6,  // 10대 중 2대 정도만 과속 차량 (나머진 100 이하 정속)
            description: "기초 단속: 100km/h 초과 차량을 촬영하세요."
        },
        2: {
            scoreLimit: 4000,     // 600점 달성 시 다음 단계
            zoneHeight: 22,
            trickProb: 0.3,      // 20% 확률로 얄밉게 브레이크를 밟는 차 등장
            nitroProb: 0,
            swerveProb: 0,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0.0,
            spawnInterval: 1000, // 생성 주기 1.5초로 단축
            spawnYThreshold: 30, // 간격이 Phase 1보다 조금 촘촘해짐
            minSpeed: 92,
            maxSpeed: 125,
            overspeedProb: 0.6,  // 과속 차량 비중 증가
            description: "주의: 갑자기 속도를 줄이는 차량이 나타납니다."
        },
        3: {
            scoreLimit: 6000,
            zoneHeight: 22,
            trickProb: 0.0,
            nitroProb: 0.0,
            /**
             * [swerveProb 예시]
             * - 0.3: 30% 확률로 단속 구역에 오기 직전 차선을 옆으로 휙 바꿉니다.
             */
            swerveProb: 0.3,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0.0,
            spawnInterval: 1100,
            spawnYThreshold: 35, // 차량들이 꽤 빽빽하게 이어 붙어서 옵니다.
            minSpeed: 88,
            maxSpeed: 115,
            overspeedProb: 0.6,
            description: "위험: 차선을 변경하며 단속을 회피합니다."
        },
        4: {
            scoreLimit: 8000,
            zoneHeight: 25,
            trickProb: 0.0,
            nitroProb: 0.3,      // 가속해서 도망가는 차들이 더 자주 등장
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
            scoreLimit: 10000,
            zoneHeight: 20,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0,
            stopAndGoProb: 0.4,  // 40% 확률로 정지 후 출발
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
            scoreLimit: 12000,
            zoneHeight: 20,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0.5,     // 오토바이는 과속 시 SWERVE 하도록 로직에서 처리하지만 기본 확률도 둠
            stopAndGoProb: 0,
            motorcycleProb: 0.4, // 60% 확률로 오토바이 등장
            ambulanceProb: 0.0,
            spawnInterval: 1100,
            spawnYThreshold: 30,
            minSpeed: 95,
            maxSpeed: 130,       // 오토바이는 더 빠름
            overspeedProb: 0.6,
            description: "경고: 작고 빠른 오토바이 부대가 출현했습니다."
        },
        7: {
            scoreLimit: 15000,    // 
            zoneHeight: 18,      // 단속 구역이 가장 넓어 촬영하기 쉬움
            trickProb: 0,        // 브레이크 차량 없음
            nitroProb: 0,        // 가속 차량 없음
            swerveProb: 0,       // 차선 변경 차량 없음
            stopAndGoProb: 0.2,  // 20% 확률로 정지 후 출발
            motorcycleProb: 0,
            ambulanceProb: 0.1,
            spawnInterval: 800, // 차량이 유유자적하게 1.8초마다 한 대씩 등장
            spawnYThreshold: 20,
            minSpeed: 98,        // 차들의 최저 주행 속도
            maxSpeed: 140,       // 과속 차량이 내는 최고 속도
            overspeedProb: 0.6,  // 10대 중 2대 정도만 과속 차량 (나머진 100 이하 정속)
            description: "경고 : 차들이 더 많고 더 빠릅니다"
        },
        8: {
            scoreLimit: 20000,     // 2400점 달성 시 다음 단계
            zoneHeight: 18,
            trickProb: 0.5,      // 20% 확률로 얄밉게 브레이크를 밟는 차 등장
            nitroProb: 0.5,
            swerveProb: 0.0,
            stopAndGoProb: 0.1,
            motorcycleProb: 0,
            ambulanceProb: 0.1,
            spawnInterval: 800, // 생성 주기 1.5초로 단축
            spawnYThreshold: 20, // 간격이 Phase 1보다 조금 촘촘해짐
            minSpeed: 98,
            maxSpeed: 150,
            overspeedProb: 0.6,  // 과속 차량 비중 증가
            description: "경고: 혼란이 점점 가중되고 있습니다"
        },
        9: {
            scoreLimit: 25000,     // 2400점 달성 시 다음 단계
            zoneHeight: 18,
            trickProb: 0.3,      // 20% 확률로 얄밉게 브레이크를 밟는 차 등장
            nitroProb: 0.3,
            swerveProb: 0.5,
            stopAndGoProb: 0.3,
            motorcycleProb: 0.3,
            ambulanceProb: 0.1,
            spawnInterval: 800, // 생성 주기 1.5초로 단축
            spawnYThreshold: 20, // 간격이 Phase 1보다 조금 촘촘해짐
            minSpeed: 98,
            maxSpeed: 150,
            overspeedProb: 0.6,  // 과속 차량 비중 증가
            description: "경고: 오토바이가 또 등장 했습니다"
        },
        10: {
            scoreLimit: 30000,     // 2400점 달성 시 다음 단계
            zoneHeight: 18,
            trickProb: 0.2,      // 20% 확률로 얄밉게 브레이크를 밟는 차 등장
            nitroProb: 0.2,
            swerveProb: 0.2,
            stopAndGoProb: 0.2,
            motorcycleProb: 0.2,
            ambulanceProb: 0.1,
            spawnInterval: 800, // 생성 주기 1.5초로 단축
            spawnYThreshold: 20, // 간격이 Phase 1보다 조금 촘촘해짐
            minSpeed: 99,
            maxSpeed: 160,
            overspeedProb: 0.8,  // 과속 차량 비중 증가
            description: "경고: 거의 모든 차들이 과속입니다."
        },

        11: {
            scoreLimit: 99999,   // 끝이 없는 무한 모드
            zoneHeight: 18,      // 단속 구역이 매우 좁아 타이밍을 정확히 맞춰야 함
            trickProb: 0.5,
            nitroProb: 0.5,
            swerveProb: 0.5,
            stopAndGoProb: 0.5,
            motorcycleProb: 0.2,
            ambulanceProb: 0.05,
            spawnInterval: 700,  // 0.9초마다 숨 쉴 틈 없이 차량 쏟아짐
            spawnYThreshold: 20, // 앞차 꽁무니를 바로 쫓아오는 수준의 높은 밀도
            minSpeed: 99,
            maxSpeed: 180,
            overspeedProb: 0.7,
            description: "무한 단속: 최고의 파파라치임을 증명하세요!"
        },
    } as Record<number, PhaseConfig>
};
