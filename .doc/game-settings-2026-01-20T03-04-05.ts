/**
 * 특명! 파파라치! - 게임 밸런스 설정 파일
 * 스테이지 디자이너에서 Export한 설정입니다.
 * 이 코드를 constants.ts의 GAME_SETTINGS 부분에 복사하세요.
 */

export const GAME_SETTINGS = {
    /** 기본 규칙 설정 */
    TARGET_SPEED: 100,
    LANES: 5,
    ZONE_BOTTOM_FIXED: 90,

    /** 물리 및 시스템 설정 */
    PHYSICS: {
        SPEED_COEFFICIENT: 160,
        SPAWN_Y_THRESHOLD: 30,
        AMBULANCE_SPEED: 200,
        ACTION_TRIGGER_OFFSETS: {
            TRICK: 5,
            SWERVE: 5,
            MOTORCYCLE: 10,
        }
    },

    /** 스테이지(PHASE)별 상세 난이도 설정 */
    PHASES: {
        1: {
            scoreLimit: 700,
            zoneHeight: 30,
            lanes: 1,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0,
            spawnInterval: 400,
            spawnYThreshold: 30,
            minSpeed: 88,
            maxSpeed: 110,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "기초 단속: 100km/h 초과 차량을 노란구역 안에서 터치하세요"
        },
        2: {
            scoreLimit: 900,
            zoneHeight: 30,
            lanes: 3,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0,
            spawnInterval: 1000,
            spawnYThreshold: 30,
            minSpeed: 88,
            maxSpeed: 130,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "차선이 늘었군요, 
단속을 강화해야 겠어요"
        },
        3: {
            scoreLimit: 900,
            zoneHeight: 30,
            lanes: 3,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0.65,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0,
            spawnInterval: 1000,
            spawnYThreshold: 30,
            minSpeed: 88,
            maxSpeed: 130,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "차선을 변경하여 단속을 피하려는 차들이 등장 합니다."
        },
        4: {
            scoreLimit: 1500,
            zoneHeight: 30,
            lanes: 4,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0.65,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0,
            spawnInterval: 1000,
            spawnYThreshold: 30,
            minSpeed: 88,
            maxSpeed: 130,
            overspeedProb: 0.7,
            comboRewards: {
                10: {
                    HEAL_50: 0,
                    HEAL_100: 0,
                    SHIELD: 0,
                    BOMB_ALL: 0,
                    BOMB_HALF: 0,
                    ROAD_NARROW: 0,
                    CAMERA_BOOST: 1,
                    SLOW_TIME: 0
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "도로가 넓어 위험하군요
10콤보를 만들어 보세요"
        },
        5: {
            scoreLimit: 1500,
            zoneHeight: 25,
            lanes: 4,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0,
            stopAndGoProb: 0.5,
            motorcycleProb: 0,
            ambulanceProb: 0,
            spawnInterval: 1000,
            spawnYThreshold: 65,
            minSpeed: 88,
            maxSpeed: 130,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0.5,
                    HEAL_100: 0,
                    SHIELD: 0.5,
                    BOMB_ALL: 0,
                    BOMB_HALF: 0,
                    ROAD_NARROW: 0,
                    CAMERA_BOOST: 0.1,
                    SLOW_TIME: 0
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "급정거를 하는 차들이 등장합니다"
        },
        6: {
            scoreLimit: 1500,
            zoneHeight: 25,
            lanes: 4,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0.5,
            swerveProb: 0,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0,
            spawnInterval: 1000,
            spawnYThreshold: 45,
            minSpeed: 88,
            maxSpeed: 130,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0,
                    HEAL_100: 0,
                    SHIELD: 0.55,
                    BOMB_ALL: 0,
                    BOMB_HALF: 0,
                    ROAD_NARROW: 0,
                    CAMERA_BOOST: 0,
                    SLOW_TIME: 0
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "급 가속을 하고 있군요!
끝까지 지켜 보세요
"
        },
        7: {
            scoreLimit: 2500,
            zoneHeight: 25,
            lanes: 5,
            speedCoefficient: 150,
            trickProb: 0.25,
            nitroProb: 0.5,
            swerveProb: 0,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0,
            spawnInterval: 1000,
            spawnYThreshold: 30,
            minSpeed: 88,
            maxSpeed: 130,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0.1,
                    HEAL_100: 0,
                    SHIELD: 0.1,
                    BOMB_ALL: 0,
                    BOMB_HALF: 0.1,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.55,
                    SLOW_TIME: 0
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0,
                    SHIELD: 0.1,
                    BOMB_ALL: 0,
                    BOMB_HALF: 0.3,
                    ROAD_NARROW: 0,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "눈을 크게 뜨세요!"
        },
        8: {
            scoreLimit: 1500,
            zoneHeight: 20,
            lanes: 3,
            speedCoefficient: 150,
            trickProb: 0.1,
            nitroProb: 0,
            swerveProb: 0,
            stopAndGoProb: 0.1,
            motorcycleProb: 0.35,
            ambulanceProb: 0,
            spawnInterval: 1000,
            spawnYThreshold: 30,
            minSpeed: 88,
            maxSpeed: 130,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0.1,
                    HEAL_100: 0,
                    SHIELD: 0.1,
                    BOMB_ALL: 0,
                    BOMB_HALF: 0.1,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.55,
                    SLOW_TIME: 0
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0,
                    SHIELD: 0.1,
                    BOMB_ALL: 0,
                    BOMB_HALF: 0.3,
                    ROAD_NARROW: 0,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "오토바이가 출현합니다"
        },
        9: {
            scoreLimit: 4000,
            zoneHeight: 20,
            lanes: 4,
            speedCoefficient: 150,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0,
            spawnInterval: 600,
            spawnYThreshold: 65,
            minSpeed: 62,
            maxSpeed: 145,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0.1,
                    HEAL_100: 0,
                    SHIELD: 0.1,
                    BOMB_ALL: 0,
                    BOMB_HALF: 0,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.15,
                    SLOW_TIME: 0
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.05,
                    SHIELD: 0.1,
                    BOMB_ALL: 0,
                    BOMB_HALF: 0.3,
                    ROAD_NARROW: 0,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0
                },
                30: {
                    HEAL_50: 0,
                    HEAL_100: 0.1,
                    SHIELD: 0,
                    BOMB_ALL: 0.35,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0,
                    CAMERA_BOOST: 0,
                    SLOW_TIME: 0
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "이번엔 장거리 운전입니다"
        },
        10: {
            scoreLimit: 1000,
            zoneHeight: 22,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0.3,
            nitroProb: 0,
            swerveProb: 0,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0,
            spawnInterval: 1000,
            spawnYThreshold: 30,
            minSpeed: 92,
            maxSpeed: 125,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "주의: 갑자기 속도를 줄이는 차량이 나타납니다."
        },
        11: {
            scoreLimit: 1500,
            zoneHeight: 22,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0.3,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0,
            spawnInterval: 1100,
            spawnYThreshold: 35,
            minSpeed: 88,
            maxSpeed: 115,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "위험: 차선을 변경하며 단속을 회피합니다."
        },
        12: {
            scoreLimit: 1500,
            zoneHeight: 25,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0.3,
            swerveProb: 0,
            stopAndGoProb: 0,
            motorcycleProb: 0,
            ambulanceProb: 0,
            spawnInterval: 1300,
            spawnYThreshold: 40,
            minSpeed: 88,
            maxSpeed: 115,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "경고: 급가속하는 차량이 있습니다."
        },
        13: {
            scoreLimit: 1500,
            zoneHeight: 20,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0,
            stopAndGoProb: 0.4,
            motorcycleProb: 0,
            ambulanceProb: 0,
            spawnInterval: 1100,
            spawnYThreshold: 35,
            minSpeed: 88,
            maxSpeed: 120,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "주의: 정지선 앞에서 멈췄다 도주하는 차량이 있습니다."
        },
        14: {
            scoreLimit: 1500,
            zoneHeight: 20,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0,
            nitroProb: 0,
            swerveProb: 0.5,
            stopAndGoProb: 0,
            motorcycleProb: 0.4,
            ambulanceProb: 0,
            spawnInterval: 1100,
            spawnYThreshold: 30,
            minSpeed: 95,
            maxSpeed: 130,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "경고: 작고 빠른 오토바이 부대가 출현했습니다."
        },
        15: {
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
            comboRewards: {
                10: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "경고 : 차들이 더 많고 더 빠릅니다"
        },
        16: {
            scoreLimit: 2500,
            zoneHeight: 18,
            lanes: 5,
            speedCoefficient: 160,
            trickProb: 0.5,
            nitroProb: 0.5,
            swerveProb: 0,
            stopAndGoProb: 0.1,
            motorcycleProb: 0,
            ambulanceProb: 0.1,
            spawnInterval: 800,
            spawnYThreshold: 20,
            minSpeed: 98,
            maxSpeed: 150,
            overspeedProb: 0.6,
            comboRewards: {
                10: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "경고: 혼란이 점점 가중되고 있습니다"
        },
        17: {
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
            comboRewards: {
                10: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "경고: 오토바이가 또 등장 했습니다"
        },
        18: {
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
            comboRewards: {
                10: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "경고: 거의 모든 차들이 과속입니다."
        },
        19: {
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
            comboRewards: {
                10: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                20: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                30: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                },
                40: {
                    HEAL_50: 0.15,
                    HEAL_100: 0.1,
                    SHIELD: 0.15,
                    BOMB_ALL: 0.05,
                    BOMB_HALF: 0.15,
                    ROAD_NARROW: 0.1,
                    CAMERA_BOOST: 0.2,
                    SLOW_TIME: 0.1
                }
            },
            description: "무한 단속: 최고의 파파라치임을 증명하세요!"
        }
    } as Record<number, PhaseConfig>
};
