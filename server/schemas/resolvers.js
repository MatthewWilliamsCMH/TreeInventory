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
    }
  }
};

  module.exports = { resolvers} ;

  //we'll need a query for one tree and mutations to update and add a tree
//chatgpt provided these below
    // You can also add a resolver for fetching a single tree by its id
//     tree: async (_, { id }) => {
//       try {
//         return await Tree.findById(id);
//       } catch (err) {
//         console.error(err);
//         return null;
//       }
//     }
//   },

//   Mutation: {
//     addTree: async (_, { input }) => {
//       try {
//         const newTree = new Tree(input);
//         return await newTree.save();
//       } catch (err) {
//         console.error(err);
//         return null;
//       }
//     },

//     updateTree: async (_, { id, input }) => {
//       try {
//         return await Tree.findByIdAndUpdate(id, input, { new: true });
//       } catch (err) {
//         console.error(err);
//         return null;
//       }
//     }
//   }
// };