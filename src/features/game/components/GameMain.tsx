'use client';

import React, { useState, useCallback, useEffect } from 'react';
import TitleScreen from './TitleScreen';
import GameStage from './GameStage';
import HighScoreBoard from './HighScoreBoard';
import ScoreSubmissionForm from './ScoreSubmissionForm';

import { soundManager } from '../utils/SoundManager';
import { scoreService } from '../services/scoreService';
import ShareResultButton from './ShareResultButton';

type GameState = 'TITLE' | 'PLAYING' | 'GAMEOVER' | 'HIGHSCORE';

const GameMain: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('TITLE');
    const [finalScore, setFinalScore] = useState(0);
    const [startPhase, setStartPhase] = useState(1);
    const [mounted, setMounted] = useState(false);
    const [isScoreSubmitted, setIsScoreSubmitted] = useState(false);
    const [isNewRecord, setIsNewRecord] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const containerRef = React.useRef<HTMLElement>(null);

    // 하이드레이션 오류 방지를 위한 마운트 체크
    useEffect(() => {
        setMounted(true);
    }, []);

    const requestFullscreen = useCallback(() => {
        if (!containerRef.current) return;

        const element = containerRef.current;
        const requestMethod =
            element.requestFullscreen ||
            (element as any).webkitRequestFullscreen ||
            (element as any).mozRequestFullScreen ||
            (element as any).msRequestFullscreen;

        if (requestMethod) {
            const promise = requestMethod.call(element);
            if (promise && promise.then) {
                promise.then(() => {
                    if (screen.orientation && (screen.orientation as any).lock) {
                        (screen.orientation as any).lock('portrait').catch((err: any) => {
                            console.warn('Orientation lock failed:', err);
                        });
                    }
                }).catch((err: any) => {
                    console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            }
        }
    }, []);

    const startGame = useCallback((phase: number = 1) => {
        requestFullscreen(); // 전체화면 요청
        setStartPhase(phase);
        setGameState('PLAYING');
        setFinalScore(0);
        setIsScoreSubmitted(false);
        setPlayerName('');
    }, [requestFullscreen]);

    const endGame = useCallback(async (score: number) => {
        setFinalScore(score);
        setGameState('GAMEOVER');

        // 신기록 여부 확인
        const topScores = await scoreService.getTopScores(5);
        const isNewHighScore = topScores.length < 5 || score > (topScores[topScores.length - 1]?.score || 0);
        setIsNewRecord(isNewHighScore);
    }, []);

    const goToTitle = useCallback(() => {
        soundManager.playClick();
        setGameState('TITLE');
    }, []);

    const showHighScores = useCallback(() => {
        setGameState('HIGHSCORE');
    }, []);

    if (!mounted) return <div className="w-full h-screen bg-black" />;

    return (
        <main ref={containerRef as any} className="relative w-full h-full bg-black overflow-hidden font-sans">
            {gameState === 'TITLE' && (
                <TitleScreen onStart={startGame} onShowHighScores={showHighScores} />
            )}

            {gameState === 'PLAYING' && (
                <GameStage onGameOver={endGame} onBackToTitle={goToTitle} initialPhase={startPhase} />
            )}

            {gameState === 'GAMEOVER' && (
                <div className="relative flex flex-col items-center h-full text-white bg-gray-900 z-50 p-6 text-center overflow-y-auto custom-scrollbar">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/mission_failed_bg.png"
                            alt="Mission Failed Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
                    </div>

                    <div className="relative z-10 w-full flex flex-col items-center justify-start py-4 min-h-full">
                        <div className="w-full max-w-md mt-4">
                            <MotionDivPlaceholder>
                                <div className="relative inline-block mb-2 mt-4">
                                    {/* Dark smoke/shadow effect for readability */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[200%] bg-black/80 blur-2xl -z-10 rounded-full" />

                                    <h2 className="relative z-10 text-4xl md:text-6xl font-black text-red-600 italic tracking-tighter drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
                                        MISSION FAILED
                                    </h2>
                                </div>
                                <div className="w-24 h-1 bg-red-600 mx-auto mb-6 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />

                                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md w-full shadow-lg">
                                    <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-1">Final Performance</p>
                                    <p className="text-5xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                        {finalScore.toLocaleString()}
                                    </p>
                                </div>

                                {/* High Score Submission & Board */}
                                <div className="w-full flex flex-col items-center mb-8">
                                    {!isScoreSubmitted ? (
                                        <ScoreSubmissionForm
                                            score={finalScore}
                                            onSubmitted={(name) => {
                                                setIsScoreSubmitted(true);
                                                setPlayerName(name);
                                            }}
                                            isNewRecord={isNewRecord}
                                        />
                                    ) : (
                                        <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl mb-6 w-full">
                                            <p className="text-green-400 font-bold italic">RECORD UPLOADED SUCCESSFULLY</p>
                                        </div>
                                    )}

                                    {/* Share Button 추가 */}
                                    <div className="w-full mb-6">
                                        <ShareResultButton
                                            score={finalScore}
                                            phase={startPhase}
                                            name={playerName}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col w-full gap-3 mb-10">
                                    <button
                                        onClick={() => startGame(startPhase)}
                                        className="w-full px-10 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                    >
                                        RETRY MISSION
                                    </button>

                                    <button
                                        onClick={showHighScores}
                                        className="w-full px-10 py-4 bg-blue-600/20 text-blue-400 font-bold rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-all backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                    >
                                        VIEW HALL OF FAME
                                    </button>

                                    <button
                                        onClick={goToTitle}
                                        className="w-full px-10 py-4 bg-black/40 text-gray-400 font-bold rounded-xl border border-white/10 hover:bg-white/5 transition-all backdrop-blur-sm"
                                    >
                                        RETURN TO BASE
                                    </button>
                                </div>
                            </MotionDivPlaceholder>
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'HIGHSCORE' && (
                <div className="relative flex flex-col items-center justify-center h-full text-white bg-gray-900 z-50 p-6 text-center overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/hall_of_fame_bg.png"
                            alt="Hall of Fame Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
                    </div>

                    <div className="relative z-10 w-full flex flex-col items-center justify-start overflow-y-auto custom-scrollbar min-h-full py-4">
                        <div className="w-full max-w-4xl mt-4">
                            <MotionDivPlaceholder>
                                <div className="relative inline-block mb-6">
                                    {/* Dark smoke/shadow effect for readability */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[200%] bg-black/80 blur-2xl -z-10 rounded-full" />

                                    <h2 className="relative z-10 text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 italic tracking-tighter drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
                                        HALL OF FAME
                                    </h2>
                                </div>

                                <div className="w-full flex justify-center mb-8">
                                    <HighScoreBoard variant="full" />
                                </div>

                                <button
                                    onClick={goToTitle}
                                    className="px-12 py-3 bg-black/40 text-blue-100 font-bold rounded-xl border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all backdrop-blur-sm"
                                >
                                    RETURN TO BASE
                                </button>
                            </MotionDivPlaceholder>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

// React 컴포넌트는 반드시 대문자로 시작해야 합니다.
const MotionDivPlaceholder = ({ children }: { children: React.ReactNode }) => (
    <div className="animate-in fade-in zoom-in duration-500">
        {children}
    </div>
);

export default GameMain;
