const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().populate('createdBy', 'username');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Task
router.post('/', async (req, res) => {
    try {
        const { date, time, description, priority, createdBy } = req.body;
        const task = new Task({ date, time, description, priority, createdBy });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Task (optional, good to have)
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
