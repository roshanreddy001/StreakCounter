import React from 'react';
import { Flame } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import './StreakCounter.css';

export default function StreakCounter() {
    const { streak } = useTasks();

    return (
        <Card className="streak-card">
            <motion.div
                className="streak-icon-wrapper"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <Flame size={64} color="#f97316" fill={streak.count > 0 ? "#f97316" : "transparent"} />
            </motion.div>
            <div className="streak-count">{streak.count}</div>
            <div className="streak-label">Day Streak</div>
        </Card>
    );
}
