import { gql } from "@apollo/client";

export const ADD_TREE = gql`
  mutation addTree(
    $species: SpeciesInput
    $variety: String
    $dbh: String
    $photos: PhotosInput
    $notes: String
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
    addTree(
      species: $species
      variety: $variety
      dbh: $dbh
      photos: $photos
      notes: $notes
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
      species {
        commonName
        scientificName
        nonnative
        invasive
        markerColor
      }
      variety
      dbh
      photos {
        bark
        summerLeaf
        autumnLeaf
        fruit
        flower
        environs
      }
      notes
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