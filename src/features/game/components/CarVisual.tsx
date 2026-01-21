import React, { useMemo } from 'react';
import { GAME_SETTINGS } from '../constants';
import { Car } from '../types';

interface CarVisualProps {
    car: Car;
    searchlightActive?: boolean;
}

export const CarVisual: React.FC<CarVisualProps> = React.memo(({ car, searchlightActive = false }) => {
    // 서치라이트 효과 활성화 시 모든 속도계기판이 처음부터 표시됨
    // 그렇지 않으면 단속 구역 근처에서만 표시
    const isNearZone = useMemo(() => car.y > GAME_SETTINGS.ZONE_BOTTOM_FIXED - 40, [car.y]);
    const showDetail = useMemo(() => searchlightActive || isNearZone || car.captured, [searchlightActive, isNearZone, car.captured]);

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
            case 'POLICE':
                return (
                    <div className="absolute inset-0">
                        {/* Siren Light Effect */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-600/30 rounded-full blur-xl animate-pulse" />

                        {/* Body Shadow */}
                        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[75%] h-[75%] bg-black/60 blur-sm rounded-full transform scale-x-110" />

                        {/* Black & White Body */}
                        <div className={`absolute top-[10%] left-1/2 -translate-x-1/2 w-[70%] h-[80%] bg-slate-900 rounded-lg shadow-[inset_0_2px_5px_rgba(255,255,255,0.4),0_5px_10px_rgba(0,0,0,0.5)] border-b-4 border-slate-950 overflow-hidden`}>
                            {/* White Doors/Side accents (top down view so sides) */}
                            <div className="absolute top-0 left-0 w-full h-full bg-slate-900">
                                {/* Center White Stripe Area for Roof */}
                                <div className="absolute top-0 left-[20%] right-[20%] h-full bg-slate-100" />
                            </div>

                            {/* Cabin Glass */}
                            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[85%] h-[25%] bg-sky-900 rounded-sm z-10" />

                            {/* Police Text on Roof */}
                            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 z-10">
                                <span className="text-[6px] font-black tracking-widest text-slate-900">POLICE</span>
                            </div>
                        </div>

                        {/* Siren Bar */}
                        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[50%] h-1.5 bg-slate-800 rounded-full z-20 flex justify-between px-0.5">
                            <div className="w-[45%] h-full bg-red-600 rounded-l-full animate-pulse shadow-[0_0_8px_red]" />
                            <div className="w-[45%] h-full bg-blue-600 rounded-r-full animate-pulse shadow-[0_0_8px_blue]" />
                        </div>
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
