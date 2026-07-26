// Vercel Serverless Function — keeps the OpenRouter key server-side only.
// Deploy this repo to Vercel, then in Project Settings → Environment Variables
// add: OPENROUTER_API_KEY = <your key>
// Never put the key in index.html or any file that ships to the browser.

const MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    res.status(500).json({ error: "Server missing OPENROUTER_API_KEY" });
    return;
  }

  const { prompt, temperature } = req.body || {};
  if (!prompt || typeof prompt !== "string" || prompt.length > 6000) {
    res.status(400).json({ error: "Invalid prompt" });
    return;
  }

  const safeTemp = typeof temperature === "number"
    ? Math.min(1, Math.max(0, temperature))
    : 0.4;

  try {
    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: safeTemp,
      }),
    });

    if (!upstream.ok) {
      res.status(502).json({ error: "Upstream AI request failed" });
      return;
    }

    const data = await upstream.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: "AI request failed" });
  }
}
