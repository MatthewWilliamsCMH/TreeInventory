const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");

const uploadsDir = path.join(__dirname, "public", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const { connectDB } = require("./config/connection");
const { typeDefs } = require("./schemas/typeDefs");
const { resolvers } = require("./schemas/resolvers");

const app = express();
const port = process.env.PORT || 3001; //use host (e.g., Render) port or 3001

const storage = multer.diskStorage({
  destination: (req, photo, cb) => {
    cb(null, path.join(__dirname, "public", "uploads")); // Save to /public/uploads
  },
  filename: (req, photo, cb) => {
    cb(null, Date.now() + path.extname(photo.originalname)); // Rename the file to avoid conflicts
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// app.use(cors({origin: "https://https://treeinventory.onrender.com"}));
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

app.post("/uploads", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
// const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.status(200).json({ 
    message: "File uploaded successfully",
    url: fileUrl
  });
});

//connect to db
connectDB();

//establish apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.start().then(() => {
  app.use("/graphql", expressMiddleware(server));

  // Serve the static React files after build (Production)
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist"))); // Vite build output
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
});