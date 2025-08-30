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

        const populatedCampaign = await Campaign.findById(newCampaign._id).populate("users");

        res.status(201).json(populatedCampaign);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create campaign' });
    }
});

// PUT - update campaign
router.put('/:id', async (req, res) => {
    try {
        const { name, type, status } = req.body;
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            { name, type, status },
            { new: true }
        );
        if (!updatedCampaign) return res.status(404).json({ error: 'Campaign not found' });
        res.json(updatedCampaign);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update campaign' });
    }
});

// DELETE - remove campaign
router.delete('/:id', async (req, res) => {
    try {
        const deletedCampaign = await Campaign.findByIdAndDelete(req.params.id);
        if (!deletedCampaign) return res.status(404).json({ error: 'Campaign not found' });
        res.json({ message: 'Campaign deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete campaign' });
    }
});

module.exports = router;