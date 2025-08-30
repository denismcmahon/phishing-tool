const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

// POST - user action (clicked/reported)
router.post('/', async (req, res) => {
    try {
        const { campaignId, userId, action } = req.body;

        const campaign = await Campaign.findById(campaignId);
        if(!campaign) return res.status(404).json({ error: 'Campaign not found' });

        const email = campaign.emails.find((e) => e.userId.toString() === userId);
        if(!email) return res.status(404).json({ error: 'User is not part of campaign' });

        email.status = action;
        await campaign.save();

        res.json({ message: 'Result logged', campaign });
    } catch (err) {
        res.status(500).json({ error: 'Failed to log result' });
    }
});

module.exports = router;