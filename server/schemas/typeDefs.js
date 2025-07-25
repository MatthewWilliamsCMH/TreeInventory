const { gql } = require('apollo-server-express');

const typeDefs = gql `
  input LocationInput {
    northing: Float!
    easting: Float!
  }

  input SiteInfoInput {
    slope: Boolean!
    overheadLines: Boolean!
    treeCluster: Boolean!
    proximateStructure: Boolean!
    proximateFence: Boolean!
    propertyLine: Boolean!
  }

  input careNeedsInput {
    install: Boolean!
    raiseCrown: Boolean!
    routinePrune: Boolean!
    trainingPrune: Boolean!
    priorityPrune: Boolean!
    pestTreatment: Boolean!
    installGrate: Boolean!
    removeGrate: Boolean!
    fell: Boolean!
    removeStump: Boolean!
  }

  input PhotosInput {
    bark: String
    summerLeaf: String
    autumnLeaf: String
    fruit: String
    flower: String
    environs: String
  }

  input Species {
    family: String!
    commonName: String!
    scientificName: String!
    nonnative: Boolean!
    invasive: Boolean!
    markerColor: String!
  }

  type Location {
    northing: Float!
    easting: Float!
  }

  type SiteInfo {
    slope: Boolean!
    overheadLines: Boolean!
    treeCluster: Boolean!
    proximateStructure: Boolean!
    proximateFence: Boolean!
    propertyLine: Boolean!
  }

  type careNeeds {
    install: Boolean!
    raiseCrown: Boolean!
    routinePrune: Boolean!
    trainingPrune: Boolean!
    priorityPrune: Boolean!
    pestTreatment: Boolean!
    installGrate: Boolean!
    removeGrate: Boolean!
    fell: Boolean!
    removeStump: Boolean!
  }

  type Photos {
    bark: String
    summerLeaf: String
    autumnLeaf: String
    fruit: String
    flower: String
    environs: String
  }

  type Species {
    id: ID!
    family: String!
    commonName: String!
    scientificName: String!
    nonnative: Boolean!
    invasive: Boolean!
    markerColor: String!
  }

  type Tree {
    id: ID!
    commonName: String!
    species: Species!
    variety: String
    dbh: String
    photos: Photos
    notes: String
    location: Location!
    garden: String
    siteInfo: SiteInfo
    lastUpdated: String!
    installedDate: String
    installedBy: String
    felledDate: String
    felledBy: String
    careNeeds: careNeeds
    hidden: Boolean
  }

  type Query {
    getTrees: [Tree]
    getTree(id: ID): Tree
    getSpecies: [Species]
    getSpeciesByCommonName(commonName: String!): Species
    getSpeciesByScientificName(scientificName: String!): Species
  }

  type Mutation {
    addTree (
      commonName: String!
      variety: String
      dbh: String
      photos: PhotosInput
      notes: String
      location: LocationInput
      garden: String
      siteInfo: SiteInfoInput
      lastUpdated: String!
      installedDate: String
      installedBy: String
      felledDate: String
      felledBy: String
      careNeeds: careNeedsInput
      hidden: Boolean
    ): Tree

    updateTree (
      id: ID!
      commonName: String!
      variety: String
      dbh: String
      photos: PhotosInput
      notes: String
      location: LocationInput
      garden: String
      siteInfo: SiteInfoInput
      lastUpdated: String!
      installedDate: String
      installedBy: String
      felledDate: String
      felledBy: String
      careNeeds: careNeedsInput
      hidden: Boolean
    ): Tree

    updateTreeLocation (
      id: ID!
      location: LocationInput
    ): Tree

    addSpecies (
      family: String!
      commonName: String!
      scientificName: String!
      nonnative: Boolean!
      invasive: Boolean!
      markerColor: String!
    ): Species

    updateSpecies (
      id: ID!
      family: String!
      commonName: String!
      scientificName: String!
      nonnative: Boolean!
      invasive: Boolean!
      markerColor: String!
    ): Species
  }
`;

module.exports = { typeDefs };