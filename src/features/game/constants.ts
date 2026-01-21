/**
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
        POLICE_SPEED: 170,
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
            scoreLimit: 2000,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 30,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 1,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 400,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 30,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 88,         // 주행 최소 속도 (km/h)
            maxSpeed: 110,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'DOUBLE_SCORE'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `기초 단속: 100km/h 초과 차량을 노란구역 안에서 터치하세요`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        2: {
            scoreLimit: 900,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 30,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 3,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 1000,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 30,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 88,         // 주행 최소 속도 (km/h)
            maxSpeed: 130,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'SHIELD'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `차선이 늘었군요, 
단속을 강화해야 겠어요`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        3: {
            scoreLimit: 900,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 30,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 3,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0.65,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 1000,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 30,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 88,         // 주행 최소 속도 (km/h)
            maxSpeed: 130,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'SHIELD'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `차선을 변경하여 단속을 피하려는 차들이 등장 합니다.`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        4: {
            scoreLimit: 1500,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 30,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 4,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0.65,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 1000,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 30,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 88,         // 주행 최소 속도 (km/h)
            maxSpeed: 130,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.7,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'ROAD_NARROW',
                    'SHIELD'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `도로가 넓어 위험하군요
10콤보를 만들어 보세요`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        5: {
            scoreLimit: 1500,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 25,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 4,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0.5,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 1000,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 65,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 88,         // 주행 최소 속도 (km/h)
            maxSpeed: 130,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'SHIELD',
                    'DOUBLE_SCORE'
                ],
                '20': [
                    'BOMB_ALL'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `급정거를 하는 차들이 등장합니다`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        6: {
            scoreLimit: 1500,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 25,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 4,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0.5,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 1000,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 45,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 88,         // 주행 최소 속도 (km/h)
            maxSpeed: 130,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'DOUBLE_SCORE',
                    'SHIELD'
                ],
                '20': [
                    'BOMB_HALF'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `급 가속을 하고 있군요!
끝까지 지켜 보세요
`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        7: {
            scoreLimit: 2500,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 25,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 5,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 150, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0.25,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0.5,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 1000,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 30,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 88,         // 주행 최소 속도 (km/h)
            maxSpeed: 130,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'DOUBLE_SCORE',
                    'SLOW_TIME',
                    'SHIELD'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `눈을 크게 뜨세요!`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        8: {
            scoreLimit: 1700,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 20,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 4,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 150, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0.1,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0.1,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0.1,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 1000,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 30,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 88,         // 주행 최소 속도 (km/h)
            maxSpeed: 130,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'SHIELD',
                    'SLOW_TIME',
                    'DOUBLE_SCORE'
                ],
                '20': [
                    'BOMB_ALL',
                    'BOMB_HALF'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `경고: 도로의 무법자가 등장합니다!`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        9: {
            scoreLimit: 2700,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 27,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 4,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 150, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0.25,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0.6,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0.1,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0.1,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 1000,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 65,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 62,         // 주행 최소 속도 (km/h)
            maxSpeed: 145,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'SHIELD',
                    'SLOW_TIME',
                    'DOUBLE_SCORE'
                ],
                '20': [
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'DOUBLE_SCORE'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `주의 : 감속 트릭입니다!`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        10: {
            scoreLimit: 1000,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 22,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 5,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0.3,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 1000,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 30,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 92,         // 주행 최소 속도 (km/h)
            maxSpeed: 125,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `주의: 갑자기 속도를 줄이는 차량이 나타납니다.`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        11: {
            scoreLimit: 1500,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 22,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 5,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0.3,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 1100,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 35,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 88,         // 주행 최소 속도 (km/h)
            maxSpeed: 115,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `위험: 차선을 변경하며 단속을 회피합니다.`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        12: {
            scoreLimit: 1500,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 25,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 5,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0.3,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 1300,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 40,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 88,         // 주행 최소 속도 (km/h)
            maxSpeed: 115,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `경고: 급가속하는 차량이 있습니다.`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        13: {
            scoreLimit: 1500,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 20,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 5,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0.4,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 1100,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 35,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 88,         // 주행 최소 속도 (km/h)
            maxSpeed: 120,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `주의: 정지선 앞에서 멈췄다 도주하는 차량이 있습니다.`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        14: {
            scoreLimit: 1500,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 20,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 5,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0.5,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0.4,   // 오토바이 등장 확률
            hasAmbulance: false,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 1100,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 30,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 95,         // 주행 최소 속도 (km/h)
            maxSpeed: 130,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `경고: 작고 빠른 오토바이 부대가 출현했습니다.`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        15: {
            scoreLimit: 2500,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 18,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 5,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0.2,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: true,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 800,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 20,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 98,         // 주행 최소 속도 (km/h)
            maxSpeed: 140,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `경고 : 차들이 더 많고 더 빠릅니다`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        16: {
            scoreLimit: 2500,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 18,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 5,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0.5,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0.5,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0.1,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0,   // 오토바이 등장 확률
            hasAmbulance: true,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 800,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 20,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 98,         // 주행 최소 속도 (km/h)
            maxSpeed: 150,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `경고: 혼란이 점점 가중되고 있습니다`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        17: {
            scoreLimit: 2500,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 18,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 5,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0.3,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0.3,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0.5,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0.3,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0.3,   // 오토바이 등장 확률
            hasAmbulance: true,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 800,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 20,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 98,         // 주행 최소 속도 (km/h)
            maxSpeed: 150,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.6,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `경고: 오토바이가 또 등장 했습니다`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        18: {
            scoreLimit: 2500,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 18,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 5,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0.2,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0.2,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0.2,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0.2,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0.2,   // 오토바이 등장 확률
            hasAmbulance: true,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 800,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 20,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 99,         // 주행 최소 속도 (km/h)
            maxSpeed: 160,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.8,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `경고: 거의 모든 차들이 과속입니다.`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        },
        19: {
            scoreLimit: 99999,      // 해당 단계에서 다음 단계로 넘어가기 위해 획득해야 하는 점수 (상대 점수)
            zoneHeight: 18,       // 노란색 단속 영역의 세로 높이 (화면 전체 높이 대비 % 수치)
            lanes: 5,            // 도로의 차선 수 (스테이지별로 다르게 설정 가능)
            speedCoefficient: 160, // 주행 속도 계수 (낮을수록 빠름)
            trickProb: 0.5,        // 차량이 단속 구역 앞에서 급브레이크(TRICK)를 밟을 확률 (0 ~ 1 사이)
            nitroProb: 0.5,        // 차량이 단속 구역 앞에서 급가속(NITRO)할 확률 (0 ~ 1 사이)
            swerveProb: 0.5,       // 차량이 단속 구역 앞에서 차선을 변경(SWERVE)할 확률 (0 ~ 1 사이)
            stopAndGoProb: 0.5,    // 차량이 단속 구역 앞에서 멈췄다 가는(STOP_AND_GO) 확률
            motorcycleProb: 0.2,   // 오토바이 등장 확률
            hasAmbulance: true,    // 병원차 등장 여부
            hasPolice: false,      // 경찰차 등장 여부
            spawnInterval: 700,    // 새로운 차량이 스폰되는 시간 간격 (ms 단위, 예: 1000 = 1초)
            spawnYThreshold: 20,  // [등장 밀도] 이전 차량이 화면 몇 % 지점까지 내려가야 다음 차가 나올 수 있는지 설정
            minSpeed: 99,         // 주행 최소 속도 (km/h)
            maxSpeed: 180,         // 주행 최대 속도 (km/h)
            overspeedProb: 0.7,    // 과속 차량(100km/h 초과)이 등장할 전체 확률 (0 ~ 1 사이)
            // 콤보 보상 (콤보 수 -> 활성화된 효과 배열)
            comboRewards: {
                '10': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '20': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '30': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ],
                '40': [
                    'HEAL_50',
                    'HEAL_100',
                    'SHIELD',
                    'BOMB_ALL',
                    'BOMB_HALF',
                    'ROAD_NARROW',
                    'CAMERA_BOOST',
                    'SLOW_TIME'
                ]
            },
            description: `무한 단속: 최고의 파파라치임을 증명하세요!`      // 스테이지(Phase) 시작 시 화면 중앙에 표시될 미션 설명
        }
    } as Record<number, PhaseConfig>
};
