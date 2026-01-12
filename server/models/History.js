const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String, // 'completed', 'missed' (explicitly stored if needed, but mostly 'completed' records imply success)
        enum: ['completed', 'missed'],
        default: 'completed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for efficient querying of a user's history for a specific date range
HistorySchema.index({ userId: 1, date: 1 });
HistorySchema.index({ userId: 1, taskId: 1, date: 1 }, { unique: true }); // Prevent duplicate completions for same task/day

module.exports = mongoose.model('History', HistorySchema);
