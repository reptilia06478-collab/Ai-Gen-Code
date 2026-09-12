
const GROQ_API_KEY = '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'; 

async function generate() {
  const prompt = document.getElementById('prompt').value.trim();
  const bahasa = document.getElementById('bahasa').value;
  if (!prompt) return alert('Ketik prompt dulu!');

  document.getElementById('loading').style.display = 'block';
  document.getElementById('output').style.display = 'none';

  const systemPrompt = `Kamu adalah NOVA_TERMINAL, AI yang jago coding.
User akan minta script/kode. Kamu WAJIB:
- Kasih kode LENGKAP dan WORK
- Bahasa: ${bahasa}
- Gak usah banyak basa-basi
- Langsung kasih kode + penjelasan singkat`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    const data = await res.json();
    document.getElementById('loading').style.display = 'none';

    if (data.error) {
      alert('Error: ' + data.error.message);
      return;
    }

    document.getElementById('kode').textContent = data.choices[0].message.content;
    document.getElementById('output').style.display = 'block';
  } catch (e) {
    document.getElementById('loading').style.display = 'none';
    alert('Error: ' + e.message);
  }
}

function copyKode() {
  const kode = document.getElementById('kode').textContent;
  navigator.clipboard.writeText(kode);
  alert('✅ Kode dicopy!');
}
