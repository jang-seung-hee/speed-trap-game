import React from 'react';

interface GameMessageProps {
    message: { text: string; color: string } | null;
}

export const GameMessage: React.FC<GameMessageProps> = ({ message }) => {
    if (!message) return null;

    const words = message.text.split(' ');

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100]">
            <div
                key={message.text}
                className="flex flex-col items-center justify-center animate-bounce-short"
            >
                {words.map((word, index) => (
                    <div
                        key={index}
                        className="text-6xl font-black italic tracking-tighter leading-tight text-center"
                        style={{
                            color: message.color,
                            textShadow: '3px 3px 4px rgba(0, 0, 0, 0.6)',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {word}
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes bounce-short {
                    0% { transform: scale(0.5); opacity: 0; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1.0); opacity: 1; }
                }
                .animate-bounce-short {
                    animation: bounce-short 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
            `}</style>
        </div>
    );
};
