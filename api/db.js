import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const CLASS_CODE = process.env.CLASS_ACCESS_CODE; // set this in Vercel env vars

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) return { client: cachedClient, db: cachedDb };
  if (!uri) throw new Error("MONGODB_URI environment variable is missing.");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("lahiquest");
  // Uniqueness at the DB level, not just app logic — safe to call every cold start.
  await db.collection("users").createIndex({ username: 1 }, { unique: true });
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

function isAuthorized(req) {
  if (!CLASS_CODE) return false; // fail closed if the code isn't configured
  const provided = req.headers["x-class-code"];
  return typeof provided === "string" && provided === CLASS_CODE;
}

function sanitizeUsername(name) {
  if (typeof name !== "string") return null;
  const trimmed = name.trim().slice(0, 40);
  if (!trimmed || /[${}]/.test(trimmed)) return null; // block obvious NoSQL-operator injection attempts
  return trimmed;
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    // Deliberately generic — don't reveal whether the class code exists or is wrong.
    return res.status(401).json({ error: "Missing or invalid class code" });
  }

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    if (req.method === "GET") {
      const rawUsername = req.query.username;
      if (rawUsername) {
        const username = sanitizeUsername(rawUsername);
        if (!username) return res.status(400).json({ error: "Invalid username" });
        const userDoc = await usersCollection.findOne({ username });
        return res.status(200).json(userDoc ? { data: userDoc.data, updatedAt: userDoc.updatedAt } : null);
      }
      // Full roster — only for the teacher dashboard, still requires the class code above.
      const allDocs = await usersCollection.find({}).limit(200).toArray();
      const dbMap = {};
      allDocs.forEach((doc) => { dbMap[doc.username] = { data: doc.data, updatedAt: doc.updatedAt }; });
      return res.status(200).json(dbMap);

    } else if (req.method === "POST") {
      const { username: rawUsername, data } = req.body || {};
      const username = sanitizeUsername(rawUsername);
      if (!username || !data || typeof data !== "object") {
        return res.status(400).json({ error: "Missing or invalid username/data" });
      }
      if (JSON.stringify(data).length > 20000) {
        return res.status(413).json({ error: "Payload too large" });
      }
      await usersCollection.updateOne(
        { username },
        { $set: { username, data, updatedAt: new Date() } },
        { upsert: true }
      );
      return res.status(200).json({ success: true });

    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error("MongoDB server error:", err);
    return res.status(500).json({ error: "Database request failed" });
  }
}
