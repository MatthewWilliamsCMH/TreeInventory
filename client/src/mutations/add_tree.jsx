import { gql } from '@apollo/client';

export const ADD_TREE = gql`
  mutation addTree(
    $commonName: String!
    $variety: String
    $dbh: String
    $photos: PhotosInput
    $notes: String
    $location: LocationInput
    $garden: String
    $siteInfo: SiteInfoInput
    $lastUpdated: String!
    $installedDate: String
    $installedBy: String
    $felledDate: String
    $felledBy: String
    $careNeeds: careNeedsInput
    $hidden: Boolean
  ) {
    addTree(
      commonName: $commonName
      variety: $variety
      dbh: $dbh
      photos: $photos
      notes: $notes
      location: $location
      garden: $garden
      siteInfo: $siteInfo
      lastUpdated: $lastUpdated
      installedDate: $installedDate
      installedBy: $installedBy
      felledDate: $felledDate
      felledBy: $felledBy
      careNeeds: $careNeeds
      hidden: $hidden
    ) {
      commonName
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
      lastUpdated
      installedDate
      installedBy
      felledDate
      felledBy
      careNeeds {
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
      hidden
    }
  }
`;