const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const History = require('../models/History');

// @route   GET /history
// @desc    Get history for user within a date range
// @access  Private
router.get('/', auth, async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ msg: 'Please provide startDate and endDate' });
    }

    try {
        const history = await History.find({
            userId: req.user.id,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });

        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
