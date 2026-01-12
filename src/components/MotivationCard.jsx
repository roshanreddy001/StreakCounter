import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { RefreshCw, Sparkles } from 'lucide-react';
import { getMotivation } from '../services/gemini';
import { useTasks } from '../context/TaskContext';
import { motion } from 'framer-motion';
import './MotivationCard.css';

export default function MotivationCard() {
    const { tasks } = useTasks();
    // Calculate max streak among all tasks
    const maxStreak = tasks.reduce((acc, task) => Math.max(acc, task.streak || 0), 0);

    // Derived 'streak' object to match previous usage structure or just pass count
    const streak = { count: maxStreak };

    const [targetQuote, setTargetQuote] = useState("Loading your daily vibe...");
    const [displayQuote, setDisplayQuote] = useState("");
    const [loading, setLoading] = useState(false);

    // Typing animation state
    const typingIndexRef = useRef(0);
    const typingTimeoutRef = useRef(null);

    const fetchMotivation = async () => {
        setLoading(true);
        // Reset typing state for new quote
        setDisplayQuote("");
        typingIndexRef.current = 0;

        try {
            // Check if we have completed tasks today
            const completedCount = 0; // Simplified for now
            const text = await getMotivation(streak.count, completedCount);
            setTargetQuote(text);
        } catch (error) {
            setTargetQuote("Keep going! Consistency is key. ✨");
        } finally {
            setLoading(false);
        }
    };

    // Auto-refresh every 15 seconds
    useEffect(() => {
        fetchMotivation(); // Initial fetch

        const intervalId = setInterval(() => {
            fetchMotivation();
        }, 15000);

        return () => clearInterval(intervalId);
    }, [streak.count]); // Rerun if streak changes, but mostly for the interval

    // Typing effect logic
    useEffect(() => {
        // Clear any existing timeout when targetQuote changes
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        const typeChar = () => {
            const currentIdx = typingIndexRef.current;

            if (currentIdx < targetQuote.length) {
                setDisplayQuote(targetQuote.substring(0, currentIdx + 1));
                typingIndexRef.current += 1;

                // Randomize typing speed slightly for natural feel (30-80ms)
                const delay = 30 + Math.random() * 50;
                typingTimeoutRef.current = setTimeout(typeChar, delay);
            }
        };

        // Start typing
        typeChar();

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [targetQuote]);

    return (
        <Card className="motivation-card">
            <button
                onClick={fetchMotivation}
                className="refresh-btn"
                disabled={loading}
            >
                <RefreshCw size={18} className={loading ? "spin" : ""} />
            </button>

            <div className="motivation-content">
                <Sparkles size={32} style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
                <motion.div
                    className="motivation-text-wrapper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <p className="motivation-text">
                        "{displayQuote}"
                        <span className="cursor-blink"></span>
                    </p>
                </motion.div>
                <p className="motivation-author">- Roshan Reddy</p>
            </div>
        </Card>
    );
}
