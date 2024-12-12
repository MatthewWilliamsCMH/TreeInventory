const { gql } = require("apollo-server-express");

const typeDefs = gql `
  input SpeciesInput {
    commonName: String!
    scientificName: String!
  }

  input LocationInput {
    northing: Float
    easting: Float
  }

  input MaintenanceNeedsInput {
    install: Boolean
    raiseCrown: Boolean
    routinePrune: Boolean
    trainingPrune: Boolean
    priorityPrune: Boolean
    pestTreatment: Boolean
    installGrate: Boolean
    removeGrate: Boolean
    fell: Boolean
    removeStump: Boolean
  }

  input SiteInfoInput {
    slope: Boolean
    overheadLines: Boolean
    treeCluster: Boolean
    proximateStructure: Boolean
    proximateFence: Boolean
  }

  type Species {
    commonName: String!
    scientificName: String!
  }

  type Location {
    northing: Float
    easting: Float
  }

  type MaintenanceNeeds {
    install: Boolean
    raiseCrown: Boolean
    routinePrune: Boolean
    trainingPrune: Boolean
    priorityPrune: Boolean
    pestTreatment: Boolean
    installGrate: Boolean
    removeGrate: Boolean
    fell: Boolean
    removeStump: Boolean
  }

  type SiteInfo {
    slope: Boolean
    overheadLines: Boolean
    treeCluster: Boolean
    proximateStructure: Boolean
    proximateFence: Boolean
  }

  type Tree {
    id: ID!
    lastVisited: String
    species: Species
    variety: String
    garden: String
    location: Location
    dbh: String
    installedDate: String
    installedBy: String
    felledDate: String
    felledBy: String
    maintenanceNeeds: MaintenanceNeeds
    siteInfo: SiteInfo
    careHistory: String
    notes: String
    photos: String
    nonnative: Boolean
    invasive: Boolean
    hidden: Boolean
  }

  type Query {
    getTrees: [Tree]
    getTree(id: ID): Tree
  }

  type Mutation {
    addTree (
      lastVisited: String
      species: SpeciesInput
      variety: String
      garden: String
      location: LocationInput
      dbh: String
      installedDate: String
      installedBy: String
      felledDate: String
      felledBy: String
      maintenanceNeeds: MaintenanceNeedsInput
      siteInfo: SiteInfoInput
      careHistory: String
      notes: String
      photos: String
      nonnative: Boolean
      invasive: Boolean
    ): Tree

    updateTree (
      id: ID!
      lastVisited: String
      species: SpeciesInput
      variety: String
      garden: String
      location: LocationInput
      dbh: String
      installedDate: String
      installedBy: String
      felledDate: String
      felledBy: String
      maintenanceNeeds: MaintenanceNeedsInput
      siteInfo: SiteInfoInput
      careHistory: String
      notes: String
      photos: String
      nonnative: Boolean
      invasive: Boolean
      hidden: Boolean
    ): Tree
  }
`;

module.exports = { typeDefs };