const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const prompts = require('./prompts.json');
const db = require('./db');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize DB on startup
db.initDb().catch(console.error);

app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const constructPrompt = (type, text, additionalParams = {}) => {
    const config = prompts[type];
    if (!config) {
        throw new Error(`Prompt type '${type}' not found in configuration.`);
    }

    let prompt = config.user;

    // Replace standard placeholders
    prompt = prompt.replace('{TEXT}', text);

    // Replace additional params
    Object.keys(additionalParams).forEach(key => {
        prompt = prompt.replace(`{${key}}`, additionalParams[key]);
    });

    return {
        system: config.system,
        user: prompt,
        temperature: config.temperature,
        max_tokens: config.max_tokens
    };
};

app.post('/api/generate', async (req, res) => {
    try {
        const { type, text, constraints } = req.body;

        if (!type || !text) {
            return res.status(400).json({ error: 'Missing type or text' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key not configured on server' });
        }

        console.log(`Generating ${type} for text length: ${text.length}`);

        const promptConfig = constructPrompt(type, text, constraints);

        // For Gemini, we combine system instruction (if supported by model) or prepend it
        // simpler to just prepend for basic usage or use systemInstruction if using gemini-1.5-pro
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-pro",
            systemInstruction: promptConfig.system
        });

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: promptConfig.user }] }],
            generationConfig: {
                temperature: promptConfig.temperature,
                maxOutputTokens: promptConfig.max_tokens,
            }
        });

        const response = await result.response;
        const responseContent = response.text();

        res.json({ content: responseContent });

    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
});

app.get('/api/history', async (req, res) => {
    try {
        const history = await db.getHistory();
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

app.post('/api/save', async (req, res) => {
    try {
        const { type, originalText, content } = req.body;
        if (!type || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await db.saveResult(type, originalText, content);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save result' });
    }
});

app.delete('/api/history/:id', async (req, res) => {
    try {
        await db.deleteResult(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
