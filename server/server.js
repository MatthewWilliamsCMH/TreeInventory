// server/server.js
const fs = require('fs');
const https = require('https');
const path = require('path');

const { createApp } = require('./createApp');

// ---------- ENV ----------
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

require('dotenv').config({ path: envFile });

const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV === 'development';

// ---------- START ----------
(async () => {
  const app = await createApp();

  if (isDev) {
    // HTTPS for local dev
    const certPath = path.resolve(__dirname, '../localhost.pem');
    const keyPath = path.resolve(__dirname, '../localhost-key.pem');

    // const httpsOptions = {
    //   key: fs.readFileSync(keyPath),
    //   cert: fs.readFileSync(certPath),
    // };

    // https.createServer(httpsOptions, app).listen(PORT, () => {
    //   console.log(`🚀 Dev server running at https://localhost:${PORT}`);
    //   console.log(`GraphQL: https://localhost:${PORT}/graphql`);
    // });
    app.listen(PORT, () => {
      console.log(`🚀 Dev server running at http://localhost:${PORT}`);
    });
  } else {
    // HTTP for prod / NAS / Vercel
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`GraphQL: http://localhost:${PORT}/graphql`);
    });
  }
})();
