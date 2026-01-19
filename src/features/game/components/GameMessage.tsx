import React from 'react';

interface GameMessageProps {
    message: { text: string; color: string } | null;
}

export const GameMessage: React.FC<GameMessageProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div
                key={message.text}
                className="text-6xl font-black italic tracking-tighter drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-game-message"
                style={{ color: message.color }}
            >
                {message.text}
            </div>
        </div>
    );
};
