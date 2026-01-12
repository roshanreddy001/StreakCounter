import React from 'react';
import StreakCounter from '../components/StreakCounter';
import MotivationCard from '../components/MotivationCard';
import AnalyticsChart from '../components/AnalyticsChart';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import { motion } from 'framer-motion';
import './Home.css';

export default function Home() {
    return (
        <>
            <div className="home-container">
                {/* Streak Section */}
                {/* Streak Section Removed - Task-wise streaks implemented */}
                {/* 
                <section className="home-section">
                    <StreakCounter />
                </section>
                */}

                {/* Motivation Section */}
                <section className="home-section">
                    <MotivationCard />
                </section>

                <section className="home-section">
                    <AnalyticsChart />
                </section>

                {/* Tasks Section */}
                <section className="home-section">
                    <div className="section-header">
                        <h2 className="section-title">Today's Missions</h2>
                    </div>
                    <TaskInput />
                    <TaskList />
                </section>
            </div>
        </>
    );
}
