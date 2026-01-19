import React from 'react';
import { soundManager } from '../utils/SoundManager';

interface GameControlsProps {
    onBackToTitle: () => void;
    isPaused: boolean;
    onTogglePause: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ onBackToTitle, isPaused, onTogglePause }) => {
    return (
        <>
            {/* Return to Main */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
                <button
                    onClick={() => {
                        soundManager.playClick();
                        if (window.confirm("경기를 포기하고 메인 화면으로 돌아가시겠습니까?")) {
                            onBackToTitle();
                        }
                    }}
                    className="px-3 py-1 bg-black/40 border border-white/10 rounded-full text-[9px] font-bold text-white/20 hover:text-white/60 hover:bg-white/5 transition-all backdrop-blur-sm uppercase tracking-tight italic"
                >
                    Return to Main
                </button>
            </div>

            {/* Pause Button */}
            <div className="absolute bottom-4 right-4 z-50">
                <button
                    onClick={() => {
                        soundManager.playClick();
                        onTogglePause();
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all backdrop-blur-md border ${isPaused
                        ? 'bg-yellow-400 border-yellow-300 text-black shadow-[0_0_20px_rgba(234,179,8,0.5)]'
                        : 'bg-black/40 border-white/20 text-white/60 hover:text-white hover:border-white/40'
                        }`}
                >
                    {isPaused ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    )}
                </button>
            </div>
        </>
    );
};
