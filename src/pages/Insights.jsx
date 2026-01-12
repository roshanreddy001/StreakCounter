import React, { useMemo, useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Award, CheckCircle, Flame, Calendar, AlertCircle } from 'lucide-react';
import { getMotivation } from '../services/gemini';
import './Insights.css';

export default function Insights() {
    const { tasks } = useTasks();
    const [quote, setQuote] = useState("Loading insight...");

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                // Pass some dummy stats, although currently getMotivation just returns random
                const text = await getMotivation(0, 0);
                setQuote(text);
            } catch (e) {
                setQuote("Consistency is key.");
            }
        };
        fetchQuote();
    }, []);

    const stats = useMemo(() => {
        const totalTasks = tasks.length;
        // Total completed days (sum of streaks)
        const totalCompletedDays = tasks.reduce((acc, curr) => acc + (curr.streak || 0), 0);

        // Current active streak (highest task streak)
        const currentActiveStreak = tasks.length > 0 ? Math.max(...tasks.map(t => t.streak || 0)) : 0;

        // Total missed days estimation
        const today = new Date();
        const totalMissedDays = tasks.reduce((acc, curr) => {
            const createdAt = parseISO(curr.createdAt);
            const daysExist = differenceInCalendarDays(today, createdAt) + 1;
            const streak = curr.streak || 0;
            const missed = Math.max(0, daysExist - streak);
            return acc + missed;
        }, 0);

        return {
            totalTasks,
            totalCompletedDays,
            currentActiveStreak,
            totalMissedDays
        };
    }, [tasks]);

    return (
        <div className="insights-container">
            <h1 className="insights-title">Your Insights</h1>

            <div className="insights-grid">
                <div className="insight-card">
                    <div className="icon-wrapper blue">
                        <Award size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Total Tasks</h3>
                        <p>{stats.totalTasks}</p>
                    </div>
                </div>

                <div className="insight-card">
                    <div className="icon-wrapper green">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Total Completions</h3>
                        <p className="sub-label">(Sum of Streaks)</p>
                        <p>{stats.totalCompletedDays}</p>
                    </div>
                </div>

                <div className="insight-card">
                    <div className="icon-wrapper orange">
                        <Flame size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Best Active Streak</h3>
                        <p>{stats.currentActiveStreak} days</p>
                    </div>
                </div>

                <div className="insight-card">
                    <div className="icon-wrapper red">
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Missed Opportunities</h3>
                        <p className="sub-label">(Days vs Streak)</p>
                        <p>{stats.totalMissedDays}</p>
                    </div>
                </div>
            </div>

            <div className="motivation-box">
                <p>"{quote}"</p>
            </div>
        </div>
    );
}
