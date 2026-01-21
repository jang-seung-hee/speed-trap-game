'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/SoundManager';

interface TitleScreenProps {
  onStart: (phase: number) => void;
  onShowHighScores: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onShowHighScores }) => {
  const [maxCleared, setMaxCleared] = useState(1);
  const [selectedPhase, setSelectedPhase] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maxClearedPhase');
      if (saved) {
        const max = parseInt(saved, 10);
        setMaxCleared(max);
        // 기본적으로 가장 높은 스테이지 선택 (원하지 않으면 1로 유지)
        setSelectedPhase(max);
      }
    }
  }, []);

  const handlePhaseSelect = (phaseNum: number) => {
    soundManager.playClick();
    setSelectedPhase(phaseNum);
  };

  const handleShowHighScores = () => {
    soundManager.playClick();
    onShowHighScores();
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden bg-gray-900 text-white">
      {/* BGM 토글 버튼 - 좌하단 */}
      <div className="absolute bottom-6 left-6 z-30">
        <BGMToggleButton />
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/paparazzi_bg.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* 배경 라이트 트레일 효과 (심플 버전) - 투명도 조절 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-full bg-blue-500/10"
            style={{ left: `${20 + i * 15}%` }}
            animate={{
              opacity: [0.05, 0.2, 0.05],
              top: ['-100%', '100%'],
            }}
            transition={{
              duration: 2 + i,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* 메인 타이틀 로고 구역 - 위로 올림 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="z-10 text-center px-4 relative -mt-10"
      >
        {/* Text Backdrop for readability */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-black/60 blur-3xl -z-10 rounded-full" />

        <div className="relative inline-block">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-blue-300 to-blue-600 drop-shadow-[0_5px_8px_rgba(0,0,0,0.9)]">
            특명!
          </h1>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-800 drop-shadow-[0_5px_10px_rgba(0,0,0,0.9)]">
            파파라치!
          </h1>

          {/* 카메라 셔터 데코레이션 이펙트 */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -right-8 -top-8 w-16 h-16 border-4 border-blue-400 rounded-full flex items-center justify-center opacity-50"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse" />
          </motion.div>
        </div>

        <p className="mt-6 text-blue-200/80 font-medium tracking-widest uppercase text-sm">
          Speed Trap Special Mission
        </p>

        {/* URL Copy Badge - 크기 키움 */}
        <motion.div
          className="mt-4 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <URLCopyBadge />
        </motion.div>
      </motion.div>

      {/* 스테이지 선택 UI */}
      {maxCleared > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 z-10 flex flex-col items-center gap-4"
        >
          <span className="text-blue-300/60 text-xs font-bold tracking-widest uppercase">Select Starting Phase</span>
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {Array.from({ length: maxCleared }, (_, i) => i + 1).map(phaseNum => (
              <button
                key={phaseNum}
                onClick={() => handlePhaseSelect(phaseNum)}
                className={`w-9 h-9 rounded-md font-black text-sm italic transition-all border ${selectedPhase === phaseNum
                  ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-105'
                  : 'bg-black/40 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/30'
                  }`}
              >
                {phaseNum}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* 버튼 그룹 */}
      <div className="mt-8 z-20 flex flex-col gap-4 items-center w-full max-w-md px-6">
        {/* START 버튼 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStart(selectedPhase)}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl font-black text-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-blue-300/30 hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] transition-all text-white italic tracking-tighter"
        >
          START MISSION {maxCleared > 1 ? `#${selectedPhase}` : ''}
        </motion.button>

        {/* HIGH SCORE 버튼 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShowHighScores}
          className="w-full py-3 bg-white/10 text-blue-100 rounded-xl font-bold text-lg border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
        >
          <span className="text-yellow-400 text-xl">🏆</span>
          <span className="tracking-widest">HALL OF FAME</span>
        </motion.button>
      </div>

      {/* 데스크탑 전용: 프레임 외부 하단 푸터 */}
      <div className="hidden md:block absolute bottom-8 z-20 text-gray-500 text-sm font-mono">
        © 2026 SPEED TRAP PROJECT
      </div>
    </div>
  );
};

// URL 복사 뱃지 컴포넌트
const URLCopyBadge: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = window.location.origin;

    // Fallback for non-secure contexts (IP access)
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        finishCopy();
      }).catch(() => {
        fallbackCopy(url);
      });
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      finishCopy();
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const finishCopy = () => {
    soundManager.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`group flex items-center gap-3 px-5 py-2 border rounded-full transition-all backdrop-blur-md shadow-lg ${copied ? 'bg-green-500/20 border-green-400/50' : 'bg-white/5 border-white/10 hover:bg-white/10'
        }`}
    >
      <span className={`text-xs font-mono tracking-wider transition-colors ${copied ? 'text-green-400' : 'text-blue-300'
        }`}>
        {copied ? 'COPIED!' : (typeof window !== 'undefined' ? window.location.hostname : '')}
      </span>
      <div className={`w-4 h-4 transition-colors ${copied ? 'text-green-400' : 'text-blue-400 group-hover:text-blue-300'
        }`}>
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        )}
      </div>
    </button>
  );
};

// BGM 토글 버튼 컴포넌트
const BGMToggleButton: React.FC = () => {
  const [isBGMOn, setIsBGMOn] = useState(false);

  useEffect(() => {
    setIsBGMOn(soundManager.isBGMPlaying());
  }, []);

  const handleToggle = () => {
    soundManager.playClick();
    const newState = soundManager.toggleBGM();
    setIsBGMOn(newState);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all backdrop-blur-md border ${isBGMOn
        ? 'bg-blue-500/20 border-blue-400/30 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
        : 'bg-black/40 border-white/10 text-white/40 hover:text-white/60'
        }`}
    >
      <span className="text-xl">
        {isBGMOn ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        )}
      </span>
    </motion.button>
  );
};

export default TitleScreen;
