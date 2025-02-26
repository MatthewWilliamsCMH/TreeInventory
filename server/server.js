const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');

const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : process.env.NODE_ENV === 'demo' 
    ? '.env.demo' 
    : '.env.development';

require('dotenv').config({ path: envFile });

const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const { connectDB } = require('./config/connection');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./schemas/resolvers');

const app = express();
const port = process.env.PORT || 3001; //use host (e.g., Render) port or 3001

const storage = multer.diskStorage({
  destination: (req, photo, cb) => {
    cb(null, uploadsDir); //save to /public/uploads
  },
  filename: (req, photo, cb) => {
    cb(null, Date.now() + path.extname(photo.originalname)); //rename the file to avoid conflicts
  }
});

//initialize multer with the storage configuration
const upload = multer({ storage: storage });

const getAllowedOrigins = () => {
  const origins = [];
  
  // Always include localhost for development testing
  origins.push('http://localhost:3000');
  
  // Add environment-specific origins
  if (process.env.NODE_ENV === 'production') {
    origins.push('https://treeinventory.clickps.synology.me');
  } else if (process.env.NODE_ENV === 'demo') {
    // Add Render.com URL
    origins.push('https://treeinventory.onrender.com');
  }
  
  return origins;
};

app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.post('/uploads', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  let baseUrl;
  if (process.env.NODE_ENV === 'production') {
    baseUrl = 'https://treeinventory.clickps.synology.me';
  }
  else if (process.env.NODE_ENV === 'demo') {
    baseUrl = 'https://treeinventory.onrender.com';
  }
  else {
    baseUrl = `${req.protocol}://${req.get('host')}`;
  }

  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
  res.status(200).json({ 
    message: 'File uploaded successfully',
    url: fileUrl
  });
});

//connect to db
connectDB();

//initialize apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.start().then(() => {
  app.use('/graphql', 
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ req })
    })
  );

  //serve the static React files after build (production, demo[?])
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'demo') {
    // Determine the correct path to the built client files
    let clientPath;
    if (process.env.NODE_ENV === 'production') {
      // For NAS deployment
      clientPath = path.join(__dirname, '../client/dist');
    } else {
      // For Render.com deployment
      clientPath = path.join(__dirname, '../client/dist');
    }
    
    app.use(express.static(clientPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
    console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
  });
});