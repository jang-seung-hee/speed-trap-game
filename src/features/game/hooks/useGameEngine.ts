import { useState, useEffect, useRef, useCallback } from 'react';
import { GAME_SETTINGS, type CarType, type PhaseConfig, type RewardEffect } from '../constants';
import { soundManager } from '../utils/SoundManager';
import { Car } from '../types';
import { CustomGameSettings } from '../utils/stageDesignerStorage';

interface UseGameEngineProps {
    onGameOver: (score: number) => void;
    initialPhase?: number;
    devMode?: boolean;
    customSettings?: CustomGameSettings;
}

export const useGameEngine = ({
    onGameOver,
    initialPhase = 1,
    devMode = false,
    customSettings
}: UseGameEngineProps) => {
    const [hp, setHp] = useState(100);
    const [maxHp, setMaxHp] = useState(100);
    const [score, setScore] = useState(0);
    const [phase, setPhase] = useState(initialPhase);
    const [cars, setCars] = useState<Car[]>([]);
    const [message, setMessage] = useState<{ text: string; color: string } | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [prevStageResult, setPrevStageResult] = useState<{ type: 'PERFECT' | 'NORMAL' | null, value: number } | null>(null);
    const [combo, setCombo] = useState(0);
    const [comboScore, setComboScore] = useState(0);

    // New state for Stage Clear Announcement
    const [isStageClear, setIsStageClear] = useState(false);

    const gameLoopRef = useRef<number | null>(null);
    const lastSpawnTime = useRef<number>(0);
    const lastFrameTime = useRef<number>(0);
    const lastClickTime = useRef<number>(0);

    // 커스텀 설정이 있으면 사용, 없으면 기본 GAME_SETTINGS 사용
    const settings = customSettings || GAME_SETTINGS;

    const lastLaneSpawnY = useRef<Record<number, number>>((() => {
        const initial: Record<number, number> = {};
        for (let i = 0; i < settings.LANES; i++) {
            initial[i] = 100;
        }
        return initial;
    })());
    const carIdCounter = useRef<number>(0);
    const scoreRef = useRef(0);
    const isPerfectRoundRef = useRef(true);
    const isAmbulanceSpawnedInPhase = useRef(false);
    const isPoliceSpawnedInPhase = useRef(false);
    const scoreAtPhaseStart = useRef(0);

    // Reward States
    const [shield, setShield] = useState(0);
    const [timeScale, setTimeScale] = useState(1);
    const [zoneModifier, setZoneModifier] = useState(0);
    const [roadNarrowActive, setRoadNarrowActive] = useState(false);
    const [roadNarrowEndTime, setRoadNarrowEndTime] = useState(0);
    const [roadNarrowTimerValid, setRoadNarrowTimerValid] = useState(true);
    const [cameraBoostActive, setCameraBoostActive] = useState(false);
    const [cameraBoostEndTime, setCameraBoostEndTime] = useState(0);
    const [cameraBoostTimerValid, setCameraBoostTimerValid] = useState(true);
    const [slowTimeActive, setSlowTimeActive] = useState(false);
    const [slowTimeEndTime, setSlowTimeEndTime] = useState(0);
    const [slowTimeTimerValid, setSlowTimeTimerValid] = useState(true);
    const [doubleScoreActive, setDoubleScoreActive] = useState(false);
    const [doubleScoreEndTime, setDoubleScoreEndTime] = useState(0);
    const [doubleScoreTimerValid, setDoubleScoreTimerValid] = useState(true);
    const [searchlightActive, setSearchlightActive] = useState(false);
    const [searchlightEndTime, setSearchlightEndTime] = useState(0);
    const [searchlightTimerValid, setSearchlightTimerValid] = useState(true);

    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isGameOverProcessing = useRef(false); // Track game over sequence

    const showMessage = useCallback((text: string, color: string, duration: number = 800) => {
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
            messageTimeoutRef.current = null;
        }
        setMessage({ text, color });
        messageTimeoutRef.current = setTimeout(() => {
            setMessage(null);
            messageTimeoutRef.current = null;
        }, duration);
    }, []);

    // Helper: Trigger Bomb Sequence
    const triggerBombSequence = useCallback((targets: Car[], title: string, color: string) => {
        if (targets.length === 0) return;

        showMessage(title, color, 3000); // Show title longer
        setTimeScale(0.1); // Slow down time significantly

        let index = 0;
        const intervalTime = 300; // time between pops

        const popNext = () => {
            if (index >= targets.length) {
                // End of sequence, restore time
                // BUT only if not 'SLOW_TIME' or other effects... actually we setScale 0.1 for effect.
                // We should restore to 1 unless there is another reason.
                setTimeScale(1);
                return;
            }

            const target = targets[index];

            // Check if stage cleared in the meantime? 
            // The score update below will trigger the useEffect, which triggers update loop check.

            setCars(prev => prev.filter(c => c.id !== target.id));
            setScore(prev => prev + 200);
            soundManager.playExplosion();

            // Visual feedback? maybe already covered by disappearing car + global score update.

            index++;
            setTimeout(popNext, intervalTime);
        };

        popNext();
    }, [showMessage]);

    // Initial Audio Setup
    useEffect(() => {
        const initAudio = () => {
            soundManager.resume();
            soundManager.playBGM();
        };
        window.addEventListener('click', initAudio, { once: true });
        return () => {
            window.removeEventListener('click', initAudio);
            soundManager.stopBGM();
        };
    }, []);

    // Save Progress & Reset Lane Spawn Positions
    useEffect(() => {
        // 스테이지 변경 시 차선별 스폰 위치 재초기화 (모든 차선을 공평하게 사용하기 위함)
        const config = settings.PHASES[phase] || settings.PHASES[5];
        const maxLanes = config.lanes;

        for (let i = 0; i < maxLanes; i++) {
            lastLaneSpawnY.current[i] = 100;
        }

        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('maxClearedPhase');
            const currentMax = saved ? parseInt(saved, 10) : 1;
            if (phase > currentMax) {
                localStorage.setItem('maxClearedPhase', phase.toString());
            }
        }
        isAmbulanceSpawnedInPhase.current = false;
        isPoliceSpawnedInPhase.current = false;
        setCars([]); // Reset cars on stage change
    }, [phase, settings]);

    // Sync scoreRef
    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    const flushCombo = useCallback(() => {
        // If Shield is active, consume it and save combo
        if (shield > 0) {
            setShield(prev => Math.max(0, prev - 1));
            soundManager.playShieldBlock(); // Use shield block sound
            showMessage("SHIELD PROTECTED!", "#00ffff", 800);
            // Shield protects HP but COMBO breaks
        }

        if (comboScore > 0) {
            setScore(prev => prev + comboScore);
            setComboScore(0);
            setCombo(0);
        }
    }, [comboScore, shield]);

    const spawnCar = useCallback(() => {
        const config = settings.PHASES[phase] || settings.PHASES[5];

        // 도로 정비 효과 시 2칸으로 제한, 그렇지 않으면 스테이지별 lanes 사용
        const maxLanes = roadNarrowActive ? 2 : config.lanes;
        const allLanes = Array.from({ length: maxLanes }, (_, i) => i);

        const availableLanes = allLanes.filter(l => {
            const lastY = lastLaneSpawnY.current[l];
            return lastY > config.spawnYThreshold;
        });

        if (availableLanes.length === 0) return;

        const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
        const isOverspeed = Math.random() < config.overspeedProb;
        let speed = 0;

        if (isOverspeed) {
            speed = (settings.TARGET_SPEED + 1) + Math.random() * (config.maxSpeed - (settings.TARGET_SPEED + 1));
        } else {
            speed = config.minSpeed + Math.random() * ((settings.TARGET_SPEED - 1) - config.minSpeed);
        }

        const rand = Math.random();
        let type: CarType = 'NORMAL';

        if (rand < config.nitroProb) {
            type = 'NITRO';
        } else if (rand < config.nitroProb + config.trickProb) {
            type = 'TRICK';
        } else {

            // Priority Spawns (Ambulance / Police) - Check if they exist in this phase and haven't spawned yet
            if (config.hasAmbulance && !isAmbulanceSpawnedInPhase.current) {
                // Not probability based anymore, but we need to pick *when* to spawn.
                // We use a small random chance each tick to distribute it, but ensure it happens.
                // Giving it a 10% chance per spawn tick ensures it appears reasonably early/mid stage.
                if (Math.random() < 0.1) {
                    type = 'AMBULANCE';
                    isAmbulanceSpawnedInPhase.current = true;
                }
            }

            if (type === 'NORMAL' && config.hasPolice && !isPoliceSpawnedInPhase.current) {
                if (Math.random() < 0.1) {
                    type = 'POLICE';
                    isPoliceSpawnedInPhase.current = true;
                }
            }

            // Default logic if not special car
            if (type === 'NORMAL') {
                if (isOverspeed) {
                    if (Math.random() < config.swerveProb) {
                        type = 'SWERVE';
                    } else if (Math.random() < config.stopAndGoProb) {
                        type = 'STOP_AND_GO';
                    }
                }
            }
        }

        if (type === 'TRICK') speed = config.maxSpeed;
        if (type === 'NITRO') speed = config.minSpeed + 10;
        if (type === 'STOP_AND_GO') speed = config.maxSpeed;

        if (type === 'AMBULANCE') speed = (settings.PHYSICS as any).AMBULANCE_SPEED || GAME_SETTINGS.PHYSICS.AMBULANCE_SPEED;
        if (type === 'POLICE') speed = (settings.PHYSICS as any).POLICE_SPEED || GAME_SETTINGS.PHYSICS.POLICE_SPEED;

        if (!speed || isNaN(speed)) {
            speed = config.minSpeed;
        }

        let designType: 'RED' | 'BLUE' | 'YELLOW' | 'MOTORCYCLE' | 'AMBULANCE' | 'POLICE' = ['RED', 'BLUE', 'YELLOW'][Math.floor(Math.random() * 3)] as any;

        if (Math.random() < config.motorcycleProb) {
            designType = 'MOTORCYCLE';
            // 오토바이는 무작위 패턴 (급브레이크, 급가속, 차선변경, 정지후출발, 일반)
            const actionRand = Math.random();
            if (actionRand < 0.2) type = 'NORMAL';
            else if (actionRand < 0.4) type = 'TRICK';
            else if (actionRand < 0.6) type = 'NITRO';
            else if (actionRand < 0.8) type = 'SWERVE';
            else type = 'STOP_AND_GO';

            speed = Math.max(speed, config.maxSpeed + 10); // 기본 속도는 빠름
        }

        if (type === 'AMBULANCE') designType = 'AMBULANCE';
        if (type === 'POLICE') designType = 'POLICE';

        const newCar: Car = {
            id: carIdCounter.current++,
            lane,
            y: -10,
            speed,
            type,
            captured: false,
            actionDone: false,
            initialSpeed: speed,
            designType
        };

        lastLaneSpawnY.current[lane] = -10;
        setCars(prev => [...prev, newCar]);
    }, [phase, roadNarrowActive]);

    const capture = useCallback((lane: number) => {
        const now = performance.now();
        if (isPaused || now - lastClickTime.current < 50 || hp <= 0) return;
        lastClickTime.current = now;

        soundManager.playShutter();

        const config = settings.PHASES[phase] || settings.PHASES[5];
        const zoneHeight = config.zoneHeight + zoneModifier; // Apply Modifier
        const zoneBottom = settings.ZONE_BOTTOM_FIXED;
        const zoneTop = zoneBottom - zoneHeight;
        const zoneCenter = zoneTop + (zoneHeight / 2);

        const candidates = cars.filter(car =>
            car.lane === lane &&
            car.y > zoneTop - 5 &&
            car.y < zoneBottom + 5 &&
            !car.captured
        );

        // 겹쳐 있을 경우 우선순위 판정:
        // 1. 엠뷸런스, 경찰차 최우선 (클릭 보장이 필요함)
        // 2. 과속 차량 우선 (유저에게 유리하게)
        // 3. 나중에 스폰된 차량 우선 (화면상 위에 보이는 차량)
        candidates.sort((a, b) => {
            const aPriority = a.type === 'AMBULANCE' || a.type === 'POLICE';
            const bPriority = b.type === 'AMBULANCE' || b.type === 'POLICE';

            if (aPriority && !bPriority) return -1;
            if (!aPriority && bPriority) return 1;

            const aSpeeding = a.speed >= settings.TARGET_SPEED;
            const bSpeeding = b.speed >= settings.TARGET_SPEED;
            if (aSpeeding && !bSpeeding) return -1;
            if (!aSpeeding && bSpeeding) return 1;
            return b.id - a.id; // ID가 높을수록 나중에 스폰됨
        });

        const target = candidates[0];

        if (target) {
            const isOverSpeed = target.speed >= settings.TARGET_SPEED;

            if (isOverSpeed) {
                const dist = Math.abs(target.y - zoneCenter);
                const maxDist = zoneHeight / 2;
                const ratio = dist / maxDist;

                let grade = '';
                let baseScore = 10;
                let msgText = "SUCCESS!";
                let msgColor = "#2ed573";

                if (ratio <= 0.4) {
                    grade = 'PERFECT';
                    baseScore = 30;
                    msgText = "PERFECT!!";
                    msgColor = "#00FFFF"; // Electric Cyan
                } else if (ratio <= 0.7) {
                    grade = 'GOOD';
                    baseScore = 15;
                    msgText = "GOOD!";
                    msgColor = "#00FF00"; // Electric Lime
                } else {
                    grade = 'BAD';
                    baseScore = 5;
                    msgText = "BAD..";
                    msgColor = "#FFFF00"; // Electric Yellow
                }

                // 더블득점 효과 적용 (콤보 점수는 제외)
                if (doubleScoreActive) {
                    baseScore *= 2;
                }

                if (target.type === 'AMBULANCE' && grade === 'PERFECT') {
                    setHp(maxHp);
                    msgText = "🚑 EMERGENCY! FULL HEAL!";
                    msgColor = "#FF00FF"; // Electric Magenta
                    soundManager.playPowerUp();

                    // 진행 중인 효과들의 타이머 유효성 무효화 (슬로우 모션으로 인한 시간 왜곡)
                    if (roadNarrowActive) setRoadNarrowTimerValid(false);
                    if (cameraBoostActive) setCameraBoostTimerValid(false);
                    if (slowTimeActive) setSlowTimeTimerValid(false);
                    if (doubleScoreActive) setDoubleScoreTimerValid(false);
                    if (searchlightActive) setSearchlightTimerValid(false);

                    // 앰뷸런스 보상 효과: 2초간 슬로우 모션
                    setTimeScale(0.2);
                    setTimeout(() => {
                        // 슬로우 타임 아이템 효과 중이라면 0.5로, 아니면 1.0으로 복구
                        setTimeScale(slowTimeActive ? 0.5 : 1);
                    }, 2000);
                } else if (target.type === 'POLICE' && grade === 'PERFECT') {
                    setShield(prev => prev + 10);
                    msgText = "👮 POLICE BACKUP! SHIELD +10";
                    msgColor = "#3B82F6"; // Electric Blue
                    soundManager.playPowerUp();

                    // 진행 중인 효과들의 타이머 유효성 무효화 (슬로우 모션으로 인한 시간 왜곡)
                    if (roadNarrowActive) setRoadNarrowTimerValid(false);
                    if (cameraBoostActive) setCameraBoostTimerValid(false);
                    if (slowTimeActive) setSlowTimeTimerValid(false);
                    if (doubleScoreActive) setDoubleScoreTimerValid(false);
                    if (searchlightActive) setSearchlightTimerValid(false);

                    // 경찰차 보상 효과: 2초간 슬로우 모션
                    setTimeScale(0.2);
                    setTimeout(() => {
                        setTimeScale(slowTimeActive ? 0.5 : 1);
                    }, 2000);
                }

                setCombo(prevCombo => {
                    const newCombo = prevCombo + 1;
                    const comboBonus = newCombo * 2;
                    const totalGain = baseScore + comboBonus;
                    setComboScore(prevScore => prevScore + totalGain);
                    return newCombo;
                });

                showMessage(`${msgText}`, msgColor, 800);
                soundManager.playSuccess();
            } else {
                // FAIL
                flushCombo(); // Check Shield inside flushCombo

                if (shield <= 0) {
                    setScore(s => Math.max(0, s - 30));
                    setHp(h => Math.max(0, h - 10));
                    showMessage("FAILED!", "#FF0040", 500); // Electric Red-Pink
                    soundManager.playFail();
                    isPerfectRoundRef.current = false;
                }
            }
            setCars(prev => prev.map(c => c.id === target.id ? { ...c, captured: true } : c));
        } else {
            const lateTarget = cars.find(car =>
                car.lane === lane &&
                car.y >= zoneBottom + 5 &&
                car.y < 120 &&
                car.speed >= settings.TARGET_SPEED &&
                !car.captured
            );

            if (lateTarget) {
                showMessage("TOO LATE", "#fbbf24", 500);
            } else {
                // MISS
                flushCombo(); // Check Shield

                if (shield <= 0) {
                    setScore(s => Math.max(0, s - 30));
                    setHp(h => Math.max(0, h - 10));
                    showMessage("MISS!", "#FF0040", 500); // Electric Red-Pink
                    soundManager.playFail();
                    isPerfectRoundRef.current = false;
                }
            }
        }
    }, [cars, isPaused, phase, flushCombo, maxHp, comboScore, zoneModifier, shield, doubleScoreActive, slowTimeActive]);

    const update = useCallback((time: number) => {
        if (isPaused || isTransitioning || isStageClear) {
            lastFrameTime.current = time;
            gameLoopRef.current = requestAnimationFrame(update);
            return;
        }

        const deltaTime = lastFrameTime.current === 0
            ? 0.016
            : Math.min((time - lastFrameTime.current) / 1000, 0.1);
        lastFrameTime.current = time;

        const currentConfig = settings.PHASES[phase];
        const totalCurrentScore = scoreRef.current + comboScore;
        const phaseProgress = totalCurrentScore - scoreAtPhaseStart.current;

        if (phaseProgress >= currentConfig.scoreLimit && settings.PHASES[phase + 1]) {
            // Trigger Stage Clear Sequence
            if (!isStageClear) {
                setIsStageClear(true);
                soundManager.playLevelUp(); // Play fanfare right away

                // Flush remaining combo
                if (comboScore > 0) {
                    setScore(prev => prev + comboScore);
                    setComboScore(0);
                    setCombo(0);
                }

                // Wait 2.5s then transition
                setTimeout(() => {
                    setIsStageClear(false);
                    scoreAtPhaseStart.current = totalCurrentScore + comboScore;
                    setIsTransitioning(true);

                    const nextPhase = phase + 1;
                    setPhase(nextPhase);

                    // Reset Modifiers on phase change
                    setTimeScale(1);
                    setZoneModifier(0);
                    setRoadNarrowActive(false);
                    setShield(0); // Reset Shield on Stage Clear

                    if (isPerfectRoundRef.current) {
                        soundManager.playPowerUp();
                        setMaxHp(prev => {
                            const newMax = prev * 1.1;
                            setHp(newMax);
                            return newMax;
                        });
                        setPrevStageResult({ type: 'PERFECT', value: 10 });
                    } else {
                        soundManager.playHeal();
                        setHp(current => {
                            const missing = maxHp - current;
                            const healAmount = missing * 0.5;
                            setPrevStageResult({ type: 'NORMAL', value: healAmount });
                            return current + healAmount;
                        });
                    }
                    isPerfectRoundRef.current = true;
                }, 2500);
            }
            return;
        }

        // Apply Time Scale to Spawn Interval
        const spawnInterval = currentConfig.spawnInterval / timeScale;
        if (time - lastSpawnTime.current > spawnInterval) {
            spawnCar();
            lastSpawnTime.current = time;
        }

        const zoneTop = settings.ZONE_BOTTOM_FIXED - (currentConfig.zoneHeight + zoneModifier);

        setCars(prev => {
            let changed = false;
            const nextCars = [];

            for (let i = 0; i < prev.length; i++) {
                const car = prev[i];
                let nextSpeed = car.speed;
                let nextLane = car.lane;
                let nextActionDone = car.actionDone;
                let stoppedAt = car.stoppedAt;

                if (!car.actionDone) {
                    let triggerOffset = settings.PHYSICS.ACTION_TRIGGER_OFFSETS.TRICK;
                    if (car.type === 'SWERVE') {
                        triggerOffset = car.designType === 'MOTORCYCLE'
                            ? settings.PHYSICS.ACTION_TRIGGER_OFFSETS.MOTORCYCLE
                            : settings.PHYSICS.ACTION_TRIGGER_OFFSETS.SWERVE;
                    }

                    if (car.y > zoneTop - triggerOffset) {
                        if (car.type === 'TRICK') nextSpeed = 92;
                        else if (car.type === 'NITRO') nextSpeed = 138;
                        else if (car.type === 'SWERVE') {
                            const possibleLanes = [];
                            const maxLanes = roadNarrowActive ? 2 : currentConfig.lanes; // Use active lane count

                            if (car.lane > 0) possibleLanes.push(car.lane - 1);
                            if (car.lane < maxLanes - 1) possibleLanes.push(car.lane + 1);

                            if (possibleLanes.length > 0) {
                                nextLane = possibleLanes[Math.floor(Math.random() * possibleLanes.length)];
                            }
                        }
                        nextActionDone = true;
                    }
                }




                // 경찰차 랜덤 차선 변경 로직
                if (car.type === 'POLICE' && !car.captured && car.y < 90) { // 90 미만 (단속구역 진입 전까지?) 혹은 계속? "달려와야 하며"
                    // 일정 주기로 차선 변경 시도
                    const now = time;
                    const lastChange = car.lastLaneChangeTime || 0;

                    // 2초 마다 변경 시도 (너무 자주 바꾸지 않도록)
                    if (now - lastChange > 2000 && Math.random() < 0.03) {
                        const possibleLanes = [];
                        const maxLanes = roadNarrowActive ? 2 : currentConfig.lanes;

                        if (car.lane > 0) possibleLanes.push(car.lane - 1);
                        if (car.lane < maxLanes - 1) possibleLanes.push(car.lane + 1);

                        if (possibleLanes.length > 0) {
                            nextLane = possibleLanes[Math.floor(Math.random() * possibleLanes.length)];
                        }
                    }
                }

                if (car.type === 'STOP_AND_GO' && !car.captured) {
                    const stopLine = zoneTop - 15;
                    if (!car.actionDone && car.y >= stopLine) {
                        if (!stoppedAt) {
                            nextSpeed = 0;
                            stoppedAt = time;
                        } else {
                            const stopDuration = time - stoppedAt;
                            if (stopDuration < 3000) nextSpeed = 0;
                            else {
                                nextSpeed = 130;
                                nextActionDone = true;
                            }
                        }
                    }
                }

                const speedPerSecond = (nextSpeed / currentConfig.speedCoefficient) * 60;
                // Apply Time Scale to Speed
                const fallingSpeed = speedPerSecond * deltaTime * timeScale;
                const nextY = car.y + fallingSpeed;
                lastLaneSpawnY.current[car.lane] = nextY;

                if (car.y < settings.ZONE_BOTTOM_FIXED && nextY >= settings.ZONE_BOTTOM_FIXED && !car.captured && car.speed >= settings.TARGET_SPEED) {
                    if (comboScore > 0) {
                        setScore(s => s + comboScore);
                        setComboScore(0);
                        setCombo(0);
                    }

                    // If Game Over is processing, don't reduce HP further or show excessive messages
                    if (!isGameOverProcessing.current) {
                        if (shield <= 0) {
                            setHp(h => Math.max(0, h - 20));
                            showMessage("MISSED!", "#eb4d4b", 500);
                            soundManager.playFail();
                            isPerfectRoundRef.current = false;
                        } else {
                            // Shield Blocked Miss
                            setShield(h => Math.max(0, h - 1));
                            soundManager.playShieldBlock();
                            showMessage("SHIELD PROTECTED!", "#00ffff", 800);
                        }
                    }
                }

                if (car.y !== nextY || car.speed !== nextSpeed || car.lane !== nextLane || car.actionDone !== nextActionDone) {
                    const lastLaneChangeTime = (car.type === 'POLICE' && car.lane !== nextLane) ? time : car.lastLaneChangeTime;
                    nextCars.push({ ...car, y: nextY, speed: nextSpeed, lane: nextLane, actionDone: nextActionDone, stoppedAt, lastLaneChangeTime });
                    changed = true;
                } else {
                    nextCars.push(car);
                }
            }

            const finalCars = nextCars.filter(c => c.y < 110);
            return (changed || finalCars.length !== prev.length) ? finalCars : prev;
        });

        gameLoopRef.current = requestAnimationFrame(update);
    }, [phase, spawnCar, isTransitioning, comboScore, maxHp, flushCombo, isPaused, timeScale, zoneModifier, shield]);

    useEffect(() => {
        gameLoopRef.current = requestAnimationFrame(update);
        return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
    }, [update]);

    useEffect(() => {
        if (hp <= 0 && !isGameOverProcessing.current) {
            if (devMode) {
                // In Dev Mode, prevent death
                setHp(maxHp);
                return;
            }

            isGameOverProcessing.current = true;

            // Trigger Dramatic Game Over Sequence
            setTimeScale(0.1); // Slow motion
            soundManager.playFail();
            showMessage("MISSION FAILED", "#ff0000", 4000);

            // Delay actual transition
            const timer = setTimeout(() => {
                onGameOver(score);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [hp, score, onGameOver, devMode, maxHp, showMessage]);

    const startPhaseAction = useCallback(() => {
        setCountdown(3);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev === null || prev <= 1) {
                    clearInterval(timer);
                    setIsTransitioning(false);
                    lastSpawnTime.current = performance.now();
                    lastFrameTime.current = 0;
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const applyReward = useCallback((effect: RewardEffect) => {
        soundManager.playPowerUp();

        // 진행 중인 효과들의 타이머 유효성 무효화 (슬로우 모션으로 인한 시간 왜곡)
        if (roadNarrowActive) setRoadNarrowTimerValid(false);
        if (cameraBoostActive) setCameraBoostTimerValid(false);
        if (slowTimeActive) setSlowTimeTimerValid(false);
        if (doubleScoreActive) setDoubleScoreTimerValid(false);
        if (searchlightActive) setSearchlightTimerValid(false);

        // 보상 효과 발동 시 4초간 슬로우 모션 (효과 확인용)
        setTimeScale(0.1);
        setTimeout(() => {
            // SLOW_TIME 효과가 아닌 경우에만 원래 속도로 복구
            if (effect !== 'SLOW_TIME') {
                setTimeScale(1);
            }
        }, 4000);

        switch (effect) {
            case 'HEAL_50':
                setHp(prev => Math.min(prev + maxHp * 0.5, maxHp));
                showMessage("체력 회복", '#2ecc71', 2000);
                break;
            case 'HEAL_100':
                setHp(maxHp);
                showMessage("완전 회복", '#27ae60', 2000);
                break;
            case 'SHIELD':
                setShield(prev => prev + 3);
                showMessage("쉴드 충전", '#00d2d3', 2000);
                break;
            case 'BOMB_ALL': {
                setCars(currentCars => {
                    const visibleCars = currentCars.filter(c => c.y > -20 && c.y < 120 && !c.captured);
                    if (visibleCars.length === 0) {
                        return currentCars; // No targets, do nothing
                    }

                    // Don't remove immediately. Use triggerBombSequence
                    triggerBombSequence(visibleCars, "전체 파괴!", '#ff4757');

                    // Return cars AS IS for now, they will be removed one by one
                    return currentCars;
                });
                break;
            }
            case 'BOMB_HALF': {
                setCars(currentCars => {
                    const visibleCars = currentCars.filter(c => c.y > -20 && c.y < 120 && !c.captured);
                    if (visibleCars.length === 0) return currentCars;

                    const halfCount = Math.ceil(visibleCars.length / 2);
                    const toRemove = visibleCars.slice(0, halfCount);

                    triggerBombSequence(toRemove, "절반 파괴!", '#ff6348');

                    return currentCars;
                });
                break;
            }
            case 'ROAD_NARROW':
                setRoadNarrowActive(true);
                setRoadNarrowTimerValid(true); // 타이머 유효성 초기화
                showMessage("도로 정비", '#f39c12', 2000);
                // 2칸 밖의 차량 제거
                setCars(currentCars => currentCars.filter(c => c.lane < 2));
                // 4초 후에 endTime 설정 (슬로우 모션 이후)
                setTimeout(() => {
                    setRoadNarrowEndTime(Date.now() + 30000);
                }, 4000);
                setTimeout(() => {
                    setRoadNarrowActive(false);
                    showMessage("도로 복구", '#f39c12', 2000);
                }, 34000); // 4초 + 30초
                break;
            case 'CAMERA_BOOST':
                setCameraBoostActive(true);
                setCameraBoostTimerValid(true); // 타이머 유효성 초기화
                setZoneModifier(40);
                showMessage("카메라 강화", '#ffa502', 2000);

                // 4초 후에 endTime 설정 (슬로우 모션 이후)
                setTimeout(() => {
                    setCameraBoostEndTime(Date.now() + 30000);
                }, 4000);

                // 30초 후 복구
                setTimeout(() => {
                    setCameraBoostActive(false);
                    setZoneModifier(0);
                    showMessage("카메라 복구", '#ffa502', 2000);
                }, 34000); // 4초 + 30초
                break;
            case 'SLOW_TIME':
                setSlowTimeTimerValid(true); // 타이머 유효성 초기화
                showMessage("시간 감속", '#a55eea', 34000);
                // 4초 후부터 30초간 슬로우 적용
                setTimeout(() => {
                    setSlowTimeActive(true);
                    setSlowTimeEndTime(Date.now() + 30000); // 여기서 설정 (실제 효과 시작 시점)
                    setTimeScale(0.5);
                    setTimeout(() => {
                        setSlowTimeActive(false);
                        setTimeScale(1);
                        showMessage("속도 복구", '#a55eea', 2000);
                    }, 30000);
                }, 4000);
                break;
            case 'DOUBLE_SCORE':
                setDoubleScoreActive(true);
                setDoubleScoreTimerValid(true); // 타이머 유효성 초기화
                showMessage("더블득점!", '#FFD700', 2000);
                // 4초 후에 endTime 설정 (슬로우 모션 이후)
                setTimeout(() => {
                    setDoubleScoreEndTime(Date.now() + 60000); // 1분
                }, 4000);
                setTimeout(() => {
                    setDoubleScoreActive(false);
                    showMessage("득점 복구", '#FFD700', 2000);
                }, 64000); // 4초 + 60초
                break;
            case 'SEARCHLIGHT':
                setSearchlightActive(true);
                setSearchlightTimerValid(true); // 타이머 유효성 초기화
                showMessage("서치라이트!", '#00CED1', 2000);
                // 4초 후에 endTime 설정 (슬로우 모션 이후)
                setTimeout(() => {
                    setSearchlightEndTime(Date.now() + 60000); // 1분
                }, 4000);
                setTimeout(() => {
                    setSearchlightActive(false);
                    showMessage("서치라이트 종료", '#00CED1', 2000);
                }, 64000); // 4초 + 60초
                break;
        }

        // 콤보 리셋
        if (comboScore > 0) {
            setScore(prev => prev + comboScore);
        }
        setCombo(0);
        setComboScore(0);
    }, [maxHp, comboScore, showMessage]);

    // Exposed functionality
    return {
        // State
        hp,
        maxHp,
        score,
        phase,
        cars,
        message,
        isTransitioning,
        countdown,
        isPaused,
        prevStageResult,
        combo,
        comboScore,
        shield,
        timeScale,
        zoneModifier,
        roadNarrowActive,
        roadNarrowEndTime,
        roadNarrowTimerValid,
        cameraBoostActive,
        cameraBoostEndTime,
        cameraBoostTimerValid,
        slowTimeActive,
        slowTimeEndTime,
        slowTimeTimerValid,
        isStageClear,
        doubleScoreActive,
        doubleScoreEndTime,
        doubleScoreTimerValid,
        searchlightActive,
        searchlightEndTime,
        searchlightTimerValid,

        // Settings (커스텀 또는 기본)
        settings,

        // Actions
        capture,
        setIsPaused,
        startPhaseAction,
        applyReward,

        // State Setters (if needed for rewards eventually)
        setHp,
        setScore,
        setCombo,
        setCars,
    };
};
