// server/createApp.js
const cors = require('cors');
const express = require('express');
const multer = require('multer');
const path = require('path');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cloudinary = require('cloudinary').v2;

const { connectDB } = require('./config/connection');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./schemas/resolvers');

//determine which folder received uploaded images based on environment
const isProd = process.env.NODE_ENV === 'production';
const baseFolder = isProd ? 'tree-inventory/prod' : 'tree-inventory/dev';

// Cache ApolloServer instance to avoid double-starts (dev + serverless)
let apolloServer;

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
  app.post('/api/uploads', upload.single('photo'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const originalName = path.parse(req.file.originalname).name;

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: baseFolder,
            public_id: originalName,
            overwrite: true,
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );

        stream.end(req.file.buffer);
      });

      res.json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      res.status(500).json({ message: 'Upload failed' });
    }
  });

  // ---------- APOLLO SERVER ----------
  if (!apolloServer) {
    apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();
  }

  app.use(
    '/',
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ req }),
    })
  );

  console.log('createApp initialized');

  return app;
}

module.exports = { createApp };
