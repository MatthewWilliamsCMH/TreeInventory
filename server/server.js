const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');

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
    cb(null, path.join(__dirname, 'public', 'uploads')); //save to /public/uploads
  },
  filename: (req, photo, cb) => {
    cb(null, Date.now() + path.extname(photo.originalname)); //rename the file to avoid conflicts
  }
});

//initialize multer with the storage configuration
const upload = multer({ storage: storage });

app.use(cors({
  origin: ['https://treeinventory.onrender.com', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.post('/uploads', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
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
    cors({
      origin: ['https://treeinventory.onrender.com', 'http://localhost:3000'],
      credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ req })
    })
  );

  //serve the static React files after build (production)
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
});