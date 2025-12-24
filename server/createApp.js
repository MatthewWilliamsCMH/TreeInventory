// server/createApp.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cloudinary = require('cloudinary').v2;

const { connectDB } = require('./config/connection');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./schemas/resolvers');

let apolloServerStarted = false;

async function createApp() {
  console.log('Environment:', process.env.NODE_ENV);

  // ---------- DATABASE ----------
  await connectDB();

  // ---------- CLOUDINARY ----------
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // ---------- EXPRESS ----------
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  // ---------- MULTER ----------
  const upload = multer({ storage: multer.memoryStorage() }); // Always memory (Cloudinary only)

  // ---------- UPLOAD ROUTE ----------
  app.post('/uploads', upload.single('photo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'tree-inventory' },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      res.json({ url: result.secure_url });
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      res.status(500).json({ message: 'Upload failed' });
    }
  });

  // ---------- APOLLO SERVER ----------
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  if (!apolloServerStarted) {
    await apolloServer.start();
    apolloServerStarted = true;
  }

  app.use('/graphql', expressMiddleware(apolloServer, { context: async ({ req }) => ({ req }) }));

  console.log('createApp initialized');

  return app;
}

module.exports = { createApp };
