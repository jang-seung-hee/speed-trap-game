'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/SoundManager';

interface ShareResultButtonProps {
    score: number;
    phase: number;
    name: string;
}

const ShareResultButton: React.FC<ShareResultButtonProps> = ({ score, phase, name }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        soundManager.playClick();

        // 결과 페이지 URL 생성
        const baseUrl = window.location.origin;
        const date = new Date().toLocaleDateString();
        const params = new URLSearchParams({
            score: score.toString(),
            phase: phase.toString(),
            name: name || 'AGENT',
            date: date
        });

        const shareUrl = `${baseUrl}/result?${params.toString()}`;

        // Web Share API 시도
        if (navigator.share) {
            try {
                await navigator.share({
                    title: '특명! 파파라치! 미션 기록',
                    text: `${name} 요원의 미션 보고서: ${score.toLocaleString()}점 달성! 지금 바로 도전해보세요!`,
                    url: shareUrl,
                });
                return;
            } catch (err) {
                console.warn('Share failed', err);
            }
        }

        // Fallback: 클립보드 복사
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = shareUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all border ${copied
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : 'bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                }`}
        >
            {copied ? (
                <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    RESULT URL COPIED!
                </>
            ) : (
                <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    SHARE MISSION REPORT
                </>
            )}
        </motion.button>
    );
};

export default ShareResultButton;
