export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q, type } = req.query;
  if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" });

  try {
    // 1. Wikipedia Direct Lookup (Portraits & Summaries)
    if (type === "wiki") {
      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
      const wikiRes = await fetch(wikiUrl, {
        headers: { "User-Agent": "LahiQuest/1.0 (https://lahiquest.vercel.app)" }
      });
      if (wikiRes.ok) {
        const data = await wikiRes.json();
        return res.status(200).json({
          title: data.title,
          extract: data.extract,
          thumbnail: data.thumbnail?.source || null
        });
      }
    }

    // 2. Google Custom Search Image Lookup
    const googleKey = process.env.GOOGLE_API_KEY;
    const googleCx = process.env.GOOGLE_CX;

    if (googleKey && googleCx) {
      const googleUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(q + " Philippine history")}&cx=${googleCx}&key=${googleKey}&searchType=image&num=1`;
      const gRes = await fetch(googleUrl);
      if (gRes.ok) {
        const gData = await gRes.json();
        const imageUrl = gData.items?.[0]?.link || null;
        if (imageUrl) {
          return res.status(200).json({ imageUrl });
        }
      }
    }

    // Fallback: Query Wikipedia REST API for image
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
    const wikiRes = await fetch(wikiUrl, {
      headers: { "User-Agent": "LahiQuest/1.0 (https://lahiquest.vercel.app)" }
    });
    if (wikiRes.ok) {
      const data = await wikiRes.json();
      return res.status(200).json({
        imageUrl: data.thumbnail?.source || null,
        extract: data.extract || null
      });
    }

    return res.status(200).json({ imageUrl: null, extract: null });
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ error: "Search failed" });
  }
}
