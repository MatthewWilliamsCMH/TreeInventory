// server/server.js
const fs = require('fs');
const path = require('path');
const { createApp } = require('./createApp');

// Load correct .env file
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: path.resolve(__dirname, envFile) });

const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV === 'development';

// Local dev server
if (isDev) {
  (async () => {
    const app = await createApp();
    app.listen(PORT, () => {
      console.log(`🚀 Dev server running at http://localhost:${PORT}`);
      console.log(`GraphQL: http://localhost:${PORT}/graphql`);
    });
  })();
}

// For Vercel serverless function
if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    const app = await createApp();
    app(req, res);
  };
}
