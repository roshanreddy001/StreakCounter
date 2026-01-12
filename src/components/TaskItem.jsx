import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useTasks } from '../context/TaskContext';
import './TaskItem.css';

export default function TaskItem({ task }) {
    const { toggleTask, deleteTask } = useTasks();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className={cn("task-item", task.completed && "completed")}
        >
            <div
                className="task-checkbox-wrapper"
                onClick={() => toggleTask(task._id)}
            >
                <div className="custom-checkbox">
                    {task.completed && <Check size={16} strokeWidth={3} />}
                </div>
                <div className="task-content">
                    <span className="task-text">
                        {task.text}
                    </span>
                    {task.streak > 0 && (
                        <span className="task-streak">
                            🔥 {task.streak}
                        </span>
                    )}
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task._id);
                }}
                className="delete-btn"
                aria-label="Delete Task"
            >
                <Trash2 size={18} />
            </button>
        </motion.div>
    );
}
