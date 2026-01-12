import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import {
    format,
    subDays,
    isAfter,
    parseISO,
    startOfDay,
    isWithinInterval,
    isSameDay,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    getDate,
    isValid
} from 'date-fns';
import { Info, Calendar as CalendarIcon } from 'lucide-react';
import './History.css';

export default function History() {
    const { tasks = [] } = useTasks(); // Default to empty array safety

    // View state: 'week' or 'month'
    // Default to 'month' (Calendar view)
    const [viewMode, setViewMode] = useState('month');

    const today = startOfDay(new Date());

    // Determine the date range to show
    let startDate, endDate;

    if (viewMode === 'week') {
        startDate = subDays(today, 6); // Last 7 days
        endDate = today;
    } else {
        // Calendar View: Last 30 days roughly, or aligned to weeks?
        // To make it look like a nice calendar grid, let's show strictly the last 28 days (4 weeks) 
        // OR standard "Month view" of current month?
        // Let's stick to "Last 30 days" as requested originally, but aligned to weeks for the grid to look square.
        // Actually, Step 433 requested "Calendar-style grid... dates aligned by weekday".
        // So we need startOfWeek(today - 30days) to endOfWeek(today).

        const approxStart = subDays(today, 29); // 30 days window
        startDate = startOfWeek(approxStart);
        endDate = endOfWeek(today);
    }

    // Generate days
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getStatusForDay = (task, date) => {
        const dateObj = startOfDay(date);

        // Safety check for task data
        if (!task || !task.createdAt) return 'na';

        let taskCreatedAt;
        try {
            taskCreatedAt = startOfDay(parseISO(task.createdAt));
            if (!isValid(taskCreatedAt)) return 'na';
        } catch (e) {
            return 'na';
        }

        // 1. Future dates (relative to today)
        if (isAfter(dateObj, today)) return 'future';

        // 2. Before task existed
        if (isAfter(taskCreatedAt, dateObj)) return 'na';

        // 3. Streak Logic
        if (task.lastCompletedDate) {
            try {
                const lastCompleted = startOfDay(parseISO(task.lastCompletedDate));
                if (isValid(lastCompleted)) {
                    const streakCount = task.streak || 0;
                    if (streakCount > 0) {
                        const streakStartDate = subDays(lastCompleted, streakCount - 1);
                        if (isWithinInterval(dateObj, { start: streakStartDate, end: lastCompleted })) {
                            return 'completed';
                        }
                    }
                }
            } catch (e) {
                // ignore parsing error
            }
        }

        // Special case: Today pending
        if (isSameDay(dateObj, today)) return 'pending';

        return 'missed';
    };

    return (
        <div className="history-container">
            <header className="history-header">
                <div>
                    <h1 className="page-title">History</h1>
                    <p className="page-subtitle">Your consistency calendar</p>
                </div>

                <div className="controls-wrapper">
                    <div className="legend">
                        <div className="legend-item">
                            <span className="legend-box completed"></span> <span className="legend-label">Done</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-box missed"></span> <span className="legend-label">Missed</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-box na"></span> <span className="legend-label">No Task</span>
                        </div>
                    </div>

                    <div className="toggle-group">
                        <button
                            className={`toggle-btn ${viewMode === 'week' ? 'active' : ''}`}
                            onClick={() => setViewMode('week')}
                        >
                            Week
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
                            onClick={() => setViewMode('month')}
                        >
                            Calendar
                        </button>
                    </div>
                </div>
            </header>

            <div className={`history-grid-layout ${viewMode}`}>
                {tasks.length === 0 ? (
                    <div className="history-empty">
                        <Info size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3>No activity yet</h3>
                        <p>Start your streak today!</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div key={task._id} className="history-card">
                            <div className="card-header">
                                <h3 className="history-task-name">{task.text}</h3>
                                <div className="streak-badge-container">
                                    🔥 {task.streak}
                                </div>
                            </div>

                            <div className="calendar-wrapper">
                                {/* Weekday Headers (Only for Calendar View) */}
                                {viewMode === 'month' && (
                                    <div className="weekday-header">
                                        {weekDays.map(day => (
                                            <div key={day} className="weekday-label">{day}</div>
                                        ))}
                                    </div>
                                )}

                                {/* Calendar Grid */}
                                <div className={`calendar-grid ${viewMode}`}>
                                    {calendarDays.map((date) => {
                                        const status = getStatusForDay(task, date);
                                        const dateNum = getDate(date);
                                        const dateStr = format(date, 'MMM d, yyyy');

                                        let tooltipText = `${dateStr}`;
                                        if (status === 'completed') tooltipText += ' • Completed';
                                        if (status === 'missed') tooltipText += ' • Missed';
                                        if (status === 'na') tooltipText += ' • No Task';
                                        if (status === 'pending') tooltipText += ' • Pending';
                                        if (status === 'future') tooltipText = dateStr;

                                        return (
                                            <div
                                                key={date.toISOString()}
                                                className={`calendar-cell ${status}`}
                                                data-tooltip={status !== 'future' ? tooltipText : undefined}
                                            >
                                                <span className="date-number">{dateNum}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
