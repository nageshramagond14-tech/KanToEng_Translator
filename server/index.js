const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main translation endpoint
app.post('/api/translate', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text represents the string to translate and is required.' });
        }

        // We use the public Google Translate API endpoint (free, no key required).
        // sl = kn (Kannada source language)
        // tl = en (English target language)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=kn&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await axios.get(url);
        
        // The API returns nested arrays containing translation fragments.
        // E.g., [[["Hello", "ನಮಸ್ಕಾರ", null, null, 10]], ...]
        let translatedText = '';
        if (response.data && response.data[0]) {
            response.data[0].forEach((fragment) => {
                if (fragment[0]) translatedText += fragment[0];
            });
        }
        
        res.json({ translation: translatedText.trim() });
    } catch (error) {
        console.error('Translation error:', error.message);
        res.status(500).json({ error: 'Failed to translate' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
    res.send('Kannada to English Translator API is running! Use POST /api/translate to translate text.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
