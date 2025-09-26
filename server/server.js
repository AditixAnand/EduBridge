require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Use body-parser to parse JSON bodies
app.use(bodyParser.json());

// Route to handle chat requests
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  
  try {
    // Call an AI API (e.g., OpenAI GPT-3/4) for chatbot response
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'gpt-4', // You can use GPT-3 or GPT-4
      prompt: userMessage,
      max_tokens: 150,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer YOUR_OPENAI_API_KEY` // Replace with your actual OpenAI API Key
      }
    });

    // Send back the response from OpenAI to the client
    res.json({ reply: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error fetching response from AI:', error);
    res.status(500).send('Error processing your request');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
