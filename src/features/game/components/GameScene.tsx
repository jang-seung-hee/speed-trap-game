import React from 'react';
import { GAME_SETTINGS } from '../constants';
import { Car } from '../types';
import { CarVisual } from './CarVisual';

interface GameSceneProps {
    cars: Car[];
    phase: number;
    onCapture: (lane: number) => void;
    zoneModifier: number;
    zoneHeight: number;  // 커스텀 설정에서 전달받은 zoneHeight
    lanes: number;       // 커스텀 설정에서 전달받은 lanes
    zoneBottomFixed: number;  // 커스텀 설정에서 전달받은 zoneBottomFixed
    searchlightActive?: boolean; // 서치라이트 효과 활성화 여부
}

export const GameScene: React.FC<GameSceneProps> = ({
    cars,
    phase,
    onCapture,
    zoneModifier,
    zoneHeight: baseZoneHeight,
    lanes,
    zoneBottomFixed,
    searchlightActive = false
}) => {
    const zoneHeight = baseZoneHeight + zoneModifier;
    const zoneTop = zoneBottomFixed - zoneHeight;

    return (
        <div className="relative w-full max-w-md h-full overflow-hidden flex [container-type:size] shadow-2xl">
            {/* Road Grid */}
            <div className="absolute inset-x-0 inset-y-0 flex z-30">
                {Array.from({ length: lanes }).map((_, lane) => (
                    <div
                        key={lane}
                        className={`h-full flex-1 relative ${lane < lanes - 1 ? 'border-r-2 border-dashed border-white/40' : ''}`}
                        onPointerDown={(e) => {
                            e.preventDefault();
                            onCapture(lane);
                        }}
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
            {cars.map(car => (
                <div
                    key={car.id}
                    className="absolute z-20 pointer-events-none"
                    style={{
                        top: `${car.y}cqh`,
                        left: `${car.lane * (100 / lanes) + (100 / lanes / 2)}cqw`,
                        transform: 'translate(-50%, -50%)',
                        transition: 'left 0.15s cubic-bezier(0.4, 0.0, 0.2, 1)',
                        willChange: 'left'
                    }}
                >
                    <CarVisual car={car} searchlightActive={searchlightActive} />
                </div>
            ))}
        </div>
    );
};
