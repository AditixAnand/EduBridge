require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Use body-parser to parse JSON bodies
app.use(bodyParser.json());

// Route to handle chat requests (standalone server)
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) return res.status(400).json({ error: 'No message provided' });
  if (!OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not set' });

  try {
    // Use chat completions for chat-capable models
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for EduBridge.' },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || '';
    res.json({ reply: reply.trim() });
  } catch (error) {
    console.error('Error fetching response from AI:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Error processing your request' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
