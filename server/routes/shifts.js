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

// Auto-fill shifts with pattern (Admin only)
router.post('/auto-fill', async (req, res) => {
    try {
        const { startDate, endDate, startingIndex = 0 } = req.body;

        // Pattern: 2 Mañanas, 2 Noches, 4 Francos
        const pattern = ['M', 'M', 'N', 'N', 'F', 'F', 'F', 'F'];

        const start = new Date(startDate);
        const end = new Date(endDate);
        const shifts = [];

        let currentDate = new Date(start);
        let patternIndex = startingIndex % pattern.length;

        while (currentDate <= end) {
            const shiftType = pattern[patternIndex];

            // Check if shift already exists
            let shift = await Shift.findOne({ date: new Date(currentDate) });

            if (shift) {
                shift.type = shiftType;
                await shift.save();
            } else {
                shift = new Shift({
                    date: new Date(currentDate),
                    type: shiftType
                });
                await shift.save();
            }

            shifts.push(shift);

            // Move to next day and next pattern position
            currentDate.setDate(currentDate.getDate() + 1);
            patternIndex = (patternIndex + 1) % pattern.length;
        }

        res.json({
            message: `${shifts.length} shifts created/updated`,
            shifts
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete shift (Admin only)
router.delete('/:id', async (req, res) => {
    try {
        await Shift.findByIdAndDelete(req.params.id);
        res.json({ message: 'Shift deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
