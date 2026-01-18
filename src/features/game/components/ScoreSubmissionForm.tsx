import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { scoreService } from '../services/scoreService';

interface ScoreSubmissionFormProps {
    score: number;
    onSubmitted: () => void;
    isNewRecord?: boolean;
}

const ScoreSubmissionForm: React.FC<ScoreSubmissionFormProps> = ({ score, onSubmitted, isNewRecord = false }) => {
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setSubmitting(true);
        setError(null);

        const success = await scoreService.addScore(name, score);

        if (success) {
            onSubmitted();
        } else {
            setError('Failed to submit score. Try again.');
            setSubmitting(false);
        }
    };

    const handleSkip = () => {
        onSubmitted();
    };

    return (
        <div className={`w-full max-w-md rounded-2xl p-4 border mb-4 backdrop-blur-sm ${isNewRecord
                ? 'bg-yellow-500/10 border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.3)]'
                : 'bg-white/5 border-white/10'
            }`}>
            {isNewRecord && (
                <div className="mb-3 p-2 bg-yellow-400/20 border border-yellow-400/40 rounded-xl">
                    <p className="text-yellow-300 text-xs font-black uppercase tracking-widest text-center animate-pulse">
                        🏆 NEW HIGH SCORE! 🏆
                    </p>
                </div>
            )}

            <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 text-center ${isNewRecord ? 'text-yellow-300' : 'text-white/70'
                }`}>
                {isNewRecord ? '명예의 전당에 등록하세요!' : 'Register Your Record'}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isNewRecord ? "이름을 입력하세요 (필수)" : "ENTER CODENAME"}
                        maxLength={20}
                        className={`w-full bg-black/50 border rounded-xl px-3 py-2 text-center text-white font-bold tracking-widest uppercase focus:outline-none transition-all placeholder:text-white/20 text-sm ${isNewRecord
                                ? 'border-yellow-400/50 focus:border-yellow-400 focus:shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                                : 'border-white/20 focus:border-yellow-400 focus:shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                            }`}
                        disabled={submitting}
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-[10px] text-center font-bold">{error}</p>
                )}

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={submitting || !name.trim()}
                        className={`flex-1 py-2 rounded-xl font-black italic text-base transition-all ${submitting || !name.trim()
                            ? 'bg-white/10 text-white/30 cursor-not-allowed'
                            : isNewRecord
                                ? 'bg-yellow-500 text-black shadow-[0_0_25px_rgba(250,204,21,0.5)] hover:bg-yellow-400'
                                : 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-green-400'
                            }`}
                    >
                        {submitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                UPLOADING...
                            </span>
                        ) : 'SUBMIT RECORD'}
                    </motion.button>

                    {!isNewRecord && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleSkip}
                            disabled={submitting}
                            className="px-4 py-2 rounded-xl font-bold text-sm bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
                        >
                            SKIP
                        </motion.button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ScoreSubmissionForm;
