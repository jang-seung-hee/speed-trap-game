'use client';

import React, { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { soundManager } from '../utils/SoundManager';
import { GameHUD } from './GameHUD';
import { MissionBriefing } from './MissionBriefing';
import { PauseOverlay } from './PauseOverlay';
import { ComboDisplay } from './ComboDisplay';
import { GameBGMToggle } from './GameBGMToggle';
import { useGameEngine } from '../hooks/useGameEngine';
import { useComboRewards } from '../hooks/useComboRewards';
import { ComboRewardButton } from './ComboRewardButton';

// New Components
import { GameScene } from './GameScene';
import { GameControls } from './GameControls';
import { CustomCursor } from './CustomCursor';
import { GameMessage } from './GameMessage';

import { CustomGameSettings } from '../utils/stageDesignerStorage';

interface GameStageProps {
    onGameOver: (score: number) => void;
    onBackToTitle: () => void;
    initialPhase?: number;
    devMode?: boolean;              // 개발 튜닝 모드 (무한 체력)
    customSettings?: CustomGameSettings;  // 커스텀 설정
    forcePhase?: number;            // 강제로 특정 스테이지 실행
}

const GameStage: React.FC<GameStageProps> = ({
    onGameOver,
    onBackToTitle,
    initialPhase = 1,
    devMode = false,
    customSettings,
    forcePhase
}) => {
    const {
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
        // Modifiers
        zoneModifier,
        // Settings
        settings,
        // Actions
        capture,
        setIsPaused,
        startPhaseAction,
        applyReward,
    } = useGameEngine({
        onGameOver: devMode ? () => { } : onGameOver,  // 개발 모드에서는 게임 오버 무시
        initialPhase: forcePhase || initialPhase,
        devMode,
        customSettings
    });

    const { availableReward, claimReward } = useComboRewards({ combo });

    const cursorRef = useRef<HTMLDivElement>(null);
    const [isPointerInside, setIsPointerInside] = useState(false);

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isPointerInside) setIsPointerInside(true);

        if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        }
    };

    // 현재 페이즈 설정 가져오기
    const currentPhaseConfig = settings.PHASES[phase] || settings.PHASES[1];

    return (
        <div
            className="relative w-full h-full flex flex-col items-center bg-black overflow-hidden cursor-none"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setIsPointerInside(false)}
        >
            {/* Background */}
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
            <GameHUD hp={hp} maxHp={maxHp} score={score} comboScore={comboScore} phase={phase} shield={shield} />

            {/* Main Game Scene */}
            <GameScene
                cars={cars}
                phase={phase}
                onCapture={capture}
                zoneModifier={zoneModifier}
                zoneHeight={currentPhaseConfig.zoneHeight}
                lanes={settings.LANES}
                zoneBottomFixed={settings.ZONE_BOTTOM_FIXED}
            />

            {/* VFX: Messages */}
            <GameMessage message={message} />

            {/* Stage Transition Overlay */}
            <AnimatePresence>
                {isTransitioning && (
                    <MissionBriefing
                        phase={phase}
                        prevStageResult={prevStageResult}
                        countdown={countdown}
                        onStartPhase={startPhaseAction}
                    />
                )}
            </AnimatePresence>

            {/* Custom Mouse Cursor */}
            <CustomCursor
                isVisible={isPointerInside}
                cursorRef={cursorRef}
            />

            {/* Combo Monitor */}
            <ComboDisplay combo={combo} comboScore={comboScore} />

            {/* Combo Reward Button */}
            <ComboRewardButton
                availableReward={availableReward}
                onClaim={() => claimReward(applyReward)}
            />

            {/* BGM Toggle */}
            <div className="absolute bottom-4 left-4 z-50">
                <GameBGMToggle />
            </div>

            {/* Helper Controls (Back, Pause) */}
            <GameControls
                onBackToTitle={onBackToTitle}
                isPaused={isPaused}
                onTogglePause={() => setIsPaused(!isPaused)}
            />

            {/* Pause Overlay */}
            <AnimatePresence>
                <PauseOverlay isPaused={isPaused} onResume={() => setIsPaused(false)} />
            </AnimatePresence>
        </div>
    );
};

export default GameStage;
