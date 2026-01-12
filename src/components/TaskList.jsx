import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { AnimatePresence, motion } from 'framer-motion';
import './TaskList.css';

export default function TaskList() {
    const { tasks } = useTasks();

    // Sort: Uncompleted first
    const sortedTasks = [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));

    return (
        <div className="task-list">
            {tasks.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="empty-state"
                >
                    <p>No tasks yet ✨</p>
                </motion.div>
            )}
            <AnimatePresence mode="popLayout">
                {sortedTasks.map(task => (
                    <TaskItem key={task._id} task={task} />
                ))}
            </AnimatePresence>
        </div>
    );
}
