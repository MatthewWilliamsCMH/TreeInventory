const Tree = require("../models/Tree");

//I'll need to add a query resolver for retrieving hidden trees
const resolvers = {
  Query: {
    getTrees: async () => {
      try {
        return await Tree.find().sort({ "species.scientificName": 1 });  //find all trees and sort by scientific name
      }
      catch (err) {
        console.error(err);
        return [];
      }
    },

    getTree: async () => {
      try {
        return await Tree.findById(id)
      }
      catch (err) {
        console.error(err);
        return null;
      }
    }
  },

  Mutation: {
    addTree: async (_, { species, variety, dbh, photos, notes, nonnative, invasive, location, garden, siteInfo, lastVisited, installedDate, installedBy, felledDate, felledBy, maintenanceNeeds, careHistory, hidden }) => {
      try {
        return await Tree.create({
          species, 
          variety, 
          dbh, 
          photos,
          notes, 
          nonnative, 
          invasive, 
          location, 
          garden, 
          siteInfo, 
          lastVisited, 
          installedDate, 
          installedBy, 
          felledDate, 
          felledBy, 
          maintenanceNeeds, 
          careHistory,
          hidden
        });
      }
      catch (err) {
        console.error(err);
        return null
      }
    },

    updateTree: async (_, { id, species, variety, dbh, photos, notes, nonnative, invasive, location, garden, siteInfo, lastVisited, installedDate, installedBy, felledDate, felledBy, maintenanceNeeds, careHistory, hidden }) => {
      try {
        return await Tree.findByIdAndUpdate(
          id, 
          { 
            species, 
            variety, 
            dbh, 
            photos,
            notes, 
            nonnative, 
            invasive, 
            location, 
            garden, 
            siteInfo, 
            lastVisited, 
            installedDate, 
            installedBy, 
            felledDate, 
            felledBy, 
            maintenanceNeeds, 
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
    }  
  }
};

  module.exports = { resolvers } ;