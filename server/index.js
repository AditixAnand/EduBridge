const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const chatbotRouter = require('./chatbot');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

// Routes
app.use('/api', chatbotRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 