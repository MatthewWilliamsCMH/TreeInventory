const Tree = require("../models/Tree");

const resolvers = {
  Query: {
    getTrees: async () => {
      try {
        return await Tree.find().sort({ genus: 1 });  //find all trees and sort by genus
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