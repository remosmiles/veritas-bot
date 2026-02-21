export default async function handler(req, res) {
  // Sicherstellen, dass wir Daten haben
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const prompt = body.prompt;
  
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Du bist Veritas. Antworte brutal ehrlich und ironisch." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) {
        // Falls OpenAI einen Fehler sendet (z.B. kein Guthaben)
        return res.status(200).json({ reply: `OpenAI Fehler: ${data.error.message}` });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ reply: "Verbindung zu OpenAI fehlgeschlagen." });
  }
}
