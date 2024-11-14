const { gql } = require("apollo-server-express");

const typeDefs = gql `
  type Species {
    commonName: String!
    scientificName: String!
  }

  type Location {
    northing: Float!
    easting: Float!
  }

  type MaintenanceNeeds {
    install: Boolean
    fell: Boolean
    priorityPrune: Boolean
    routinePrune: Boolean
    trainingPrune: Boolean
    installGrate: Boolean
    removeGrate: Boolean
    removeStump: Boolean
    raiseCrown: Boolean
    pestTreatment: Boolean
  }

  type SiteInfo {
    slope: Boolean
    overheadLines: Boolean
    proximateStructure: Boolean
    proximateFence: Boolean
    treeCluster: Boolean
  }

  type Tree {
    id: ID!
    lastVisited: String!
    species: Species
    genus: String!
    variety: String
    garden: String!
    location: Location
    installedDate: String
    felledDate: String
    dbh: String!
    careHistory: String
    maintenanceNeeds: MaintenanceNeeds
    siteInfo: SiteInfo
    notes: String
    photo: String
  }

  type Query {
    getTrees: [Tree]
  }
`;

module.exports = { typeDefs };

//we'll also need a query to pull data on one tree and mutations to add and update a tree