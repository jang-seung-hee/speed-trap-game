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
                className="text-5xl font-black italic tracking-tight px-8 py-4 rounded-xl"
                style={{
                    color: message.color,
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    border: `3px solid ${message.color}`,
                    textShadow: `0 0 20px ${message.color}, 0 0 40px ${message.color}, 2px 2px 4px rgba(0,0,0,0.8)`,
                    boxShadow: `0 0 30px ${message.color}`,
                    whiteSpace: 'nowrap',
                    maxWidth: '90vw',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >
                {message.text}
            </div>
        </div>
    );
};
