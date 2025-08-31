const express = require('express');
const router = express.Router();
const Template = require('../models/Template');

// GET - get all email templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// GET - get specific email template
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// POST - create a new email template
router.post('/', async (req, res) => {
  try {
    const { name, subject, bodyHtml, bodyText } = req.body;
    const template = new Template({ name, subject, bodyHtml, bodyText });
    await template.save();
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create template', err: err });
  }
});

// DELETE - delete a template
router.delete('/:id', async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

module.exports = router;
