//used ONLY for development/localhost express server
//----------Import----------
//external libraries
const path = require('path');

//local components
const { createApp } = require('./createApp');

require('dotenv').config({ path: path.resolve(__dirname, '.env.development') });

//define local variables and set to default values
const PORT = 3001; //this can be set to an environment variable with 3001 as a fallback if needed in the future

//----------Initialize and Start Server----------
(async () => {
  const app = await createApp();

  app.listen(PORT, () => {
    console.log(`🚀 Dev server running at http://localhost:${PORT}`);
    console.log(`🚀 GraphQL ready at http://localhost:${PORT}`);
  });
})();
