const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST /api/chat
router.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'No message provided' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not set on server' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-3.5-turbo',
        prompt: userMessage,
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Support both completions and chat-style responses
    const reply = (response.data.choices && response.data.choices[0].text) || response.data.choices[0].message?.content || '';
    res.json({ reply: reply.trim() });
  } catch (err) {
    console.error('Error in /api/chat:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Error processing request' });
  }
});

module.exports = router;
