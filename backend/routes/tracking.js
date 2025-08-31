const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

router.get('/:campaignId/:userId', async (req, res) => {
  try {
    const { campaignId, userId } = req.params;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).send('Campaign not found');

    // update the email status for this user
    const emailEntry = campaign.emails.find(
      (e) => e.userId.toString() === userId
    );
    if (emailEntry) {
      emailEntry.status = 'clicked';
      emailEntry.clickedAt = new Date();
      await campaign.save();
    }

    res.redirect('https://temp.com');
  } catch (err) {
    res.status(500).send('Error tracking click');
  }
});

module.exports = router;
