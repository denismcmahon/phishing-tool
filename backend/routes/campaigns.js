const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

// GET - get all campaigns
router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.find().populate('users');
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
});

// GET - get single campaign by id
router.get('/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate('users');
        if(!campaign) return res.status(404).json({ error: 'Campaign not found '});
        res.json(campaign);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch campaign' });
    }
});

// POST - create a new campaign
router.post('/', async (req, res) => {
    try {
        const { name, type, users } = req.body;
        const newCampaign = new Campaign({
            name,
            type,
            users,
            status: 'running',
            emails: users.map((u) => ({ userId: u, status: 'sent' }))
        });
        await newCampaign.save();
        res.status(201).json(newCampaign);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create campaign' });
    }
});

module.exports = router;