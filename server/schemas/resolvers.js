const Tree = require('../models/Tree');
const Species = require('../models/Species');
const User = require('../models/User');

const argon2 = require('argon2');

//need to add a query resolver for retrieving hidden trees
const resolvers = {
  Query: {
    getTrees: async () => {
      try {
        return await Tree.find({}).sort({ commonName: 1 });
      } catch (err) {
        console.error(err);
        return [];
      }
    },

    getTree: async (_, { id }) => {
      try {
        return await Tree.findById(id);
      } catch (err) {
        console.error(err);
        return null;
      }
    },

    getSpecies: async () => {
      try {
        return await Species.find().sort({ scientificName: 1 });
      } catch (err) {
        console.error(err);
        return null;
      }
    },

    getSpeciesByCommonName: async (_, { commonName }) => {
      try {
        return await Species.findOne({ commonName });
      } catch (err) {
        console.error(err);
        return null;
      }
    },

    getSpeciesByScientificName: async (_, { scientificName }) => {
      try {
        return await Species.findOne({ scientificName });
      } catch (err) {
        console.error(err);
        return null;
      }
    },
  },

  Tree: {
    species: async (parent) => {
      try {
        return await Species.findOne({ commonName: parent.commonName });
      } catch (err) {
        console.error(err);
        return null;
      }
    },
  },

  Mutation: {
    addTree: async (
      _,
      {
        commonName,
        variety,
        dbh,
        photos,
        notes,
        location,
        garden,
        siteInfo,
        lastUpdated,
        installedDate,
        installedBy,
        felledDate,
        felledBy,
        careNeeds,
        hidden,
      }
    ) => {
      try {
        const speciesExists = await Species.findOne({ commonName });
        if (!speciesExists) {
          throw new Error(`Species with common name '${commonName}' not found.`);
        }
        return await Tree.create({
          commonName,
          variety,
          dbh,
          photos,
          notes,
          location,
          garden,
          siteInfo,
          lastUpdated,
          installedDate,
          installedBy,
          felledDate,
          felledBy,
          careNeeds,
          hidden: hidden || false,
        });
      } catch (err) {
        console.error(err);
        return null;
      }
    },

    updateTree: async (
      _,
      {
        id,
        commonName,
        variety,
        dbh,
        photos,
        notes,
        garden,
        siteInfo,
        lastUpdated,
        installedDate,
        installedBy,
        felledDate,
        felledBy,
        careNeeds,
        hidden,
      }
    ) => {
      try {
        if (commonName) {
          const speciesExists = await Species.findOne({ commonName });
          if (!speciesExists) {
            throw new Error(`Species with common name '${commonName}' not found.`);
          }
        }
        return await Tree.findByIdAndUpdate(
          id,
          {
            commonName,
            variety,
            dbh,
            photos,
            notes,
            garden,
            siteInfo,
            lastUpdated,
            installedDate,
            installedBy,
            felledDate,
            felledBy,
            careNeeds,
            hidden,
          },
          { new: true }
        );
      } catch (err) {
        console.error(err);
        return null;
      }
    },

    updateTreeLocation: async (_, { id, location }) => {
      try {
        return await Tree.findByIdAndUpdate(
          id,
          {
            location,
          },
          { new: true }
        );
      } catch (err) {
        console.error(err);
        return null;
      }
    },

    addSpecies: async (
      _,
      { family, commonName, scientificName, nonnative, invasive, markerColor }
    ) => {
      try {
        const existingSpecies = await Species.findOne({
          $or: [{ commonName }, { scientificName }],
        });

        if (existingSpecies) {
          throw new Error(
            `Species already exists with common name '${existingSpecies.commonName}' or scientific name '${existingSpecies.scientificName}'`
          );
        }

        return await Species.create({
          family,
          commonName,
          scientificName,
          nonnative,
          invasive,
          markerColor,
        });
      } catch (err) {
        console.error(err);
        return null;
      }
    },

    updateSpecies: async (
      _,
      { id, family, commonName, scientificName, nonnative, invasive, markerColor }
    ) => {
      try {
        const existingSpecies = await Species.findOne({
          _id: { $ne: id },
          $or: [{ commonName }, { scientificName }],
        });

        if (existingSpecies) {
          throw new Error(
            `Another species already exists with common name '${existingSpecies.commonName}' or scientific name '${existingSpecies.scientificName}'`
          );
        }

        return await Species.findByIdAndUpdate(
          id,
          {
            family,
            commonName,
            scientificName,
            nonnative,
            invasive,
            markerColor,
          },
          { new: true }
        );
      } catch (err) {
        console.error(err);
        return null;
      }
    },

    loginUser: async (_, { userName, userPassword }) => {
      try {
        console.log('Resolver received:', userName, userPassword);
        const user = await User.findOne({ userName: userName });
        if (!user) {
          throw new Error('Invalid username or password');
        }

        const isValid = await argon2.verify(user.userPassword, userPassword);
        if (!isValid) {
          throw new Error('Invalid username or password');
        }

        return {
          userName: user.userName,
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    },

    deletePhoto: async (_, { publicId }) => {
      const path = require('path');
      const fs = require('fs');
      const filePath = path.join(__dirname, '../../uploads', publicId);

      try {
        await fs.promises.unlink(filePath);
        return true;
      } catch (err) {
        console.error('Error deleting photo:', err);
        return false;
      }
    },
  },
};

module.exports = { resolvers };
