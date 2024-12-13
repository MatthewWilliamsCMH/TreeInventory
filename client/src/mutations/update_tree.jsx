import { gql } from "@apollo/client";

export const UPDATE_TREE = gql`
  mutation updateTree(
    $id: ID!
    $species: SpeciesInput
    $variety: String
    $dbh: String
    $photos: String
    $notes: String
    $nonnative: Boolean
    $invasive: Boolean
    $location: LocationInput
    $garden: String
    $siteInfo: SiteInfoInput
    $lastVisited: String
    $installedDate: String
    $installedBy: String
    $felledDate: String
    $felledBy: String
    $maintenanceNeeds: MaintenanceNeedsInput
    $careHistory: String
    $hidden: Boolean
  ) {
    updateTree(
      id: $id
      species: $species
      variety: $variety
      dbh: $dbh
      photos: $photos
      notes: $notes
      nonnative: $nonnative
      invasive: $invasive
      location: $location
      garden: $garden
      siteInfo: $siteInfo
      lastVisited: $lastVisited
      installedDate: $installedDate
      installedBy: $installedBy
      felledDate: $felledDate
      felledBy: $felledBy
      maintenanceNeeds: $maintenanceNeeds
      careHistory: $careHistory
      hidden: $hidden
    ) {
      id
      species {
        commonName
        scientificName
      }
      variety
      dbh
      photos
      notes
      nonnative
      invasive
      location {
        northing
        easting
      }
      garden
      siteInfo {
        slope
        overheadLines
        treeCluster
        proximateStructure
        proximateFence
      }
      lastVisited
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
      careHistory
      hidden
    }
  }
`;