import React from 'react';

interface ComboDisplayProps {
    combo: number;
    comboScore: number;
}

/** 콤보 표시 - 경량화 버전 (CSS 최적화) */
export const ComboDisplay: React.FC<ComboDisplayProps> = React.memo(({ combo, comboScore }) => {
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
