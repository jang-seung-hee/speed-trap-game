import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { scoreService } from '../services/scoreService';

interface ScoreSubmissionFormProps {
    score: number;
    onSubmitted: () => void;
}

const ScoreSubmissionForm: React.FC<ScoreSubmissionFormProps> = ({ score, onSubmitted }) => {
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

    return (
        <div className="w-full max-w-md bg-white/5 rounded-2xl p-4 border border-white/10 mb-4 backdrop-blur-sm">
            <h3 className="text-xs font-bold text-white/70 uppercase tracking-widest mb-2 text-center">
                Register Your Record
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ENTER CODENAME"
                        maxLength={20}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-center text-white font-bold tracking-widest uppercase focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all placeholder:text-white/20 text-sm"
                        disabled={submitting}
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-[10px] text-center font-bold">{error}</p>
                )}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting || !name.trim()}
                    className={`w-full py-2 rounded-xl font-black italic text-base transition-all ${submitting || !name.trim()
                        ? 'bg-white/10 text-white/30 cursor-not-allowed'
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
            </form>
        </div>
    );
};

export default ScoreSubmissionForm;
