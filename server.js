const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

const GROQ_API_KEY = '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'; 

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/generate', async (req, res) => {
  const { prompt, bahasa } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt kosong' });

  const systemPrompt = `Kamu adalah NOVA_TERMINAL, AI yang jago coding.
User akan minta script/kode. Kamu WAJIB:
- Kasih kode LENGKAP dan WORK
- Bahasa: ${bahasa || 'JavaScript'}
- Gak usah banyak basa-basi
- Langsung kasih kode + penjelasan singkat
- Format pakai markdown code block`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const kode = data.choices[0].message.content;
    res.json({ success: true, kode });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 AI Code Gen: http://localhost:${PORT}`);
});