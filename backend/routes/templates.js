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
      Generate a phishing simulation email template in JSON format.
      Rules:
      - Use [User] as the placeholder for the recipient’s name.
      - Return ONLY valid JSON (no markdown, no commentary).
      - JSON schema:
      {
        "subject": "<string>",
        "bodyHtml": "<valid HTML string>",
        "bodyText": "<plain text string, with \\n line breaks between paragraphs>"
      }

      Theme: ${theme}
      Tone: ${tone}
    `;

    const response = await client.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You generate phishing simulation emails in JSON only.',
        },
        { role: 'user', content: prompt },
      ],
    });

    // Parse JSON directly from AI response
    const raw = response.choices[0].message.content || '{}';
    const parsed = JSON.parse(raw);

    res.json(parsed);
  } catch (err) {
    console.error('AI generation error:', err);
    res.status(500).json({ error: 'AI generation failed', details: err.message });
  }
});

module.exports = router;
