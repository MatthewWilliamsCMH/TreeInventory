const { gql } = require('apollo-server-express');

const typeDefs = gql`
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

  input CareNeedsInput {
    multistem: Boolean!
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

  input PhotoInput {
    url: String
    publicId: String
  }

  input TreePhotosInput {
    bark: PhotoInput
    summerLeaf: PhotoInput
    autumnLeaf: PhotoInput
    fruit: PhotoInput
    flower: PhotoInput
    environs: PhotoInput
  }

  input SpeciesInput {
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

  type CareNeeds {
    multistem: Boolean!
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

  type Photo {
    url: String
    publicId: String
  }

  type TreePhotos {
    bark: Photo
    summerLeaf: Photo
    autumnLeaf: Photo
    fruit: Photo
    flower: Photo
    environs: Photo
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
    photos: TreePhotos
    notes: String
    location: Location!
    garden: String
    siteInfo: SiteInfo
    lastUpdated: String!
    installedDate: String
    installedBy: String
    felledDate: String
    felledBy: String
    careNeeds: CareNeeds
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
    addTree(
      commonName: String!
      variety: String
      dbh: String
      photos: TreePhotosInput
      notes: String
      location: LocationInput
      garden: String
      siteInfo: SiteInfoInput
      lastUpdated: String!
      installedDate: String
      installedBy: String
      felledDate: String
      felledBy: String
      careNeeds: CareNeedsInput
      hidden: Boolean
    ): Tree

    updateTree(
      id: ID!
      commonName: String!
      variety: String
      dbh: String
      photos: TreePhotosInput
      notes: String
      location: LocationInput
      garden: String
      siteInfo: SiteInfoInput
      lastUpdated: String!
      installedDate: String
      installedBy: String
      felledDate: String
      felledBy: String
      careNeeds: CareNeedsInput
      hidden: Boolean
    ): Tree

    updateTreeLocation(id: ID!, location: LocationInput): Tree

    addSpecies(
      family: String!
      commonName: String!
      scientificName: String!
      nonnative: Boolean!
      invasive: Boolean!
      markerColor: String!
    ): Species

    updateSpecies(
      id: ID!
      family: String!
      commonName: String!
      scientificName: String!
      nonnative: Boolean!
      invasive: Boolean!
      markerColor: String!
    ): Species

    loginUser(userName: String!, userPassword: String!): LoginUserResponse

    deletePhoto(publicId: String!): Boolean!
  }

  type LoginUserResponse {
    userName: String
    # no password returned
  }
`;

module.exports = { typeDefs };
