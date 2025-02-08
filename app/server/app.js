require('dotenv').config();
const OpenAI = require("openai");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware for JSON body parsing and enabling CORS
app.use(bodyParser.json());
app.use(cors());
// Endpoint to handle question from the front-end
app.post('/ask', async (req, res) => {
    const userQuestion = req.body.question;
    if (!userQuestion) {
        return res.status(400).json({ error: "Question is required!" });
    }
    try {
        console.log(userQuestion)
        const response = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: userQuestion }],
            model: "deepseek-chat",
            stream: true, // Enable streaming
        });
        
        // Set headers for streaming response
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        console.log(response.iterator())
        for await (const chunk of response.iterator()) {
            console.log("Chunk content:", chunk);
            const content = chunk.choices[0]?.delta?.content || ''; // Extract content
            console.log(content)
            if (content === " ") {
                break; // End of the stream
            }
            // Stream content to the client
            if (content) {
                res.write(`${content}`);
            }
        }
        // Indicate the stream is done
        // res.write(`data: [DONE]\n\n`);
        res.end();
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "Failed to process the request." });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});