//***REMOVED***
// transform_photos_dry_run.js
const mongoose = require('mongoose');
const path = require('path');
const Tree = require('./models/Tree'); // adjust path if needed

// Replace with your MongoDB connection string
const MONGODB_URI =
  'mongodb+srv://matthewwilliamscmh:jLqTqJtYZuSszry0@nas.xz170.mongodb.net/treeinventory_prod?retryWrites=true&w=majority';

async function transformPhotos(dryRun = false) {
  try {
    await mongoose.connect(MONGODB_URI, {
      // options no longer needed in driver v4+
    });
    console.log('Connected to MongoDB');

    const trees = await Tree.find({});
    console.log(`Found ${trees.length} trees.`);

    for (const tree of trees) {
      if (!tree.photos) continue;

      const transformedPhotos = {};

      for (const key of ['bark', 'summerLeaf', 'autumnLeaf', 'fruit', 'flower', 'environs']) {
        const url = tree.photos[key];
        let publicId = '';

        if (url) {
          try {
            const parsed = path.parse(new URL(url).pathname);
            publicId = parsed.name;
          } catch (err) {
            console.error(`Invalid URL for tree ${tree._id}, key ${key}: ${url}`);
          }
        }

        transformedPhotos[key] = url ? { url, publicId } : null;
      }

      console.log(`Tree ID: ${tree._id}`);
      console.log('Original photos:', tree.photos);
      console.log('Transformed photos:', transformedPhotos);
      console.log('-------------------------');

      if (!dryRun) {
        // Uncomment to actually update the database
        await Tree.findByIdAndUpdate(tree._id, { photos: transformedPhotos });
      }
    }

    console.log('Dry run complete. No changes were made.');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

transformPhotos(false); // pass 'false' to apply changes
