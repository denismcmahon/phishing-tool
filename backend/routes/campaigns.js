const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Template = require('../models/Template');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// GET - get all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('users')
      .populate('template');
    res.json(campaigns);
  } catch (err) {
    console.error('Fetch campaigns error:', err);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// GET - get single campaign by id
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('users')
      .populate('template');
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    console.error('Fetch campaign error:', err);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// POST - create a new campaign
router.post('/', async (req, res) => {
  try {
    const { name, type, users, template } = req.body;

    const newCampaign = new Campaign({
      name,
      type,
      template,
      users,
      status: 'running',
      emails: users.map((u) => ({ userId: u, status: 'sent' })),
    });

    await newCampaign.save();

    const populatedCampaign = await Campaign.findById(newCampaign._id)
      .populate('users')
      .populate('template');

    res.status(201).json(populatedCampaign);
  } catch (err) {
    console.error('Create campaign error:', err);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// PUT - update campaign
router.put('/:id', async (req, res) => {
  try {
    const { name, type, status, template } = req.body;
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { name, type, status, template },
      { new: true }
    )
      .populate('users')
      .populate('template');
    if (!updatedCampaign)
      return res.status(404).json({ error: 'Campaign not found' });
    res.json(updatedCampaign);
  } catch (err) {
    console.error('Update campaign error:', err);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// DELETE - remove campaign
router.delete('/:id', async (req, res) => {
  try {
    const deletedCampaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!deletedCampaign)
      return res.status(404).json({ error: 'Campaign not found' });
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    console.error('Delete campaign error:', err);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

// POST - send emails for a campaign
router.post('/:id/send', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('users')
      .populate('template');
    console.log('DM ==> sendEmails ==> campaign: ', campaign);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // configure test transport (Ethereal)
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });

    const previewUrls = [];

    for (const user of campaign.users) {
      try {
        const trackingUrl = `${
          process.env.BACKEND_URL || 'http://localhost:4000'
        }/track/${campaign._id}/${user._id}`;

        // Replace placeholders with user + tracking info
        const personalizedHtml = campaign.template?.bodyHtml
          .replace(/User/g, user.name)
          .replace(/http:\/\/phishing-link\.com/g, trackingUrl);

        const personalizedText = campaign.template?.bodyText
          .replace(/User/g, user.name)
          .replace(/http:\/\/phishing-link\.com/g, trackingUrl);

        let info = await transporter.sendMail({
          from: '"Security Team" <security@corp.com>',
          to: user.email,
          subject: campaign.template?.subject || 'No subject',
          text: personalizedText || '',
          html: personalizedHtml || '',
        });

        const url = nodemailer.getTestMessageUrl(info);
        console.log(`Sent to ${user.email}: Preview URL: ${url}`);

        previewUrls.push({ email: user.email, url });
      } catch (err) {
        console.error(`Failed sending to ${user.email}:`, err);
      }
    }

    campaign.status = 'completed';
    await campaign.save();

    return res.json({
      message: 'Emails sent successfully',
      previews: previewUrls,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send emails', err: err });
  }
});

module.exports = router;
