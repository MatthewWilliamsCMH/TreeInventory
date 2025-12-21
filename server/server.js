//----------Import----------
//external libraries
const { ApolloServer } = require('@apollo/server');
const express = require('express');
const { expressMiddleware } = require('@apollo/server/express4');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const multer = require('multer');
const path = require('path');

//local components
const { connectDB } = require('./config/connection');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./schemas/resolvers');

//establish environment and load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: envFile });

//initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//initialize express instance and localhost port
const app = express();
const port = process.env.PORT || 3001;

//configure multer storage
const isDev = process.env.NODE_ENV === 'development';

// Define uploads directory ONLY for development
let uploadsDir = null;

if (isDev) {
  uploadsDir = path.resolve(__dirname, '../uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

const storage = isDev
  ? multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const newFilename = Date.now() + path.extname(file.originalname);
        cb(null, newFilename);
      },
    })
  : multer.memoryStorage();

const upload = multer({ storage });

const getAllowedOrigins = () => {
  const origins = [];
  origins.push('https://localhost:3000');
  if (process.env.NODE_ENV === 'production') {
    origins.push('https://treeinventory.clickps.synology.me');
  }
  return origins;
};

app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
  })
);

app.use(express.json());

//set up uploads route
if (isDev) {
  app.use('/uploads', express.static(uploadsDir));
}

app.post('/uploads', upload.single('photo'), async (req, res) => {
  console.log('File upload request received');

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  //development endpoint for file uploads (disk)
  if (isDev) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    return res.status(200).json({
      message: 'File uploaded successfully',
      url: fileUrl,
    });
  }

  //production endpoint for file uploads (Cloudinary)
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'tree-inventory' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.status(200).json({
      message: 'File uploaded successfully',
      url: result.secure_url,
    });
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Connect to db
connectDB();

// Initialize apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.start().then(() => {
  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    })
  );

  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'demo') {
    let clientPath;
    if (process.env.NODE_ENV === 'production') {
      clientPath = path.join(__dirname, '../client/dist');
    } else {
      clientPath = path.join(__dirname, '../dist');
    }

    app.use(express.static(clientPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientPath, 'index.html'));
    });
  }

  const certPath = path.resolve(__dirname, '../localhost.pem');
  const keyPath = path.resolve(__dirname, '../localhost-key.pem');

  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'demo') {
    let clientPath;
    if (process.env.NODE_ENV === 'production') {
      clientPath = path.join(__dirname, '../client/dist');
    } else {
      clientPath = path.join(__dirname, '../dist');
    }

    app.use(express.static(clientPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientPath, 'index.html'));
    });

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
      console.log(`GraphQL endpoint: https://localhost:${port}/graphql`);
      console.log(`Uploads directory: ${uploadsDir}`);
    });
  } else {
    //serve with HTTPS in development
    const httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };

    https.createServer(httpsOptions, app).listen(port, () => {
      console.log(`🚀 Dev server running at https://localhost:${port}`);
      console.log(`GraphQL endpoint: https://localhost:${port}/graphql`);
      console.log(`Uploads directory: ${uploadsDir}`);
    });
  }
});
