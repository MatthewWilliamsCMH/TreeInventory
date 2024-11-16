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
    addTree: async (_, { input }) => {
      try {
        const NewTree = new Tree(input);
        return await NewTree.save();
      }
      catch (err) {
        console.error(err);
        return null
      }
    },

    updateTree: async (_, { id, input }) => {
      try {
        return await Tree.findByIdAndUpdate(id, input, { new: true });
      }
      catch (err) {
        console.error(err);
        return null;
      }
    }
  }
};

  module.exports = { resolvers} ;