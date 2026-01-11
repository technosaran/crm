"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
    active: boolean;
    onComplete?: () => void;
}

export function Confetti({ active, onComplete }: ConfettiProps) {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        if (active) {
            const newParticles = Array.from({ length: 50 }).map((_, i) => ({
                id: i,
                x: Math.random() * 100, // percentage
                y: -10,
                size: Math.random() * 10 + 5,
                color: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'][Math.floor(Math.random() * 6)],
                delay: Math.random() * 0.5,
                duration: Math.random() * 2 + 1,
                rotation: Math.random() * 360,
            }));
            setParticles(newParticles);

            const timer = setTimeout(() => {
                setParticles([]);
                onComplete?.();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [active, onComplete]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden">
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{
                            top: '-10%',
                            left: `${p.x}%`,
                            opacity: 1,
                            rotate: 0
                        }}
                        animate={{
                            top: '110%',
                            left: `${p.x + (Math.random() * 20 - 10)}%`,
                            opacity: 0,
                            rotate: p.rotation + 720
                        }}
                        transition={{
                            duration: p.duration,
                            delay: p.delay,
                            ease: "easeIn"
                        }}
                        style={{
                            position: 'absolute',
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
