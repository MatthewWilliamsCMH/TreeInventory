// // server/api/graphql.js
// const { createApp } = require('../server/createApp');

// let appPromise = null;

// // For serverless, we reuse the same instance if possible
// module.exports = async (req, res) => {
//   if (!appPromise) {
//     appPromise = createApp();
//   }
//   const app = await appPromise;

//   // Express apps can be called directly as functions in Vercel
//   app(req, res);
// };

// root/api/graphql.js
// export default function handler(req, res) {
//   res.status(200).json({ ok: true });
// }

// root/api/graphql.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(); // optional: test a collection
    res.status(200).json({ ok: true, db: db.databaseName });
  } catch (e) {
    console.error('DB connection failed:', e);
    res.status(500).json({ error: e.message });
  }
}
