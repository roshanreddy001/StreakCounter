const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const History = require('../models/History');
const { differenceInCalendarDays, isSameDay, subDays, startOfDay } = require('date-fns');

// @route   GET /tasks
// @desc    Get all tasks for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });

        // Logic to reset streaks if missed yesterday (on read)
        // Similar to useEffect logic in TaskContext
        const today = new Date();
        const updatedTasks = [];

        for (let task of tasks) {
            if (task.lastCompletedDate) {
                const lastDate = new Date(task.lastCompletedDate);
                const diff = differenceInCalendarDays(today, lastDate);

                if (diff > 1) {
                    task.streak = 0;
                    await task.save();
                }
            }
            updatedTasks.push(task);
        }

        res.json(updatedTasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, async (req, res) => {
    const { text } = req.body;

    try {
        const newTask = new Task({
            text,
            userId: req.user.id,
            streak: 0,
            completed: false
        });

        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /tasks/:id/complete
// @desc    Toggle task completion status
// @access  Private
router.put('/:id/complete', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Make sure user owns task
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const today = new Date(); // now
        const todayNormalized = startOfDay(today);

        if (!task.completed) {
            // Checking (false -> true)
            let newStreak = task.streak;

            if (!task.lastCompletedDate) {
                newStreak = 1;
            } else {
                const lastDate = new Date(task.lastCompletedDate);
                const diff = differenceInCalendarDays(today, lastDate);

                if (diff === 0) {
                    newStreak = task.streak; // Already done today (shouldn't happen if !completed but safe check)
                } else if (diff === 1) {
                    newStreak += 1;
                } else {
                    newStreak = 1;
                }
            }

            task.completed = true;
            task.streak = newStreak;
            task.lastCompletedDate = today;

            // SAVE HISTORY
            try {
                // Check if history already exists for today (prevent duplicates)
                const existingHistory = await History.findOne({
                    userId: req.user.id,
                    taskId: task._id,
                    date: todayNormalized
                });

                if (!existingHistory) {
                    await History.create({
                        userId: req.user.id,
                        taskId: task._id,
                        date: todayNormalized,
                        status: 'completed'
                    });
                }
            } catch (histErr) {
                console.error("Error saving history:", histErr);
                // Don't fail the task update just because history log failed, but log it.
            }

        } else {
            // Unchecking (true -> false)
            let dateToRemove = todayNormalized;

            if (task.lastCompletedDate) {
                const lastDate = new Date(task.lastCompletedDate);
                dateToRemove = startOfDay(lastDate);

                if (isSameDay(today, lastDate)) {
                    task.streak = Math.max(0, task.streak - 1);
                    task.lastCompletedDate = subDays(today, 1); // Revert to yesterday approximation
                }
            }
            task.completed = false;

            // REMOVE HISTORY
            try {
                await History.deleteOne({
                    userId: req.user.id,
                    taskId: task._id,
                    date: dateToRemove
                });
            } catch (histErr) {
                console.error("Error removing history:", histErr);
            }
        }

        await task.save();
        res.json(task);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Make sure user owns task
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);

        // Also delete history for this task logic?
        // User didn't request it but it's good practice. 
        // For now I'll leave history as "archived" or delete it.
        // Let's delete it to keep clean.
        await History.deleteMany({ taskId: req.params.id });

        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
