/**
 * migrate-photo-urls-to-cloudinary.js
 *
 * Replaces old Synology URLs in MongoDB with Cloudinary URLs.
 * Fully robust for nested photo objects.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config({ path: '.env.development' });

// ======================== CONFIG ========================
const DB_NAME = 'treeinventory_dev'; // database to update
const DRY_RUN = false; // set to false to actually write changes
const PHOTO_KEYS = ['bark', 'summerLeaf', 'autumnLeaf', 'fruit', 'flower', 'environs'];
const CLOUDINARY_FOLDER = 'tree-inventory';

// ======================== CLOUDINARY ========================
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ======================== MONGODB ========================
const mongoUri = process.env.MONGODB_URI; // full URI
const treeSchema = new mongoose.Schema({}, { strict: false });
const Tree = mongoose.model('Tree', treeSchema, 'trees');

// ======================== HELPERS ========================
/**
 * Extracts filename from any URL, robust to slight variations
 */
function extractFilename(url) {
  if (!url) return null;
  const idx = url.lastIndexOf('/');
  if (idx === -1) return null;
  return url.substring(idx + 1); // e.g., 1753824091030.jpg
}

/**
 * Builds Cloudinary URL from filename
 */
function buildCloudinaryUrl(filename) {
  if (!filename) return null;
  const base = filename.replace(/\.[^/.]+$/, ''); // strip extension
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${CLOUDINARY_FOLDER}/${base}`;
}

// ======================== MAIN ========================
async function migrate() {
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB');
  console.log('Resolved mongoUri:', mongoUri);
  console.log('DB_NAME:', DB_NAME);

  const trees = await Tree.find({});
  console.log('Total trees fetched:', trees.length);

  let scanned = 0;
  let updated = 0;
  let missing = 0;

  for (const tree of trees) {
    scanned++;
    let changed = false;

    if (!tree.photos) continue;

    for (const key of PHOTO_KEYS) {
      const oldUrl = tree.photos[key];
      if (!oldUrl) continue;

      const filename = extractFilename(oldUrl);
      if (!filename) {
        missing++;
        console.warn(`⚠ Could not extract filename from: ${oldUrl}`);
        continue;
      }

      const cloudUrl = buildCloudinaryUrl(filename);
      if (!cloudUrl) {
        missing++;
        console.warn(`⚠ Could not build Cloudinary URL for: ${oldUrl}`);
        continue;
      }

      if (oldUrl !== cloudUrl) {
        console.log(`Replacing [${key}]: ${oldUrl} → ${cloudUrl}`);
        tree.photos[key] = cloudUrl;
        changed = true;
      }
    }

    if (changed) {
      tree.markModified('photos'); // <- critical fix for nested object updates
      updated++;
      if (!DRY_RUN) {
        await tree.save();
      }
    }
  }

  console.log('\n========== SUMMARY ==========');
  console.log('Trees scanned:', scanned);
  console.log('Trees updated:', updated);
  console.log('Missing or skipped:', missing);
  console.log('Mode:', DRY_RUN ? 'DRY RUN (no changes saved)' : 'LIVE (changes written)');
  console.log('============================\n');

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
