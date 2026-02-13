const express = require('express');
const router = express.Router();
const Shift = require('../models/Shift');

// Get all shifts (Public/User)
router.get('/', async (req, res) => {
    try {
        const shifts = await Shift.find();
        res.json(shifts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create/Update Shift (Admin only)
router.post('/', async (req, res) => {
    try {
        const { date, type } = req.body;

        // Check if shift exists for date
        let shift = await Shift.findOne({ date: new Date(date) });

        if (shift) {
            shift.type = type;
            await shift.save();
        } else {
            shift = new Shift({ date: new Date(date), type });
            await shift.save();
        }

        res.json(shift);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
