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
        const { startDate, endDate, patternId } = req.body;

        if (!patternId) {
            return res.status(400).json({ message: 'Pattern ID is required' });
        }

        // Get pattern from database
        const Pattern = require('../models/Pattern');
        const patternDoc = await Pattern.findById(patternId);

        if (!patternDoc) {
            return res.status(404).json({ message: 'Pattern not found' });
        }

        // Build flat pattern array from pattern segments
        const pattern = [];
        patternDoc.pattern.forEach(segment => {
            for (let i = 0; i < segment.days; i++) {
                pattern.push(segment.type);
            }
        });

        const start = new Date(startDate);
        const end = new Date(endDate);
        const shifts = [];

        let currentDate = new Date(start);
        let patternIndex = 0;

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
            message: `${shifts.length} turnos creados/actualizados con el patrón "${patternDoc.name}"`,
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
