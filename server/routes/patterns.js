const express = require('express');
const router = express.Router();
const Pattern = require('../models/Pattern');

// Get all patterns
router.get('/', async (req, res) => {
    try {
        const patterns = await Pattern.find().populate('createdBy', 'username');
        res.json(patterns);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new pattern
router.post('/', async (req, res) => {
    try {
        const { name, pattern, createdBy } = req.body;

        // Validate total days (1-15)
        const totalDays = pattern.reduce((sum, segment) => sum + segment.days, 0);
        if (totalDays < 1 || totalDays > 15) {
            return res.status(400).json({ message: 'El patrón debe tener entre 1 y 15 días en total' });
        }

        // If setting as default, unset other defaults
        if (req.body.isDefault) {
            await Pattern.updateMany({}, { isDefault: false });
        }

        const newPattern = new Pattern({
            name,
            pattern,
            createdBy: createdBy,
            isDefault: req.body.isDefault || false
        });

        const savedPattern = await newPattern.save();
        res.status(201).json(savedPattern);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Ya existe un patrón con ese nombre' });
        }
        res.status(500).json({ message: err.message });
    }
});

// Update pattern
router.put('/:id', async (req, res) => {
    try {
        const { name, pattern, isDefault } = req.body;

        // Validate total days
        if (pattern) {
            const totalDays = pattern.reduce((sum, segment) => sum + segment.days, 0);
            if (totalDays < 1 || totalDays > 15) {
                return res.status(400).json({ message: 'El patrón debe tener entre 1 y 15 días en total' });
            }
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await Pattern.updateMany({}, { isDefault: false });
        }

        const updatedPattern = await Pattern.findByIdAndUpdate(
            req.params.id,
            { name, pattern, isDefault },
            { new: true }
        );

        if (!updatedPattern) {
            return res.status(404).json({ message: 'Patrón no encontrado' });
        }

        res.json(updatedPattern);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete pattern
router.delete('/:id', async (req, res) => {
    try {
        const pattern = await Pattern.findByIdAndDelete(req.params.id);
        if (!pattern) {
            return res.status(404).json({ message: 'Patrón no encontrado' });
        }
        res.json({ message: 'Patrón eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Set pattern as default
router.put('/:id/set-default', async (req, res) => {
    try {
        // Unset all defaults
        await Pattern.updateMany({}, { isDefault: false });

        // Set this one as default
        const pattern = await Pattern.findByIdAndUpdate(
            req.params.id,
            { isDefault: true },
            { new: true }
        );

        if (!pattern) {
            return res.status(404).json({ message: 'Patrón no encontrado' });
        }

        res.json(pattern);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;


// Get all patterns
router.get('/', async (req, res) => {
    try {
        const patterns = await Pattern.find().populate('createdBy', 'username');
        res.json(patterns);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new pattern
router.post('/', auth, async (req, res) => {
    try {
        const { name, pattern } = req.body;

        // Validate total days (1-15)
        const totalDays = pattern.reduce((sum, segment) => sum + segment.days, 0);
        if (totalDays < 1 || totalDays > 15) {
            return res.status(400).json({ message: 'El patrón debe tener entre 1 y 15 días en total' });
        }

        // If setting as default, unset other defaults
        if (req.body.isDefault) {
            await Pattern.updateMany({}, { isDefault: false });
        }

        const newPattern = new Pattern({
            name,
            pattern,
            createdBy: req.user.id,
            isDefault: req.body.isDefault || false
        });

        const savedPattern = await newPattern.save();
        res.status(201).json(savedPattern);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Ya existe un patrón con ese nombre' });
        }
        res.status(500).json({ message: err.message });
    }
});

// Update pattern
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, pattern, isDefault } = req.body;

        // Validate total days
        if (pattern) {
            const totalDays = pattern.reduce((sum, segment) => sum + segment.days, 0);
            if (totalDays < 1 || totalDays > 15) {
                return res.status(400).json({ message: 'El patrón debe tener entre 1 y 15 días en total' });
            }
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await Pattern.updateMany({}, { isDefault: false });
        }

        const updatedPattern = await Pattern.findByIdAndUpdate(
            req.params.id,
            { name, pattern, isDefault },
            { new: true }
        );

        if (!updatedPattern) {
            return res.status(404).json({ message: 'Patrón no encontrado' });
        }

        res.json(updatedPattern);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete pattern
router.delete('/:id', auth, async (req, res) => {
    try {
        const pattern = await Pattern.findByIdAndDelete(req.params.id);
        if (!pattern) {
            return res.status(404).json({ message: 'Patrón no encontrado' });
        }
        res.json({ message: 'Patrón eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Set pattern as default
router.put('/:id/set-default', auth, async (req, res) => {
    try {
        // Unset all defaults
        await Pattern.updateMany({}, { isDefault: false });

        // Set this one as default
        const pattern = await Pattern.findByIdAndUpdate(
            req.params.id,
            { isDefault: true },
            { new: true }
        );

        if (!pattern) {
            return res.status(404).json({ message: 'Patrón no encontrado' });
        }

        res.json(pattern);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
