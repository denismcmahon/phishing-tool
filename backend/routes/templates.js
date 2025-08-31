const express = require('express');
const router = express.Router();
const Template = require('../models/Template');
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_AI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

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

// POST - AI generate an email template
router.post('/ai-generate', async (req, res) => {
  try {
    const { theme, tone } = req.body;

    const prompt = `
      Write a phishing-style email template.
      Theme: ${theme}.
      Tone: ${tone}.
      Include a subject line, an HTML body, and a plain text body.
    `;

    const response = await client.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI that generates phishing simulation emails.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const text = response.choices[0].message.content;

    res.json({
      subject: `Phishing Alert: ${theme}`,
      bodyHtml: `<p>${text.replace(/\n/g, '<br/>')}</p>`,
      bodyText: text,
    });
  } catch (err) {
    console.error('AI generation error:', err);
    res
      .status(500)
      .json({ error: 'AI generation failed', details: err.message });
  }
});

module.exports = router;
