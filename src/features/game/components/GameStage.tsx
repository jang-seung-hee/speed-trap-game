'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { GAME_SETTINGS, type CarType, type PhaseConfig } from '../constants';
import { soundManager } from '../utils/SoundManager';

// --- Types & Interfaces ---
interface Car {
    id: number;
    lane: number;
    y: number; // 0 to 100
    speed: number;
    type: CarType;
    captured: boolean;
    actionDone: boolean;
    initialSpeed: number;
    designType: 'RED' | 'BLUE' | 'YELLOW' | 'MOTORCYCLE' | 'AMBULANCE';
    stoppedAt?: number; // STOP_AND_GO 차량용: 정지 시작 시간
}

interface GameStageProps {
    onGameOver: (score: number) => void;
    onBackToTitle: () => void;
    initialPhase?: number;
}

const GameStage: React.FC<GameStageProps> = ({ onGameOver, onBackToTitle, initialPhase = 1 }) => {
    const [hp, setHp] = useState(100);
    const [score, setScore] = useState(0);
    const [phase, setPhase] = useState(initialPhase);
    const [cars, setCars] = useState<Car[]>([]);
    const [message, setMessage] = useState<{ text: string; color: string } | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(true); // 처음 시작 시 브리핑 표시
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isPointerInside, setIsPointerInside] = useState(false);

    const cursorRef = useRef<HTMLDivElement>(null);
    const gameLoopRef = useRef<number | null>(null);
    const lastSpawnTime = useRef<number>(0);
    // 초기값을 100으로 설정하여 첫 차가 즉시 생성될 수 있도록 함
    const lastLaneSpawnY = useRef<Record<number, number>>((() => {
        const initial: Record<number, number> = {};
        for (let i = 0; i < GAME_SETTINGS.LANES; i++) {
            initial[i] = 100;
        }
        return initial;
    })());
    const carIdCounter = useRef<number>(0);
    const scoreRef = useRef(0);
    const isPerfectRoundRef = useRef(true); // 스테이지 내 실패 여부 (Perfect Clear 체크)
    const [maxHp, setMaxHp] = useState(100);
    const [prevStageResult, setPrevStageResult] = useState<{ type: 'PERFECT' | 'NORMAL' | null, value: number } | null>(null);

    const [combo, setCombo] = useState(0);
    const [comboScore, setComboScore] = useState(0);

    const isAmbulanceSpawnedInPhase = useRef(false);

    // --- Effects & Logic ---
    useEffect(() => {
        // 사용자 인터랙션이 있을 때 AudioContext를 활성화하고 BGM 재생
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

    // Save Progress Logic
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

    // Update score ref for game loop
    useEffect(() => {
        scoreRef.current = score;
    }, [score]);


    const flushCombo = useCallback(() => {
        if (comboScore > 0) {
            setScore(prev => prev + comboScore);
            setComboScore(0);
            setCombo(0);
        }
    }, [comboScore]);

    const spawnCar = useCallback(() => {
        const config = GAME_SETTINGS.PHASES[phase] || GAME_SETTINGS.PHASES[5];

        // 가용한 차선 탐색 (GAME_SETTINGS.LANES 기반)
        const allLanes = Array.from({ length: GAME_SETTINGS.LANES }, (_, i) => i);
        const availableLanes = allLanes.filter(l => {
            const lastY = lastLaneSpawnY.current[l];
            return lastY > config.spawnYThreshold;
        });

        if (availableLanes.length === 0) return;

        const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];

        // 1. 과속 여부 결정 (Speed Base)
        const isOverspeed = Math.random() < config.overspeedProb;
        let speed = 0;

        if (isOverspeed) {
            // 과속 차량: 101 ~ maxSpeed
            speed = (GAME_SETTINGS.TARGET_SPEED + 1) + Math.random() * (config.maxSpeed - (GAME_SETTINGS.TARGET_SPEED + 1));
        } else {
            // 정속 차량: minSpeed ~ 99
            speed = config.minSpeed + Math.random() * ((GAME_SETTINGS.TARGET_SPEED - 1) - config.minSpeed);
        }

        // 2. 특수 타입 결정 (Type Base)
        const rand = Math.random();
        let type: CarType = 'NORMAL';

        if (rand < config.nitroProb) {
            type = 'NITRO';
        } else if (rand < config.nitroProb + config.trickProb) {
            type = 'TRICK';
        } else {
            // Priority Check for Ambulance
            // Phase 11 (Infinite Mode) allows multiple ambulances via probability, others only once
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
        if (type === 'AMBULANCE') speed = GAME_SETTINGS.PHYSICS.AMBULANCE_SPEED;

        // 디자인 타입 결정
        let designType: 'RED' | 'BLUE' | 'YELLOW' | 'MOTORCYCLE' | 'AMBULANCE' = ['RED', 'BLUE', 'YELLOW'][Math.floor(Math.random() * 3)] as any;

        if (Math.random() < config.motorcycleProb) {
            designType = 'MOTORCYCLE';
            if (isOverspeed) {
                type = 'SWERVE';
            }
        }

        if (type === 'AMBULANCE') {
            designType = 'AMBULANCE';
        }

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

    const capture = (lane: number) => {
        // Shutter flash effect 제거 (성능 최적화)
        soundManager.playShutter();

        const config = GAME_SETTINGS.PHASES[phase] || GAME_SETTINGS.PHASES[5];
        const zoneHeight = config.zoneHeight;
        const zoneBottom = GAME_SETTINGS.ZONE_BOTTOM_FIXED;
        const zoneTop = zoneBottom - zoneHeight;
        const zoneCenter = zoneTop + (zoneHeight / 2);

        // Find target first to determine outcome
        const target = cars.find(car =>
            car.lane === lane &&
            car.y > zoneTop - 5 &&
            car.y < zoneBottom + 5 &&
            !car.captured
        );

        if (target) {
            const isOverSpeed = target.speed >= GAME_SETTINGS.TARGET_SPEED;

            if (isOverSpeed) {
                // SUCCESS - Grading System
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

                // AMBULANCE Effect
                if (target.type === 'AMBULANCE' && grade === 'PERFECT') {
                    setHp(maxHp);
                    msgText = "FULL HEAL!";
                    msgColor = "#ff4757"; // Red for medical/emergency
                    soundManager.playPowerUp();
                }

                // Combo Calculation
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
                // FAIL (Wrong Target)
                flushCombo();
                setScore(s => Math.max(0, s - 30));
                setHp(h => Math.max(0, h - 10));
                setMessage({ text: "FAILED!", color: "#ff4757" });
                soundManager.playFail();

                isPerfectRoundRef.current = false;
                setTimeout(() => setMessage(null), 500);
            }

            setCars(prev => prev.map(c => c.id === target.id ? { ...c, captured: true } : c));
        } else {
            // Check for Late Click (Avoid Double Punishment)
            // If a speeding car recently passed (and we already took -20 HP damage for it),
            // don't punish the user again for clicking late.
            const lateTarget = cars.find(car =>
                car.lane === lane &&
                car.y >= zoneBottom + 5 &&
                car.y < 120 && // Still visible or just left
                car.speed >= GAME_SETTINGS.TARGET_SPEED &&
                !car.captured
            );

            if (lateTarget) {
                // Forgiven
                setMessage({ text: "TOO LATE", color: "#fbbf24" }); // Yellow warning
                setTimeout(() => setMessage(null), 500);
                // No sound or failure effect
            } else {
                // FAIL (Truly Empty Ground)
                flushCombo();
                setScore(s => Math.max(0, s - 30));
                setHp(h => Math.max(0, h - 10));
                setMessage({ text: "MISS!", color: "#ff4757" });
                soundManager.playFail();

                isPerfectRoundRef.current = false;
                setTimeout(() => setMessage(null), 500);
            }
        }
    };

    const update = useCallback((time: number) => {
        if (isTransitioning) {
            gameLoopRef.current = requestAnimationFrame(update);
            return;
        }

        // Phase check
        const currentConfig = GAME_SETTINGS.PHASES[phase];
        const totalCurrentScore = scoreRef.current + comboScore;

        if (totalCurrentScore >= currentConfig.scoreLimit && GAME_SETTINGS.PHASES[phase + 1]) {
            // Apply remaining combo score before level up
            if (comboScore > 0) {
                setScore(prev => prev + comboScore);
                setComboScore(0);
                setCombo(0);
            }

            setIsTransitioning(true);
            soundManager.playLevelUp();
            const nextPhase = phase + 1;
            setPhase(nextPhase);

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

        const spawnInterval = currentConfig.spawnInterval;
        if (time - lastSpawnTime.current > spawnInterval) {
            spawnCar();
            lastSpawnTime.current = time;
        }

        const config = GAME_SETTINGS.PHASES[phase] || GAME_SETTINGS.PHASES[5];
        const zoneTop = GAME_SETTINGS.ZONE_BOTTOM_FIXED - config.zoneHeight;

        setCars(prev => {
            let changed = false;
            const nextCars = [];

            for (let i = 0; i < prev.length; i++) {
                const car = prev[i];
                let nextSpeed = car.speed;
                let nextLane = car.lane;
                let nextActionDone = car.actionDone;
                let stoppedAt = car.stoppedAt;

                if (!car.actionDone && car.y > zoneTop - 12) {
                    if (car.type === 'TRICK') nextSpeed = 92;
                    else if (car.type === 'NITRO') nextSpeed = 138;
                    else if (car.type === 'SWERVE') {
                        const possibleLanes = [];
                        if (car.lane > 0) possibleLanes.push(car.lane - 1);
                        if (car.lane < GAME_SETTINGS.LANES - 1) possibleLanes.push(car.lane + 1);
                        if (possibleLanes.length > 0) {
                            nextLane = possibleLanes[Math.floor(Math.random() * possibleLanes.length)];
                        }
                    }
                    nextActionDone = true;
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

                const fallingSpeed = nextSpeed / GAME_SETTINGS.PHYSICS.SPEED_COEFFICIENT;
                const nextY = car.y + fallingSpeed;
                lastLaneSpawnY.current[car.lane] = nextY;

                // Penalty Check
                if (car.y < GAME_SETTINGS.ZONE_BOTTOM_FIXED && nextY >= GAME_SETTINGS.ZONE_BOTTOM_FIXED && !car.captured && car.speed >= GAME_SETTINGS.TARGET_SPEED) {
                    if (comboScore > 0) {
                        setScore(s => s + comboScore);
                        setComboScore(0);
                        setCombo(0);
                    }
                    setHp(h => Math.max(0, h - 20));
                    setMessage({ text: "MISSED!", color: "#eb4d4b" });
                    soundManager.playFail();
                    isPerfectRoundRef.current = false;
                    setTimeout(() => setMessage(null), 500);
                }

                // If no changes, keep the same object to avoid re-renders
                if (car.y !== nextY || car.speed !== nextSpeed || car.lane !== nextLane || car.actionDone !== nextActionDone) {
                    nextCars.push({ ...car, y: nextY, speed: nextSpeed, lane: nextLane, actionDone: nextActionDone, stoppedAt });
                    changed = true;
                } else {
                    nextCars.push(car);
                }
            }

            // Remove off-screen cars
            const finalCars = nextCars.filter(c => c.y < 110);
            return (changed || finalCars.length !== prev.length) ? finalCars : prev;
        });

        gameLoopRef.current = requestAnimationFrame(update);
    }, [phase, spawnCar, isTransitioning, comboScore, maxHp, flushCombo]);

    const startPhaseAction = () => {
        setCountdown(3);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev === null || prev <= 1) {
                    clearInterval(timer);
                    setIsTransitioning(false);
                    lastSpawnTime.current = performance.now();
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        gameLoopRef.current = requestAnimationFrame(update);
        return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
    }, [update]);

    useEffect(() => {
        if (hp <= 0) {
            onGameOver(score);
        }
    }, [hp, score, onGameOver]);

    const zoneHeight = GAME_SETTINGS.PHASES[phase]?.zoneHeight || 10;
    const zoneTop = GAME_SETTINGS.ZONE_BOTTOM_FIXED - zoneHeight;

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isPointerInside) setIsPointerInside(true);

        if (cursorRef.current) {
            // 커서 위치를 즉시 업데이트 (깜빡임 방지)
            cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        }
    };

    return (
        <div
            className="relative w-full h-screen flex flex-col items-center bg-black overflow-hidden cursor-none"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setIsPointerInside(false)}
        >
            {/* Background with realistic asphalt texture */}
            <div
                className="absolute inset-0 bg-repeat"
                style={{
                    backgroundImage: 'url("/highway_bg.png")',
                    backgroundSize: '300px 300px',
                }}
            >
                <div
                    className="absolute inset-0 bg-black/10 animate-road-scroll"
                    style={{
                        backgroundImage: 'url("/highway_bg.png")',
                        backgroundSize: '300px 300px',
                    }}
                />
            </div>

            {/* HUD Layer */}
            <div className="absolute top-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center w-36">
                        <span className="text-[10px] font-black text-white/50 tracking-widest uppercase italic">Battery / HP</span>
                        <span className="text-xs font-bold text-red-500">{Math.round(hp)} / {Math.round(maxHp)}</span>
                    </div>
                    <div className="w-36 h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-red-600 to-orange-400"
                            animate={{ width: `${(hp / maxHp) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-white/50 tracking-widest uppercase italic">Score</span>
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-black text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)] italic tracking-tighter">
                            {(score + comboScore).toLocaleString().padStart(6, '0')}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white/50 tracking-widest uppercase italic">Phase</span>
                    <div className="text-2xl font-black text-yellow-400 italic">#{phase}</div>
                </div>
            </div>

            {/* Game Stage (Click Area) */}
            <div className="relative w-full max-w-md h-full overflow-hidden flex [container-type:size] shadow-2xl">
                {/* Road Grid */}
                <div className="absolute inset-x-0 inset-y-0 flex z-30">
                    {Array.from({ length: GAME_SETTINGS.LANES }).map((_, lane) => (
                        <div
                            key={lane}
                            className={`h-full flex-1 relative ${lane < GAME_SETTINGS.LANES - 1 ? 'border-r-2 border-dashed border-white/40' : ''}`}
                            onPointerDown={() => capture(lane)}
                        >
                            <div className="absolute inset-0 active:bg-white/10 transition-colors" />
                        </div>
                    ))}
                </div>

                {/* Detection Zone UI */}
                <div
                    className="absolute w-full z-10 pointer-events-none transition-all duration-500"
                    style={{ top: `${zoneTop}%`, height: `${zoneHeight}%` }}
                >
                    <div className="absolute top-0 inset-x-0 h-1 bg-yellow-400/60 shadow-[0_0_10px_yellow]" />
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,#fbbf24_25%,#fbbf24_50%,transparent_50%,transparent_75%,#fbbf24_75%,#fbbf24_100%)] bg-[length:20px_20px]" />
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-yellow-400/60 shadow-[0_0_10px_yellow]" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20px] font-black text-yellow-400/10 italic uppercase tracking-widest rotate-0 scale-y-150 pointer-events-none select-none">
                        SPEED LIMIT
                    </span>
                </div>

                {/* Cars Rendering */}
                {/* Cars Rendering */}
                {cars.map(car => (
                    <div
                        key={car.id}
                        className="absolute z-20 pointer-events-none will-change-transform"
                        style={{
                            left: 0,
                            top: 0,
                            transform: `translate3d(${car.lane * (100 / GAME_SETTINGS.LANES) + (100 / GAME_SETTINGS.LANES / 2)}cqw, ${car.y}cqh, 0) translate(-50%, -50%)`
                        }}
                    >
                        <CarVisual car={car} />
                    </div>
                ))}
            </div>

            {/* VFX: Messages - 경량화 (CSS Keyframes 활용) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                {message && (
                    <div
                        key={message.text}
                        className="text-6xl font-black italic tracking-tighter drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-game-message"
                        style={{ color: message.color }}
                    >
                        {message.text}
                    </div>
                )}
            </div>

            {/* Stage Transition Overlay */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="text-center px-8"
                        >
                            <motion.div
                                initial={{ scale: 1.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-yellow-400 text-sm font-black uppercase tracking-[0.5em] mb-4"
                            >
                                {prevStageResult ? (prevStageResult.type === 'PERFECT' ? 'PERFECT MISSION CLEAR!' : 'MISSION COMPLETE') : 'Mission Briefing'}
                            </motion.div>

                            {prevStageResult && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="mb-8 p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md"
                                >
                                    <div className={`text-2xl font-black italic mb-1 ${prevStageResult.type === 'PERFECT' ? 'text-emerald-400' : 'text-blue-400'}`}>
                                        {prevStageResult.type === 'PERFECT' ? 'MAX HP POWER UP!' : 'HP RECOVERED'}
                                    </div>
                                    <div className="text-4xl font-black text-white">
                                        {prevStageResult.type === 'PERFECT' ? `+10%` : `+${Math.round(prevStageResult.value)}`}
                                    </div>
                                    <div className="text-[10px] text-white/50 uppercase tracking-widest mt-1">
                                        {prevStageResult.type === 'PERFECT' ? 'PERFECT REWARD' : 'FIELD REPAIR'}
                                    </div>
                                </motion.div>
                            )}

                            <h2 className="text-5xl font-black text-white italic tracking-tighter mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                PHASE #{phase}
                            </h2>

                            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-8" />

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 backdrop-blur-sm max-w-sm mx-auto">
                                <p className="text-blue-100 text-lg font-bold leading-snug break-keep mb-4">
                                    {GAME_SETTINGS.PHASES[phase]?.description}
                                </p>
                                <div className="flex justify-center gap-4 text-[9px] text-white/30 font-bold uppercase tracking-[0.2em]">
                                    <span>Target: {GAME_SETTINGS.TARGET_SPEED}km/h</span>
                                    <span>•</span>
                                    <span>Lanes: {GAME_SETTINGS.LANES}</span>
                                </div>
                            </div>

                            {countdown === null ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        soundManager.playClick();
                                        startPhaseAction();
                                    }}
                                    className="px-10 py-4 bg-yellow-400 text-black text-xl font-black italic rounded-full shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_rgba(234,179,8,0.5)] transition-all whitespace-nowrap"
                                >
                                    READY TO ACTION
                                </motion.button>
                            ) : (
                                <motion.div
                                    key={countdown}
                                    initial={{ scale: 2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-9xl font-black text-white italic"
                                >
                                    {countdown}
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Mouse Cursor - 깜빡임 방지 최적화 */}
            <AnimatePresence>
                {isPointerInside && (
                    <motion.div
                        ref={cursorRef}
                        className="fixed top-0 left-0 z-[300] pointer-events-none"
                        initial={{ opacity: 0, scale: 0.5, x: '50vw', y: '50vh' }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        style={{ willChange: 'transform' }}
                    >
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <div className="absolute w-full h-full border-[3px] border-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
                            <div className="absolute w-8 h-1 bg-white border border-black/50" />
                            <div className="absolute h-8 w-1 bg-white border border-black/50" />
                            <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full border border-black shadow-lg" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Combo Monitor (Bottom Right) - 최적화됨 */}
            <ComboDisplay combo={combo} comboScore={comboScore} />

            {/* Debug/Abandon */}
            <div className="absolute bottom-4 z-50">
                <button
                    onClick={() => {
                        soundManager.playClick();
                        onBackToTitle();
                    }}
                    className="text-[10px] text-white/20 italic hover:text-white/50 underline tracking-tighter"
                >
                    ABANDON MISSION
                </button>
            </div>
        </div>
    );
};

// --- Sub-Components ---

// --- 최적화된 서브 컴포넌트들 ---

/** 콤보 표시 - 경량화 버전 (CSS 최적화) */
const ComboDisplay: React.FC<{ combo: number; comboScore: number }> = React.memo(({ combo, comboScore }) => {
    if (combo <= 0) return null;

    return (
        <div key={combo} className="absolute bottom-12 right-6 z-50 pointer-events-none animate-game-combo">
            <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-2">
                    <span
                        className="text-6xl font-black text-yellow-400 italic tracking-tighter drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]"
                        style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}
                    >
                        {combo}
                    </span>
                    <span className="text-xl font-black text-white/80 italic uppercase tracking-widest">
                        COMBO
                    </span>
                </div>
                <div className="text-lg font-bold text-green-400 italic drop-shadow-md">
                    +{comboScore} SCORE
                </div>
            </div>
        </div>
    );
}, (prev, next) => prev.combo === next.combo && prev.comboScore === next.comboScore);

const ScreenCrack: React.FC<{ style: React.CSSProperties }> = React.memo(({ style }) => (
    <div
        className="absolute opacity-60"
        style={{ ...style, width: '250px', height: '250px' }}
    >
        <svg viewBox="0 0 200 200" className="w-full h-full text-white/40 drop-shadow-md">
            <path
                d="M100,100 L120,20 L130,50 L180,40 M100,100 L180,120 L150,140 L190,180 M100,100 L80,180 L50,150 L10,190 M100,100 L20,80 L50,60 L20,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="2" fill="currentColor" />
        </svg>
    </div>
));

const CarVisual: React.FC<{ car: Car }> = React.memo(({ car }) => {
    // 사용자의 요청대로 속도가 자동차 디자인보다 중요하므로, 항상 어느 정도 보이게 설정
    // 단속 구역 근처에서는 더 환하게 강조됨
    const isNearZone = useMemo(() => car.y > GAME_SETTINGS.ZONE_BOTTOM_FIXED - 40, [car.y]);
    const showDetail = useMemo(() => isNearZone || car.captured, [isNearZone, car.captured]);

    const renderCarBody = () => {
        const bodyClass = car.captured
            ? (car.speed >= GAME_SETTINGS.TARGET_SPEED ? 'bg-green-600 border-green-400' : 'bg-red-600 border-red-400')
            : '';

        // 전면부 공통 HUD 영역 (검은색 앞유리 디자인 및 속도 표시) - 납작한 차체에 맞춰 비율 조정
        const HudDisplay = (
            <div className={`absolute top-[18%] left-1/2 -translate-x-1/2 w-[70%] h-[35%] bg-slate-950 rounded-sm border border-white/20 flex flex-col items-center justify-center z-20 overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.9)]`}>
                {/* HUD 스캔라인 효과 */}
                <div className="absolute inset-x-0 h-px bg-white/10 animate-scanline pointer-events-none" />

                <div className={`flex flex-col items-center justify-center transition-all duration-300 ${showDetail ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <span className="text-[5px] font-black text-white/30 tracking-[0.2em] leading-none mb-0.5">SPEED</span>
                    <span className={`text-xl font-black italic leading-none tracking-tighter ${showDetail
                        ? (car.speed >= GAME_SETTINGS.TARGET_SPEED ? 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]')
                        : 'text-white/40'
                        }`}>
                        {Math.floor(car.speed)}
                    </span>
                    <span className="text-[5px] font-bold text-white/20 leading-none mt-0.5">KM/H</span>
                </div>

                {/* 하단 속도 게이지 바 */}
                <div className={`absolute bottom-1 w-[60%] h-0.5 bg-white/5 rounded-full overflow-hidden transition-opacity duration-300 ${showDetail ? 'opacity-100' : 'opacity-0'}`}>
                    <div
                        className={`h-full transition-all duration-300 ${car.speed >= GAME_SETTINGS.TARGET_SPEED ? 'bg-rose-500' : 'bg-emerald-400'}`}
                        style={{ width: `${Math.min(100, (car.speed / 150) * 100)}%` }}
                    />
                </div>
            </div>
        );

        switch (car.designType) {
            case 'MOTORCYCLE':
                const isOverSpeed = car.speed >= GAME_SETTINGS.TARGET_SPEED;
                const lightColor = isOverSpeed ? 'bg-red-500' : 'bg-emerald-400';
                const beamColor = isOverSpeed ? 'from-red-500/40' : 'from-emerald-400/40';
                const shadowColor = isOverSpeed ? 'shadow-[0_0_15px_rgba(239,68,68,1)]' : 'shadow-[0_0_15px_rgba(52,211,153,1)]';

                return (
                    <div className="absolute inset-0">
                        {/* Light Beam Effect (Projecting Forward/Up) */}
                        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-[120%] h-24 bg-gradient-to-t ${beamColor} to-transparent blur-md pointer-events-none`} />

                        {/* 오토바이 바디 */}
                        <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-[80%] top-[10%] rounded-full shadow-lg ${isNearZone ? 'bg-purple-500' : 'bg-slate-800'} border border-white/20`} />

                        {/* 앞바퀴 */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-4 bg-black rounded-sm" />

                        {/* Headlight Source */}
                        <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-2 ${lightColor} rounded-full ${shadowColor} z-20`} />

                        {/* 뒷바퀴 */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-4 bg-black rounded-sm" />

                        {/* 운전자 헬멧 */}
                        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-5 h-5 bg-yellow-400 rounded-full border-2 border-black z-10" />
                        {/* 핸들바 */}
                        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-400 rounded-full" />
                    </div>
                );
            case 'AMBULANCE':
                return (
                    <div className="absolute inset-0">
                        {/* Siren Light Effect */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 bg-red-500/20 rounded-full blur-xl animate-pulse" />

                        {/* Body Shadow */}
                        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[75%] h-[75%] bg-black/60 blur-sm rounded-full transform scale-x-110" />

                        {/* White Body */}
                        <div className={`absolute top-[10%] left-1/2 -translate-x-1/2 w-[70%] h-[80%] bg-slate-100 rounded-lg shadow-[inset_0_2px_5px_rgba(255,255,255,0.8),0_5px_10px_rgba(0,0,0,0.3)] border-b-4 border-slate-300 overflow-hidden`}>
                            {/* Cabin Glass */}
                            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[85%] h-[25%] bg-sky-900 rounded-sm" />

                            {/* Red Cross Symbol on Top */}
                            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[60%] h-[50%] flex items-center justify-center opacity-90">
                                <div className="absolute w-full h-[25%] bg-red-600 shadow-sm" />
                                <div className="absolute h-full w-[25%] bg-red-600 shadow-sm" />
                            </div>
                        </div>

                        {/* Siren Lights on Roof */}
                        <div className="absolute top-[12%] left-[20%] w-3 h-2 bg-red-600 rounded-sm animate-pulse shadow-[0_0_10px_red]" />
                        <div className="absolute top-[12%] right-[20%] w-3 h-2 bg-red-600 rounded-sm animate-pulse shadow-[0_0_10px_red]" />
                    </div>
                );
            case 'BLUE':
                return (
                    <div className={`absolute inset-0 rounded-[15%_15%_10%_10%] border-[2px] shadow-xl transition-all duration-500 ${bodyClass || 'bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 border-blue-950'}`}>
                        {HudDisplay}
                        {/* 납작한 형태에 맞춘 헤드라이트 */}
                        <div className="absolute top-1 left-1.5 w-6 h-2 bg-cyan-100/90 rounded-[50%_20%_50%_20%] blur-[1px] shadow-[0_0_10px_rgba(165,243,252,0.8)]" />
                        <div className="absolute top-1 right-1.5 w-6 h-2 bg-cyan-100/90 rounded-[20%_50%_20%_50%] blur-[1px] shadow-[0_0_10px_rgba(165,243,252,0.8)]" />
                        {/* 사이드 미러 (위치 조정) */}
                        <div className="absolute top-6 -left-2.5 w-3 h-1.5 bg-blue-800 rounded-l-full border-l border-white/20 transform -rotate-6" />
                        <div className="absolute top-6 -right-2.5 w-3 h-1.5 bg-blue-800 rounded-r-full border-r border-white/20 transform rotate-6" />
                        {/* 후면 등 */}
                        <div className={`absolute bottom-1.5 left-2 w-5 h-1.5 bg-rose-600/80 rounded-sm shadow-[0_0_8px_rgba(225,29,72,0.6)]`} />
                        <div className={`absolute bottom-1.5 right-2 w-5 h-1.5 bg-rose-600/80 rounded-sm shadow-[0_0_8px_rgba(225,29,72,0.6)]`} />
                    </div>
                );
            case 'YELLOW':
                return (
                    <div className={`absolute inset-0 rounded-[10%_10%_30%_30%] border-[2px] shadow-xl transition-all duration-500 ${bodyClass || 'bg-gradient-to-b from-yellow-400 via-yellow-500 to-amber-600 border-amber-800'}`}>
                        {HudDisplay}
                        {/* 중앙 데칼 */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-black/10" />
                        {/* 날렵한 헤드라이트 */}
                        <div className="absolute top-1.5 left-1 w-6 h-2 bg-white/95 rounded-full blur-[0.5px] shadow-[0_0_15px_white] rotate-[15deg]" />
                        <div className="absolute top-1.5 right-1 w-6 h-2 bg-white/95 rounded-full blur-[0.5px] shadow-[0_0_15px_white] rotate-[-15deg]" />
                        {/* 스포일러 보강 */}
                        <div className="absolute -bottom-1 inset-x-1 h-3 bg-slate-900 rounded-t-lg shadow-lg border-t border-white/10" />
                        {/* 후면 등 */}
                        <div className={`absolute bottom-3 left-2 w-6 h-1.5 bg-red-600 rounded-sm shadow-[0_0_10px_red]`} />
                        <div className={`absolute bottom-3 right-2 w-6 h-1.5 bg-red-600 rounded-sm shadow-[0_0_10px_red]`} />
                    </div>
                );
            case 'RED':
            default:
                return (
                    <div className={`absolute inset-0 rounded-[20%_20%_15%_15%] border-[2px] shadow-xl transition-all duration-500 ${bodyClass || 'bg-gradient-to-b from-red-500 via-red-600 to-red-800 border-red-950'}`}>
                        {HudDisplay}
                        {/* 레이싱 스트라이프 */}
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 flex justify-between px-2 opacity-20">
                            <div className="w-2 h-full bg-black" />
                            <div className="w-2 h-full bg-black" />
                        </div>
                        {/* 헤드라이트 */}
                        <div className="absolute top-1 left-1.5 w-5 h-2.5 bg-blue-50/90 rounded-full blur-[0.5px] shadow-[0_0_10px_white]" />
                        <div className="absolute top-1 right-1.5 w-5 h-2.5 bg-blue-50/90 rounded-full blur-[0.5px] shadow-[0_0_10px_white]" />
                        {/* 사이드 미러 */}
                        <div className="absolute top-6 -left-2 w-3 h-1.5 bg-red-900 rounded-l-full" />
                        <div className="absolute top-6 -right-2 w-3 h-1.5 bg-red-900 rounded-r-full" />
                        {/* 후면 등 */}
                        <div className={`absolute bottom-2 left-3 w-4 h-1.5 bg-rose-500 rounded-sm shadow-[0_0_8px_rose]`} />
                        <div className={`absolute bottom-2 right-3 w-4 h-1.5 bg-rose-500 rounded-sm shadow-[0_0_8px_rose]`} />
                    </div>
                );
        }
    };

    return (
        <div className="relative">
            {/* 납작한 스포츠카 비율 적용 (w-[5rem] h-20) / 오토바이는 더 작게 (w-12 h-16) */}
            <div className={`relative ${car.designType === 'MOTORCYCLE' ? 'w-12 h-16' : 'w-[5rem] h-20'} flex flex-col items-center justify-center transition-opacity duration-300 ${car.captured ? 'opacity-40 blur-[0.5px]' : ''}`}>
                {renderCarBody()}

                {/* 니트로 효과 (Nitro VFX) */}
                {car.type === 'NITRO' && car.actionDone && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-10 h-12 bg-blue-500/40 blur-2xl animate-pulse rounded-full z-0" />
                )}
            </div>

        </div>
    );
}, (prev, next) => {
    return prev.car.id === next.car.id &&
        prev.car.y === next.car.y &&
        prev.car.lane === next.car.lane &&
        prev.car.captured === next.car.captured &&
        prev.car.speed === next.car.speed &&
        prev.car.actionDone === next.car.actionDone;
});

export default GameStage;
