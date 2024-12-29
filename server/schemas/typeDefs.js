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

  input SiteInfoInput {
    slope: Boolean
    overheadLines: Boolean
    treeCluster: Boolean
    proximateStructure: Boolean
    proximateFence: Boolean
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

  input PhotosInput {
    bark: String
    summerLeaf: String
    autumnLeaf: String
    fruit: String
    flower: String
    environs: String
  }

  type Species {
    commonName: String!
    scientificName: String!
  }

  type Location {
    northing: Float
    easting: Float
  }

  type SiteInfo {
    slope: Boolean
    overheadLines: Boolean
    treeCluster: Boolean
    proximateStructure: Boolean
    proximateFence: Boolean
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

  type Photos {
    bark: String
    summerLeaf: String
    autumnLeaf: String
    fruit: String
    flower: String
    environs: String
  }

  type Tree {
    id: ID!
    species: Species
    variety: String
    dbh: String
    photos: Photos
    notes: String
    nonnative: Boolean
    invasive: Boolean
    location: Location
    garden: String
    siteInfo: SiteInfo
    lastVisited: String
    installedDate: String
    installedBy: String
    felledDate: String
    felledBy: String
    maintenanceNeeds: MaintenanceNeeds
    careHistory: String
    hidden: Boolean
  }

  type Query {
    getTrees: [Tree]
    getTree(id: ID): Tree
  }

  type Mutation {
    addTree (
      species: SpeciesInput
      variety: String
      dbh: String
      photos: PhotosInput
      notes: String
      nonnative: Boolean
      invasive: Boolean
      location: LocationInput
      garden: String
      siteInfo: SiteInfoInput
      lastVisited: String
      installedDate: String
      installedBy: String
      felledDate: String
      felledBy: String
      maintenanceNeeds: MaintenanceNeedsInput
      careHistory: String
      hidden: Boolean
    ): Tree

    updateTree (
      id: ID!
      species: SpeciesInput
      variety: String
      dbh: String
      photos: PhotosInput
      notes: String
      nonnative: Boolean
      invasive: Boolean
      location: LocationInput
      garden: String
      siteInfo: SiteInfoInput
      lastVisited: String
      installedDate: String
      installedBy: String
      felledDate: String
      felledBy: String
      maintenanceNeeds: MaintenanceNeedsInput
      careHistory: String
      hidden: Boolean
    ): Tree
  }
`;

module.exports = { typeDefs };