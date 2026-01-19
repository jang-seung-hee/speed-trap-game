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
    const scoreAtPhaseStart = useRef(0);

    // Reward States
    const [shield, setShield] = useState(0);
    const [timeScale, setTimeScale] = useState(1);
    const [zoneModifier, setZoneModifier] = useState(0);
    const [roadNarrowActive, setRoadNarrowActive] = useState(false);
    const [roadNarrowEndTime, setRoadNarrowEndTime] = useState(0);
    const [cameraBoostActive, setCameraBoostActive] = useState(false);

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

    // Save Progress
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('maxClearedPhase');
            const currentMax = saved ? parseInt(saved, 10) : 1;
            if (phase > currentMax) {
                localStorage.setItem('maxClearedPhase', phase.toString());
            }
        }
        isAmbulanceSpawnedInPhase.current = false;
    }, [phase]);

    // Sync scoreRef
    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    const flushCombo = useCallback(() => {
        // If Shield is active, consume it and save combo
        if (shield > 0) {
            setShield(prev => prev - 1);
            soundManager.playPowerUp(); // Use powerup sound for shield save
            setMessage({ text: "SHIELD PROTECTED!", color: "#00d2d3" });
            setTimeout(() => setMessage(null), 800);
            return;
        }

        if (comboScore > 0) {
            setScore(prev => prev + comboScore);
            setComboScore(0);
            setCombo(0);
        }
    }, [comboScore, shield]);

    const spawnCar = useCallback(() => {
        const config = settings.PHASES[phase] || settings.PHASES[5];

        // 도로 정비 효과 시 2칸으로 제한
        const maxLanes = roadNarrowActive ? 2 : settings.LANES;
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
            if ((phase === 11 || !isAmbulanceSpawnedInPhase.current) && Math.random() < config.ambulanceProb) {
                type = 'AMBULANCE';
                isAmbulanceSpawnedInPhase.current = true;
            } else if (isOverspeed) {
                if (Math.random() < config.swerveProb) {
                    type = 'SWERVE';
                } else if (Math.random() < config.stopAndGoProb) {
                    type = 'STOP_AND_GO';
                }
            }
        }

        if (type === 'TRICK') speed = config.maxSpeed;
        if (type === 'NITRO') speed = config.minSpeed + 10;
        if (type === 'STOP_AND_GO') speed = config.maxSpeed;
        if (type === 'AMBULANCE') speed = settings.PHYSICS.AMBULANCE_SPEED;

        let designType: 'RED' | 'BLUE' | 'YELLOW' | 'MOTORCYCLE' | 'AMBULANCE' = ['RED', 'BLUE', 'YELLOW'][Math.floor(Math.random() * 3)] as any;

        if (Math.random() < config.motorcycleProb) {
            designType = 'MOTORCYCLE';
            if (isOverspeed) type = 'SWERVE';
        }

        if (type === 'AMBULANCE') designType = 'AMBULANCE';

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
    }, [phase]);

    const capture = useCallback((lane: number) => {
        const now = performance.now();
        if (isPaused || now - lastClickTime.current < 50) return;
        lastClickTime.current = now;

        soundManager.playShutter();

        const config = settings.PHASES[phase] || settings.PHASES[5];
        const zoneHeight = config.zoneHeight + zoneModifier; // Apply Modifier
        const zoneBottom = settings.ZONE_BOTTOM_FIXED;
        const zoneTop = zoneBottom - zoneHeight;
        const zoneCenter = zoneTop + (zoneHeight / 2);

        const target = cars.find(car =>
            car.lane === lane &&
            car.y > zoneTop - 5 &&
            car.y < zoneBottom + 5 &&
            !car.captured
        );

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
                    msgColor = "#00d2d3";
                } else if (ratio <= 0.7) {
                    grade = 'GOOD';
                    baseScore = 15;
                    msgText = "GOOD!";
                    msgColor = "#2ed573";
                } else {
                    grade = 'BAD';
                    baseScore = 5;
                    msgText = "BAD..";
                    msgColor = "#ffa502";
                }

                if (target.type === 'AMBULANCE' && grade === 'PERFECT') {
                    setHp(maxHp);
                    msgText = "FULL HEAL!";
                    msgColor = "#ff4757";
                    soundManager.playPowerUp();
                }

                setCombo(prevCombo => {
                    const newCombo = prevCombo + 1;
                    const comboBonus = newCombo * 2;
                    const totalGain = baseScore + comboBonus;
                    setComboScore(prevScore => prevScore + totalGain);
                    return newCombo;
                });

                setMessage({ text: `${msgText}`, color: msgColor });
                soundManager.playSuccess();
                setTimeout(() => setMessage(null), 800);
            } else {
                // FAIL
                flushCombo(); // Check Shield inside flushCombo

                if (shield === 0) {
                    setScore(s => Math.max(0, s - 30));
                    setHp(h => Math.max(0, h - 10));
                    setMessage({ text: "FAILED!", color: "#ff4757" });
                    soundManager.playFail();
                    isPerfectRoundRef.current = false;
                    setTimeout(() => setMessage(null), 500);
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
                setMessage({ text: "TOO LATE", color: "#fbbf24" });
                setTimeout(() => setMessage(null), 500);
            } else {
                // MISS
                flushCombo(); // Check Shield

                if (shield === 0) {
                    setScore(s => Math.max(0, s - 30));
                    setHp(h => Math.max(0, h - 10));
                    setMessage({ text: "MISS!", color: "#ff4757" });
                    soundManager.playFail();
                    isPerfectRoundRef.current = false;
                    setTimeout(() => setMessage(null), 500);
                }
            }
        }
    }, [cars, isPaused, phase, flushCombo, maxHp, comboScore, zoneModifier, shield]);

    const update = useCallback((time: number) => {
        if (isPaused || isTransitioning) {
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
            if (comboScore > 0) {
                setScore(prev => prev + comboScore);
                setComboScore(0);
                setCombo(0);
            }

            scoreAtPhaseStart.current = totalCurrentScore + comboScore;
            setIsTransitioning(true);
            soundManager.playLevelUp();
            const nextPhase = phase + 1;
            setPhase(nextPhase);

            // Reset Modifiers on phase change
            setTimeScale(1);
            setZoneModifier(0);

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
                            if (car.lane > 0) possibleLanes.push(car.lane - 1);
                            if (car.lane < settings.LANES - 1) possibleLanes.push(car.lane + 1);
                            if (possibleLanes.length > 0) {
                                nextLane = possibleLanes[Math.floor(Math.random() * possibleLanes.length)];
                            }
                        }
                        nextActionDone = true;
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

                const speedPerSecond = (nextSpeed / settings.PHYSICS.SPEED_COEFFICIENT) * 60;
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

                    if (shield === 0) {
                        setHp(h => Math.max(0, h - 20));
                        setMessage({ text: "MISSED!", color: "#eb4d4b" });
                        soundManager.playFail();
                        isPerfectRoundRef.current = false;
                        setTimeout(() => setMessage(null), 500);
                    } else {
                        // Shield Blocked Miss
                        setShield(h => h - 1);
                        soundManager.playPowerUp();
                        setMessage({ text: "SHIELD PROTECTED!", color: "#00d2d3" });
                        setTimeout(() => setMessage(null), 800);
                    }
                }

                if (car.y !== nextY || car.speed !== nextSpeed || car.lane !== nextLane || car.actionDone !== nextActionDone) {
                    nextCars.push({ ...car, y: nextY, speed: nextSpeed, lane: nextLane, actionDone: nextActionDone, stoppedAt });
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
        if (hp <= 0) {
            onGameOver(score);
        }
    }, [hp, score, onGameOver]);

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

        switch (effect) {
            case 'HEAL_50':
                setHp(prev => Math.min(prev + maxHp * 0.5, maxHp));
                setMessage({ text: "체력 50% 회복!", color: '#2ecc71' });
                break;
            case 'HEAL_100':
                setHp(maxHp);
                setMessage({ text: "체력 완전 회복!", color: '#27ae60' });
                break;
            case 'SHIELD':
                setShield(prev => prev + 3);
                setMessage({ text: "쉴드 +3!", color: '#00d2d3' });
                break;
            case 'BOMB_ALL':
                setCars(currentCars => {
                    const visibleCars = currentCars.filter(c => c.y > -20 && c.y < 120 && !c.captured);
                    if (visibleCars.length === 0) return currentCars;

                    const scoreGain = visibleCars.length * 200;
                    setScore(prev => prev + scoreGain);
                    setMessage({ text: `올킬! +${scoreGain}점`, color: '#ff4757' });

                    return currentCars.filter(c => !(c.y > -20 && c.y < 120 && !c.captured));
                });
                break;
            case 'BOMB_HALF':
                setCars(currentCars => {
                    const visibleCars = currentCars.filter(c => c.y > -20 && c.y < 120 && !c.captured);
                    if (visibleCars.length === 0) return currentCars;

                    const halfCount = Math.ceil(visibleCars.length / 2);
                    const toRemove = visibleCars.slice(0, halfCount);
                    const scoreGain = halfCount * 200;
                    setScore(prev => prev + scoreGain);
                    setMessage({ text: `하프킬! +${scoreGain}점`, color: '#ff6348' });

                    const removeIds = new Set(toRemove.map(c => c.id));
                    return currentCars.filter(c => !removeIds.has(c.id));
                });
                break;
            case 'ROAD_NARROW':
                setRoadNarrowActive(true);
                setRoadNarrowEndTime(Date.now() + 60000);
                setMessage({ text: "도로 정비! (60초)", color: '#f39c12' });
                // 2칸 밖의 차량 제거
                setCars(currentCars => currentCars.filter(c => c.lane < 2));
                setTimeout(() => {
                    setRoadNarrowActive(false);
                    setMessage({ text: "도로 복구", color: '#f39c12' });
                }, 60000);
                break;
            case 'CAMERA_BOOST':
                setCameraBoostActive(true);
                setZoneModifier(40);
                setMessage({ text: "고성능 카메라!", color: '#ffa502' });
                break;
            case 'SLOW_TIME':
                setTimeScale(0.5); // 속도를 절반으로 감소 (느려짐)
                setMessage({ text: "슬로우! (60초)", color: '#a55eea' });
                setTimeout(() => {
                    setTimeScale(1);
                    setMessage({ text: "속도 복구", color: '#a55eea' });
                }, 60000);
                break;
        }

        // 콤보 리셋
        if (comboScore > 0) {
            setScore(prev => prev + comboScore);
        }
        setCombo(0);
        setComboScore(0);

        setTimeout(() => setMessage(null), 2000);
    }, [maxHp, comboScore]);

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
