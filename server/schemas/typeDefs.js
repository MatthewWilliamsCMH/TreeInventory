const { gql } = require("apollo-server-express");

const typeDefs = gql `
  input SpeciesInput {
    commonName: String!
    scientificName: String!
  }

  input LocationInput {
    northing: Float!
    easting: Float!
  }

  input MaintenanceNeedsInput {
    install: Boolean
    priorityPrune: Boolean
    routinePrune: Boolean
    trainingPrune: Boolean
    installGrate: Boolean
    removeGrate: Boolean
    removeStump: Boolean
    raiseCrown: Boolean
    pestTreatment: Boolean
  }

  input SiteInfoInput {
    slope: Boolean
    overheadLines: Boolean
    proximateStructure: Boolean
    proximateFence: Boolean
    treeCluster: Boolean
  }

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
    location: Location!
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
    getTree(id: ID): Tree
  }

  type Mutation {
    addTree (
      lastVisited: String!
      species: SpeciesInput
      genus: String!
      variety: String
      garden: String!
      location: LocationInput!
      installDate: String
      felledDate: String
      dbh: String!
      careHistory: String
      maintenanceNeeds: MaintenanceNeedsInput
      siteInfo: SiteInfoInput
      notes: String
      photo: String
    ): Tree

    updateTree (
      id: ID!
      lastVisited: String!
      species: SpeciesInput
      genus: String!
      variety: String
      garden: String!
      location: LocationInput!
      installDate: String
      felledDate: String
      dbh: String!
      careHistory: String
      maintenanceNeeds: MaintenanceNeedsInput
      siteInfo: SiteInfoInput
      notes: String
      photo: String
    ): Tree
  }
`;

module.exports = { typeDefs };

//we'll also need a query to pull data on one tree and mutations to add and update a tree