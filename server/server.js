const { createApp } = require('./createApp');
const fs = require('fs');
const path = require('path');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: path.resolve(__dirname, envFile) });

const PORT = process.env.PORT || 3001;

(async () => {
  const app = await createApp();

  app.listen(PORT, () => {
    console.log(`🚀 Dev server running at http://localhost:${PORT}`);
    console.log(`GraphQL: http://localhost:${PORT}/graphql`);
  });
})();
