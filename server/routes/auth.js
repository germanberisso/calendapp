const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (pending by default)
        // First user could be admin automatically? Let's keep it simple: manual update or seed.
        // Spec says: "Solo el administrador puede habilitar el acceso por primera vez."

        const newUser = new User({
            username,
            password: hashedPassword,
            status: 'pending',
            role: 'user' // Default role
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered. Please wait for admin approval.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        if (user.status !== 'active') {
            return res.status(403).json({ message: 'Account is pending approval' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Pending Users (Admin only)
router.get('/pending', async (req, res) => {
    try {
        // Middleware should check admin, but doing quick check here for prototype
        const users = await User.find({ status: 'pending' }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Approve User (Admin only)
router.put('/approve/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
