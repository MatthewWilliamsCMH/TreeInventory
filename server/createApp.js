// server/createApp.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

const cloudinary = require('cloudinary').v2;

const { connectDB } = require('./config/connection');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./schemas/resolvers');

let apolloServerStarted = false;

async function createApp() {
  // ---------- ENV ----------
  const isDev = process.env.NODE_ENV === 'development';

  // ---------- DB ----------
  await connectDB();

  // ---------- CLOUDINARY ----------
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // ---------- EXPRESS ----------
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(express.json());

  // ---------- MULTER ----------
  let uploadsDir = null;

  if (isDev) {
    uploadsDir = path.resolve(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }

  const storage = isDev
    ? multer.diskStorage({
        destination: uploadsDir,
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}${path.extname(file.originalname)}`);
        },
      })
    : multer.memoryStorage();

  const upload = multer({ storage });

  // ---------- UPLOAD ROUTE ----------
  if (isDev) {
    app.use('/uploads', express.static(uploadsDir));
  }

  app.post('/uploads', upload.single('photo'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // DEV: disk
    if (isDev) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      return res.json({
        url: `${baseUrl}/uploads/${req.file.filename}`,
      });
    }

    // PROD: Cloudinary
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
      console.error(err);
      res.status(500).json({ message: 'Upload failed' });
    }
  });

  // ---------- APOLLO ----------
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  if (!apolloServerStarted) {
    await apolloServer.start();
    apolloServerStarted = true;
  }

  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ req }),
    })
  );

  console.log('createApp initialized, env:', process.env.NODE_ENV);

  return app;
}

module.exports = { createApp };
