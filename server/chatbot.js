const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      max_tokens: 150,
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    res.json({ response: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Chatbot API error:', error.message);
    res.status(500).json({ response: 'I apologize, but I am unable to process your request at the moment. Please try again later.' });
  }
});

module.exports = router;
