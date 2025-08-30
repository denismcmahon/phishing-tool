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

module.exports = router;