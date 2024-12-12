import { gql } from "@apollo/client";

export const ADD_TREE = gql`
  mutation addTree (
    $lastVisited: String!
    $nonnative: Boolean
    $invasive: Boolean
    $species: SpeciesInput
    $variety: String
    $garden: String!
    $location: LocationInput!
    $dbh: String
    $installedDate: String
    $installedBy: String
    $felledDate: String
    $felledBy: String
    $maintenanceNeeds: MaintenanceNeedsInput
    $siteInfo: SiteInfoInput
    $careHistory: String
    $notes: String
    $photos: String
  ) {
    addTree(
      lastVisited: $lastVisited
      nonnative: $nonnative
      invasive: $invasive
      species: $species
      variety: $variety
      garden: $garden
      location: $location
      dbh: $dbh
      installedDate: $installedDate
      installedBy: $installedBy
      felledDate: $felledDate
      felledBy: $felledBy
      maintenanceNeeds: $maintenanceNeeds
      siteInfo: $siteInfo
      careHistory: $careHistory
      notes: $notes
      photos: $photos
    ) {
      id
      lastVisited
      nonnative
      invasive
      species {
        commonName
        scientificName
      }
      variety
      garden
      location {
        northing
        easting
      }
      dbh
      installedDate
      installedBy
      felledDate
      felledBy
      maintenanceNeeds {
        install
        raiseCrown
        routinePrune
        trainingPrune
        priorityPrune
        pestTreatment
        installGrate
        removeGrate
        fell
        removeStump
      }
      siteInfo {
        slope
        overheadLines
        treeCluster
        proximateStructure
        proximateFence
      }
      careHistory
      notes
      photos
    }
  }
`;