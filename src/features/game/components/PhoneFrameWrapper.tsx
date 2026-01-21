import React from 'react';

interface PhoneFrameWrapperProps {
    children: React.ReactNode;
}

export const PhoneFrameWrapper: React.FC<PhoneFrameWrapperProps> = ({ children }) => {
    return (
        <div className="w-full h-screen overflow-hidden bg-gray-900 flex items-center justify-center relative">
            {/* 데스크탑 배경 레이어 */}
            <div className="hidden md:block absolute inset-0 z-0">
                <img
                    src="/paparazzi_bg.png"
                    alt="Background"
                    className="w-full h-full object-cover blur-sm opacity-50 scale-105"
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* 게임 컨테이너
                모바일: 전체 화면, 테두리 없음
                데스크탑 (md+): 고정 비율 휴대폰 프레임
            */}
            <div className={`
                w-full h-full
                md:w-[480px] md:h-[85vh] md:max-h-[900px] 
                md:bg-black md:rounded-[2.5rem] md:overflow-hidden 
                md:relative md:z-10 md:shadow-[0_0_50px_rgba(0,0,0,0.5)] 
                md:border-[8px] md:border-gray-800
                ring-1 ring-white/10
            `}>
                {children}
            </div>

            {/* 데스크탑 전용: 프레임 외부 하단 푸터 */}
            <div className="hidden md:block absolute bottom-8 right-8 text-white/20 text-sm font-mono z-0">
                SPEED TRAP PROJECT 2026
            </div>

            {/* 개발 모드 진입 버튼 (PC 전용, 프레임 외부 우측) */}
            <div className="hidden md:block absolute bottom-1/2 translate-y-1/2 -right-4 translate-x-full md:right-12 md:translate-x-0 md:translate-y-0 md:bottom-20 z-50">
                <button
                    onClick={() => window.location.search = '?dev=true'}
                    className="group flex items-center gap-2 px-5 py-3 bg-indigo-600/90 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:bg-indigo-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all backdrop-blur-md border border-indigo-400/30"
                >
                    <span className="text-lg group-hover:rotate-90 transition-transform duration-300">⚙️</span>
                    DEV STUDIO
                </button>
            </div>
        </div>
    );
};
