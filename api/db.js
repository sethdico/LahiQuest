import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  if (!uri) throw new Error("MONGODB_URI environment variable is missing.");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("lahiquest");
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    if (req.method === "GET") {
      const { username } = req.query;
      if (username) {
        const userDoc = await usersCollection.findOne({ username });
        return res.status(200).json(userDoc ? userDoc.data : null);
      } else {
        // Fetch all users for the Teacher Dashboard
        const allDocs = await usersCollection.find({}).toArray();
        const dbMap = {};
        allDocs.forEach((doc) => {
          dbMap[doc.username] = doc.data;
        });
        return res.status(200).json(dbMap);
      }
    } else if (req.method === "POST") {
      const { username, data } = req.body || {};
      if (!username || !data) {
        return res.status(400).json({ error: "Missing username or data" });
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
    console.error("MongoDB Server Error:", err);
    return res.status(500).json({ error: err.message });
  }
          }
