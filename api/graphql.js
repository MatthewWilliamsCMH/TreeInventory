//used ONLY for production/Vercel serverless entry
//----------Import----------
//local components
const { createApp } = require('../server/createApp');

//define appPromise so that it can be reused across requests rather than recreating the app each time
let appPromise = null;

module.exports = async (req, res) => {
  if (!appPromise) {
    appPromise = createApp();
  }
  const app = await appPromise;
  app(req, res);
};
