import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { motion } from 'framer-motion';
import './TaskInput.css';

export default function TaskInput() {
    const [text, setText] = useState("");
    const { addTask } = useTasks();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        addTask(text);
        setText("");
    };

    return (
        <form onSubmit={handleSubmit} className="task-input-container">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's the vibe today?"
                className="task-input"
            />
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="add-task-btn"
                aria-label="Add Task"
            >
                <Plus size={24} />
            </motion.button>
        </form>
    );
}
