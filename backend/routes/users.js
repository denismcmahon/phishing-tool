const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET - get all users
router.get('/', async (req, res) => {
    try { 
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// POST - create new user
router.post('/', async (req, res) => {
    try {
        const { name, email, department } = req.body;
        const newUser = new User({ name, email, department });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// PUT - update user
router.put('/:id', async (req, res) => {
    try {
        const { name, email, department } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, department },
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE - remove user  
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
})

module.exports = router;