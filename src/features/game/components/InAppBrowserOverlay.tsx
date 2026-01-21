'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInAppBrowser } from '../hooks/useInAppBrowser';

export const InAppBrowserOverlay = () => {
    const { isInApp, osType } = useInAppBrowser();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 인앱 브라우저일 때만 표시
        if (isInApp) {
            setIsVisible(true);
        }
    }, [isInApp]);

    const handleAndroidOpen = () => {
        if (typeof window === 'undefined') return;

        // 현재 페이지 URL
        const currentUrl = window.location.href.replace(/https?:\/\//i, '');

        // Android Intent 스킴 생성
        // Chrome으로 강제로 열거나, 기본 브라우저 선택창을 띄움
        const intentUrl = `intent://${currentUrl}#Intent;scheme=https;package=com.android.chrome;end`;

        window.location.href = intentUrl;
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-gray-900 flex flex-col items-center justify-center p-6 text-white text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-sm w-full bg-gray-800 rounded-2xl p-8 border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.3)]"
            >
                <div className="text-5xl mb-6">🚀</div>

                <h2 className="text-2xl font-black text-blue-400 mb-4 break-keep">
                    더 쾌적한 환경에서<br />플레이하세요!
                </h2>

                <p className="text-gray-300 mb-8 leading-relaxed text-sm break-keep">
                    현재 브라우저에서는 게임 성능이 저하되거나<br />
                    화면이 잘릴 수 있습니다.<br />
                    <strong>외부 브라우저</strong>로 접속해주세요.
                </p>

                {osType === 'ANDROID' ? (
                    <button
                        onClick={handleAndroidOpen}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 animate-pulse hover:animate-none active:scale-95 transition-transform"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Chrome으로 열기
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl text-left text-sm">
                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full font-bold">1</span>
                            <span>화면 하단의 <span className="inline-block px-1.5 py-0.5 bg-gray-700 rounded text-xs mx-1">⋯</span> (더보기) 클릭</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl text-left text-sm">
                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full font-bold">2</span>
                            <span><span className="inline-block px-1.5 py-0.5 bg-gray-700 rounded text-xs mx-1 border border-white/20">Safari로 열기</span> 선택</span>
                        </div>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-blue-400 font-bold mt-4"
                        >
                            👇 아래 메뉴를 확인하세요
                        </motion.div>
                    </div>
                )}

                <button
                    onClick={() => setIsVisible(false)}
                    className="mt-6 text-xs text-gray-500 underline hover:text-gray-400"
                >
                    그냥 여기서 할게요 (권장하지 않음)
                </button>
            </motion.div>
        </div>
    );
};
