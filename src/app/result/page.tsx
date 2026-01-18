'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ResultContent = () => {
    const searchParams = useSearchParams();
    const score = searchParams.get('score') || '0';
    const phase = searchParams.get('phase') || '1';
    const name = searchParams.get('name') || 'AGENT';
    const date = searchParams.get('date') || new Date().toLocaleDateString();

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gray-900 text-white overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/paparazzi_bg.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 w-full max-w-md"
            >
                {/* Header Decoration */}
                <div className="flex justify-center mb-10">
                    <div className="relative">
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-blue-300 to-blue-600 drop-shadow-2xl">
                            MISSION REPORT
                        </h1>
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                    </div>
                </div>

                {/* Result Card */}
                <div className="bg-black/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    {/* Decorative scanner line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-400/20 animate-scanline-slow" />

                    <div className="flex flex-col gap-6 text-center">
                        <div>
                            <p className="text-blue-300/60 text-xs font-bold tracking-[0.3em] uppercase mb-1">Elite Operator</p>
                            <h2 className="text-3xl font-black text-white italic tracking-wider uppercase">{name}</h2>
                        </div>

                        <div className="py-6 border-y border-white/5">
                            <p className="text-blue-300/60 text-xs font-bold tracking-[0.3em] uppercase mb-2">Final Performance</p>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-6xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                    {Number(score).toLocaleString()}
                                </span>
                                <span className="text-xl font-black text-blue-400 italic">PTS</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Highest Phase</p>
                                <p className="text-2xl font-black text-blue-300">#{phase}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Mission Date</p>
                                <p className="text-sm font-bold text-white/80 mt-1">{date}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col gap-4">
                    <Link href="/" className="w-full">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl font-black text-xl shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-blue-300/30 text-white italic tracking-tighter"
                        >
                            나도 도전하러 가기
                        </motion.button>
                    </Link>

                    <p className="text-white/30 text-[10px] text-center font-mono uppercase tracking-[0.2em]">
                        © 2026 SPEED TRAP PROJECT
                    </p>
                </div>
            </motion.div>

            {/* Camera Decoration */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
};

export default function ResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">LOADING REPORT...</div>}>
            <ResultContent />
        </Suspense>
    );
}
