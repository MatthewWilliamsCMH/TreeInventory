const Tree = require('../models/Tree');
const Species = require('../models/Species');

//need to add a query resolver for retrieving hidden trees
const resolvers = {
  Query: {
    getTrees: async () => {
    try {
      return await Tree.find({hidden: false}).sort({ 'commonName': 1 });
    }
    catch (err) {
      console.error(err);
      return [];
    }
  },

    getTree: async (_, { id }) => {
      try {
        return await Tree.findById(id)
      }
      catch (err) {
        console.error(err);
        return null;
      }
    },

    getSpecies: async () => {
      try {
        return await Species.find().sort({ 'scientificName': 1 });
      }
      catch (err) {
        console.error(err);
        return null;
      }
    },

    getSpeciesByCommonName: async (_, { commonName }) => {
      try {
        return await Species.findOne({ commonName });
      }
      catch (err) {
        console.error(err);
        return null;
      }
    },

    getSpeciesByScientificName: async (_, { scientificName }) => {
      try {
        return await Species.findOne({ scientificName });
      }
      catch (err) {
        console.error(err);
        return null;
      }
    }
  },

  Tree: {
    species: async (parent) => {
      try {
        return await Species.findOne({ commonName: parent.commonName });
      }
      catch (err) {
        console.error(err);
        return null;
      }
    }
  },

  Mutation: {
    addTree: async (_, { commonName, variety, dbh, photos, notes, location, garden, siteInfo, lastUpdated, installedDate, installedBy, felledDate, felledBy, careNeeds, careHistory, hidden }) => {
      try {
        const speciesExists = await Species.findOne({ commonName });
        if (!speciesExists) {
          throw new Error(`Species with common name '${commonName} not found.`);
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
          careHistory,
          hidden: hidden || false
        });
      }
      catch (err) {
        console.error(err);
        return null
      }
    },

    updateTree: async (_, { id, commonName, variety, dbh, photos, notes, location, garden, siteInfo, lastUpdated, installedDate, installedBy, felledDate, felledBy, careNeeds, careHistory, hidden }) => {
      try {
        if (commonName) {
          const speciesExists = await Species.findOne({ commonName });
          if (!speciesExists) {
            throw new Error(`Species with common name '${commonName} not found.`);
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
            location,
            garden,
            siteInfo,
            lastUpdated,
            installedDate,
            installedBy,
            felledDate,
            felledBy,
            careNeeds,
            careHistory,
            hidden
          },
          { new: true }
        );
      }
      catch (err) {
        console.error(err);
        return null;
      }
    },

    addSpecies: async (_, { family, commonName, scientificName, nonnative, invasive, markerColor }) => {
      try {
        const existingSpecies = await Species.findOne({
          $or: [
            { commonName },
            { scientificName }
          ]
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
          markerColor
        });
      } 
      catch (err) {
        console.error(err);
        return null;
      }
    },

    updateSpecies: async (_, { id, family, commonName, scientificName, nonnative, invasive, markerColor }) => {
      try {
        const existingSpecies = await Species.findOne({
          _id: { $ne: id },
          $or: [
            { commonName },
            { scientificName }
          ]
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
            markerColor
          },
          { new: true }
        );
      } 
      catch (err) {
        console.error(err);
        return null;
      }
    }
  }
};

module.exports = { resolvers } ;