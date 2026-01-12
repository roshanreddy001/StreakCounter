import React from 'react';
import { Card } from './ui/Card';
import { useTasks } from '../context/TaskContext';
import './AnalyticsChart.css';

export default function AnalyticsChart() {
    const { tasks } = useTasks();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    // Prevent division by zero
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    const roundedProgress = Math.round(progress);

    return (
        <Card className="analytics-card">
            <div className="chart-header">
                <h3 className="chart-title">Mission Progress</h3>
                <div className="progress-stats">
                    <span>{roundedProgress}% Completed</span>
                </div>
            </div>

            <div className="progress-container">
                <div className="progress-track">
                    <div
                        className="progress-bar completed"
                        style={{ width: `${progress}%` }}
                        title={`${completedTasks} Completed`}
                    />
                    <div
                        className="progress-bar remaining"
                        style={{ width: `${100 - progress}%` }}
                        title={`${totalTasks - completedTasks} Remaining`}
                    />
                </div>

                <div className="progress-labels">
                    <span className="label-completed">
                        {completedTasks > 0 ? `${completedTasks} Done` : "0 Done"}
                    </span>
                    <span className="label-remaining">
                        {totalTasks - completedTasks > 0 ? `${totalTasks - completedTasks} Left` : (totalTasks > 0 ? "All Done!" : "No Tasks")}
                    </span>
                </div>
            </div>
        </Card>
    );
}
