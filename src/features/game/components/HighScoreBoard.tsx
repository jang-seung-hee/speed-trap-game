import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { scoreService, type HighScore } from '../services/scoreService';

interface HighScoreBoardProps {
    currentScore?: number;
    variant?: 'default' | 'full';
}

const HighScoreBoard: React.FC<HighScoreBoardProps> = ({ currentScore, variant = 'default' }) => {
    const [scores, setScores] = useState<HighScore[]>([]);
    const [loading, setLoading] = useState(true);
    const isFull = variant === 'full';

    useEffect(() => {
        const fetchScores = async () => {
            try {
                // 전체 화면이면 10개, 아니면 5개
                const limitCount = isFull ? 10 : 5;
                const data = await scoreService.getTopScores(limitCount);
                setScores(data);
            } catch (error) {
                console.error("Failed to load scores", error);
            } finally {
                setLoading(false);
            }
        };
        fetchScores();
    }, [currentScore, isFull]); // Refresh if settings change

    // Helper to format date
    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        // Handle Firestore Timestamp or standard Date
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('ko-KR', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className={`w-full bg-black/40 backdrop-blur-md border border-white/10 overflow-hidden transition-all ${isFull ? 'max-w-2xl rounded-3xl p-5 md:p-6' : 'max-w-md rounded-xl p-4'
            }`}>
            <div className={`flex items-center justify-between ${isFull ? 'mb-5' : 'mb-3'}`}>
                <h3 className={`${isFull ? 'text-3xl md:text-4xl' : 'text-sm'} font-black text-white italic tracking-widest uppercase`}>
                    Elite Drivers
                </h3>
                <div className="flex items-center space-x-2">
                    <span className={`${isFull ? 'w-3 h-3' : 'w-1.5 h-1.5'} bg-green-500 rounded-full animate-pulse`} />
                    <span className={`${isFull ? 'text-sm' : 'text-[10px]'} text-green-500 font-bold uppercase tracking-widest`}>Live</span>
                </div>
            </div>

            {loading ? (
                <div className={`flex justify-center ${isFull ? 'py-20' : 'py-4'}`}>
                    <div className={`animate-spin border-yellow-400 border-t-transparent rounded-full ${isFull ? 'h-12 w-12 border-4' : 'h-6 w-6 border-2'
                        }`} />
                </div>
            ) : (
                <div className={isFull ? 'space-y-2' : 'space-y-1.5'}>
                    {scores.length === 0 ? (
                        <p className={`text-center text-white/30 ${isFull ? 'text-lg py-10' : 'text-xs py-2'}`}>No records yet.</p>
                    ) : (
                        scores.map((record, index) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={record.id || index}
                                className={`flex items-center justify-between transition-all ${isFull ? 'p-2.5 px-4 rounded-xl' : 'p-2 rounded'
                                    } ${index === 0 ? 'bg-yellow-400/20 border border-yellow-400/50' :
                                        index === 1 ? 'bg-white/10 border border-white/20' :
                                            index === 2 ? 'bg-orange-500/10 border border-orange-500/30' :
                                                'bg-white/5 border border-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-4 flex-1 overflow-hidden">
                                    <span className={`font-black italic text-left ${isFull ? 'text-2xl w-8' : 'text-sm w-4'
                                        } ${index === 0 ? 'text-yellow-400' :
                                            index === 1 ? 'text-gray-300' :
                                                index === 2 ? 'text-orange-400' :
                                                    'text-white/30'
                                        }`}>
                                        {index + 1}
                                    </span>
                                    <div className="flex flex-col text-left min-w-0">
                                        <span className={`${isFull ? 'text-lg md:text-xl' : 'text-xs'
                                            } font-bold text-white uppercase tracking-wider truncate`}>
                                            {record.name}
                                        </span>
                                        <span className={`${isFull ? 'text-xs mt-0.5' : 'text-[9px]'
                                            } text-white/30 leading-none`}>
                                            {formatDate(record.date)}
                                        </span>
                                    </div>
                                </div>
                                <div className={`${isFull ? 'text-xl md:text-2xl ml-4' : 'text-sm ml-2'} font-black italic text-right shrink-0`}>
                                    <span className="text-white">{record.score.toLocaleString()}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default HighScoreBoard;
