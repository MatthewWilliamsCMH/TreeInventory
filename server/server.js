//this works for production; test uploading photos on localhost and render
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Select environment-specific .env file
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : process.env.NODE_ENV === 'demo'
  ? '.env.demo'
  : '.env.development';

// Load environment variables from the appropriate file
require('dotenv').config({ path: envFile });

// Define the uploads directory based on environment - use explicit paths
let uploadsDir;
if (process.env.NODE_ENV === 'production') {
  // Use the path that matches your Docker volume mapping
  uploadsDir = '/app/public/uploads';
  console.log('Running in PRODUCTION mode - using mapped volume path:', uploadsDir);
} else if (process.env.NODE_ENV === 'demo') {
  uploadsDir = path.join(__dirname, 'public', 'uploads');
  console.log('Running in DEMO mode - using path:', uploadsDir);
} else {
  uploadsDir = path.join(__dirname, 'public', 'uploads');
  console.log('Running in DEVELOPMENT mode - using path:', uploadsDir);
}

// Diagnostic logging - check environment variables
console.log('NODE_ENV value:', process.env.NODE_ENV);
console.log('Upload directory set to:', uploadsDir);

// Test directory access and creation
try {
  if (!fs.existsSync(uploadsDir)) {
    console.log(`Directory ${uploadsDir} does not exist, trying to create it...`);
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`Successfully created directory: ${uploadsDir}`);
    } catch (dirCreateError) {
      console.error(`ERROR creating directory ${uploadsDir}:`, dirCreateError);
      // Fallback to a directory we know will work
      uploadsDir = path.join(__dirname, 'public', 'uploads');
      console.log(`Falling back to container path: ${uploadsDir}`);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
    }
  } else {
    // Test write permissions by creating a test file
    try {
      const testFile = path.join(uploadsDir, 'test-permissions.txt');
      fs.writeFileSync(testFile, 'Testing write permissions');
      console.log(`Successfully wrote test file to ${testFile}`);
      fs.unlinkSync(testFile); // Clean up the test file
      console.log('Directory is writable!');
    } catch (writeError) {
      console.error('ERROR: Directory exists but is not writable:', writeError);
      // Fallback to a directory we know will work
      uploadsDir = path.join(__dirname, 'public', 'uploads');
      console.log(`Falling back to container path: ${uploadsDir}`);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
    }
  }
} catch (error) {
  console.error('ERROR checking directory:', error);
  // Fallback to a directory we know will work
  uploadsDir = path.join(__dirname, 'public', 'uploads');
  console.log(`Falling back to container path: ${uploadsDir}`);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

const { connectDB } = require('./config/connection');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./schemas/resolvers');

const app = express();
const port = process.env.PORT || 3001;

// Configure multer storage with explicit logging
const storage = multer.diskStorage({
  destination: (req, photo, cb) => {
    console.log(`Multer saving file to: ${uploadsDir}`);
    cb(null, uploadsDir);
  },
  filename: (req, photo, cb) => {
    const newFilename = Date.now() + path.extname(photo.originalname);
    console.log(`New filename will be: ${newFilename}`);
    cb(null, newFilename);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

const getAllowedOrigins = () => {
  const origins = [];
  origins.push('http://localhost:3000');
  if (process.env.NODE_ENV === 'production') {
    origins.push('https://treeinventory.clickps.synology.me');
  } else if (process.env.NODE_ENV === 'demo') {
    origins.push('https://treeinventory.onrender.com');
  }
  return origins;
};

app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true
}));

app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

app.post('/uploads', upload.single('photo'), (req, res) => {
  console.log('File upload request received');
  
  if (!req.file) {
    console.log('No file was uploaded');
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  console.log('File uploaded:', req.file);
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
  console.log('Generated file URL:', fileUrl);
  
  res.status(200).json({
    message: 'File uploaded successfully',
    url: fileUrl
  });
});

// Connect to db
connectDB();

// Initialize apollo server
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
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
    console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
    console.log(`Uploads directory: ${uploadsDir}`);
  });
});

// const express = require('express');
// const { ApolloServer } = require('@apollo/server');
// const { expressMiddleware } = require('@apollo/server/express4');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');
// const fs = require('fs');
// 
// const envFile = process.env.NODE_ENV === 'production' 
//   ? '.env.production' 
//   : process.env.NODE_ENV === 'demo' 
//     ? '.env.demo' 
//     : '.env.development';
// 
// require('dotenv').config({ path: envFile });
// 
// const uploadsDir = path.join(__dirname, 'public', 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }
// 
// const { connectDB } = require('./config/connection');
// const { typeDefs } = require('./schemas/typeDefs');
// const { resolvers } = require('./schemas/resolvers');
// 
// const app = express();
// const port = process.env.PORT || 3001; //use host (e.g., Render) port or 3001
// 
// const storage = multer.diskStorage({
//   destination: (req, photo, cb) => {
//     cb(null, uploadsDir); //save to /public/uploads
//   },
//   filename: (req, photo, cb) => {
//     cb(null, Date.now() + path.extname(photo.originalname)); //rename the file to avoid conflicts
//   }
// });
// 
// //initialize multer with the storage configuration
// const upload = multer({ storage: storage });
// 
// const getAllowedOrigins = () => {
//   const origins = [];
//   
//   // Always include localhost for development testing
//   origins.push('http://localhost:3000');
//   
//   // Add environment-specific origins
//   if (process.env.NODE_ENV === 'production') {
//     origins.push('https://treeinventory.clickps.synology.me');
//   } else if (process.env.NODE_ENV === 'demo') {
//     // Add Render.com URL
//     origins.push('https://treeinventory.onrender.com');
//   }
//   
//   return origins;
// };
// 
// app.use(cors({
//   origin: getAllowedOrigins(),
//   credentials: true
// }));
// 
// app.use(express.json());
// app.use('/uploads', express.static(uploadsDir));
// 
// app.post('/uploads', upload.single('photo'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }
// 
//   let baseUrl;
//   if (process.env.NODE_ENV === 'production') {
//     baseUrl = 'https://treeinventory.clickps.synology.me';
//   }
//   else if (process.env.NODE_ENV === 'demo') {
//     baseUrl = 'https://treeinventory.onrender.com';
//   }
//   else {
//     baseUrl = `${req.protocol}://${req.get('host')}`;
//   }
// 
//   const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
//   res.status(200).json({ 
//     message: 'File uploaded successfully',
//     url: fileUrl
//   });
// });
// 
// //connect to db
// connectDB();
// 
// //initialize apollo server
// const server = new ApolloServer({
//   typeDefs,
//   resolvers
// });
// 
// server.start().then(() => {
//   app.use('/graphql', 
//     express.json(),
//     expressMiddleware(server, {
//       context: async ({ req }) => ({ req })
//     })
//   );
// 
//   //serve the static React files after build (production, demo[?])
//   if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'demo') {
//     // Determine the correct path to the built client files
//     let clientPath;
//     if (process.env.NODE_ENV === 'production') {
//       // For NAS deployment
//       clientPath = path.join(__dirname, '../client/dist');
//     } else {
//       // For Render.com deployment
//       clientPath = path.join(__dirname, '../dist');
//     }
//     
//     app.use(express.static(clientPath));
//     app.get('*', (req, res) => {
//       res.sendFile(path.join(clientPath, 'index.html'));
//     });
//   }
// 
//   app.listen(port, '0.0.0.0', () => {
//     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
//     console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
//   });
// });