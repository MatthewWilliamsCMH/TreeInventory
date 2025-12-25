// // server/api/graphql.js
// const { createApp } = require('../server/createApp');

// let appPromise = null;

// // For serverless, we reuse the same instance if possible
// module.exports = async (req, res) => {
//   if (!appPromise) {
//     appPromise = createApp();
//   }
//   const app = await appPromise;

//   // Express apps can be called directly as functions in Vercel
//   app(req, res);
// };

// root/api/graphql.js
export default function handler(req, res) {
  res.status(200).json({ ok: true });
}
