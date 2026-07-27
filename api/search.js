const CLASS_CODE = process.env.CLASS_ACCESS_CODE;

// Best-effort in-memory cache — survives within one warm serverless instance,
// cuts down repeat Google/Wikipedia calls for the same term during a class period.
const cache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

function isAuthorized(req) {
  if (!CLASS_CODE) return false;
  return req.headers["x-class-code"] === CLASS_CODE;
}

function getCached(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.time > CACHE_TTL_MS) { cache.delete(key); return null; }
  return hit.value;
}
function setCached(key, value) {
  cache.set(key, { value, time: Date.now() });
  if (cache.size > 300) cache.delete(cache.keys().next().value); // crude eviction
}

async function fetchWikipediaSummary(q) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
  const wikiRes = await fetch(url, { headers: { "User-Agent": "LahiQuest/1.0 (school project)" } });
  if (!wikiRes.ok) return null;
  const data = await wikiRes.json();
  return {
    title: data.title,
    extract: data.extract,
    thumbnail: data.thumbnail?.source || null
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!isAuthorized(req)) return res.status(401).json({ error: "Missing or invalid class code" });

  const { q, type } = req.query;
  if (!q || typeof q !== "string" || q.length > 150) {
    return res.status(400).json({ error: "Invalid query" });
  }

  const cacheKey = `${type || "img"}:${q.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return res.status(200).json(cached);

  try {
    // Wikipedia is curated and generally safe for a classroom — prefer it always.
    const wiki = await fetchWikipediaSummary(q);

    if (type === "wiki") {
      const payload = wiki || { title: q, extract: null, thumbnail: null };
      setCached(cacheKey, payload);
      return res.status(200).json(payload);
    }

    if (wiki?.thumbnail) {
      const payload = { imageUrl: wiki.thumbnail, extract: wiki.extract };
      setCached(cacheKey, payload);
      return res.status(200).json(payload);
    }

    // Only fall back to Google Image Search for abstract terms Wikipedia has no
    // picture for — with Safe Search forced on, since results aren't reviewed.
    const googleKey = process.env.GOOGLE_API_KEY;
    const googleCx = process.env.GOOGLE_CX;
    if (googleKey && googleCx) {
      const googleUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(q + " Philippine history")}&cx=${googleCx}&key=${googleKey}&searchType=image&num=1&safe=active`;
      const gRes = await fetch(googleUrl);
      if (gRes.ok) {
        const gData = await gRes.json();
        const imageUrl = gData.items?.[0]?.link || null;
        const payload = { imageUrl, extract: wiki?.extract || null };
        setCached(cacheKey, payload);
        return res.status(200).json(payload);
      }
    }

    const payload = { imageUrl: null, extract: wiki?.extract || null };
    setCached(cacheKey, payload);
    return res.status(200).json(payload);
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ error: "Search failed" });
  }
}
