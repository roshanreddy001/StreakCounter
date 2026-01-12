import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import { differenceInCalendarDays, isSameDay, subDays } from 'date-fns';
import { getUserData, saveUserData } from '../utils/storage';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const { user, loading } = useAuth();

    // Load tasks when user changes
    useEffect(() => {
        if (loading) return;

        if (user) {
            // STRATEGY: 
            // 1. Try to load from local cache first (instant load)
            // 2. Then fetch from API (sync) and update cache
            const cachedTasks = getUserData('tasks', user);
            if (cachedTasks) {
                // If it's a guest, logic is local-first anyway.
                // If it's a user, we show cache while fetching.
                setTasks(cachedTasks);
            }

            if (user.isGuest) {
                // Check streak logic for guest (local only)
                // If cachedTasks is null, init empty
                let currentTasks = cachedTasks || [];

                const today = new Date();
                const updatedTasks = currentTasks.map(task => {
                    if (!task.lastCompletedDate) return task;
                    const lastDate = new Date(task.lastCompletedDate);
                    const diff = differenceInCalendarDays(today, lastDate);

                    if (diff > 1) {
                        return { ...task, streak: 0 };
                    }
                    return task;
                });

                // If streak logic changed anything, or even if not, set state
                // Actually if streak reset, we should update state.
                setTasks(updatedTasks);
                saveUserData('tasks', user, updatedTasks);

            } else {
                // Logged in user: Fetch fresh data
                fetchTasks();
            }
        } else {
            setTasks([]);
        }
    }, [user, loading]);

    const fetchTasks = async () => {
        if (!user) return;
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
            // Update cache for offline/reload speed
            saveUserData('tasks', user, res.data);
        } catch (err) {
            console.error("Failed to fetch tasks, using cache if available", err);
            // If API fails, we rely on what we loaded from cache in useEffect
        }
    };

    const addTask = async (text) => {
        if (!user) return;

        // GUEST
        if (user.isGuest) {
            const newTask = {
                _id: Date.now().toString(),
                text,
                completed: false,
                streak: 0,
                createdAt: new Date().toISOString(),
                lastCompletedDate: null
            };
            const newTasks = [newTask, ...tasks];
            setTasks(newTasks);
            saveUserData('tasks', user, newTasks);
            return;
        }

        // LOGGED IN
        try {
            const res = await api.post('/tasks', { text });
            const newTasks = [res.data, ...tasks];
            setTasks(newTasks);
            saveUserData('tasks', user, newTasks); // Sync cache
        } catch (err) {
            console.error("Error adding task", err);
        }
    };

    const deleteTask = async (id) => {
        if (!user) return;

        if (user.isGuest) {
            const newTasks = tasks.filter(t => t._id !== id);
            setTasks(newTasks);
            saveUserData('tasks', user, newTasks);
            return;
        }

        try {
            await api.delete(`/tasks/${id}`);
            const newTasks = tasks.filter(t => t._id !== id);
            setTasks(newTasks);
            saveUserData('tasks', user, newTasks);
        } catch (err) {
            console.error("Error deleting task", err);
        }
    };

    const toggleTask = async (id) => {
        if (!user) return;

        // Helper for local toggle logic (shared logic could be extracted but keeping it simple)
        const applyToggle = (taskList) => {
            return taskList.map(t => {
                if (t._id !== id) return t;

                const today = new Date();
                const todayStr = today.toISOString();

                if (!t.completed) {
                    let newStreak = t.streak;
                    if (!t.lastCompletedDate) {
                        newStreak = 1;
                    } else {
                        const lastDate = new Date(t.lastCompletedDate);
                        const diff = differenceInCalendarDays(today, lastDate);
                        if (diff === 0) newStreak = t.streak;
                        else if (diff === 1) newStreak += 1;
                        else newStreak = 1;
                    }
                    return { ...t, completed: true, streak: newStreak, lastCompletedDate: todayStr };
                } else {
                    const lastDate = new Date(t.lastCompletedDate);
                    let streak = t.streak;
                    let lastCompletedDate = t.lastCompletedDate;

                    if (isSameDay(today, lastDate)) {
                        streak = Math.max(0, streak - 1);
                        const yesterday = subDays(today, 1);
                        // Approximate revert if it was just done today
                        lastCompletedDate = streak > 0 ? yesterday.toISOString() : null;
                    }
                    return { ...t, completed: false, streak, lastCompletedDate };
                }
            });
        };

        if (user.isGuest) {
            const newTasks = applyToggle(tasks);
            setTasks(newTasks);
            saveUserData('tasks', user, newTasks);
            return;
        }

        try {
            const res = await api.put(`/tasks/${id}/complete`);
            // Backend returns the updated task usually.
            // We update state with backend response to be sure.
            const newTasks = tasks.map(t => t._id === id ? res.data : t);
            setTasks(newTasks);
            saveUserData('tasks', user, newTasks);
        } catch (err) {
            console.error("Error toggling task", err);
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, deleteTask, toggleTask }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    return useContext(TaskContext);
}
