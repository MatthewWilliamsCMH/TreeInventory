import { gql } from '@apollo/client';

export const UPDATE_TREE = gql`
  mutation updateTree(
    $id: ID!
    $commonName: String!
    $variety: String
    $dbh: String
    $photos: PhotosInput
    $notes: String
    $garden: String
    $siteInfo: SiteInfoInput
    $lastUpdated: String!
    $installedDate: String
    $installedBy: String
    $felledDate: String
    $felledBy: String
    $careNeeds: careNeedsInput
    $careHistory: String
    $hidden: Boolean!
  ) {
    updateTree(
      id: $id
      commonName: $commonName
      variety: $variety
      dbh: $dbh
      photos: $photos
      notes: $notes
      garden: $garden
      siteInfo: $siteInfo
      lastUpdated: $lastUpdated
      installedDate: $installedDate
      installedBy: $installedBy
      felledDate: $felledDate
      felledBy: $felledBy
      careNeeds: $careNeeds
      careHistory: $careHistory
      hidden: $hidden
    ) {
      id
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
      careHistory
      hidden
    }
  }
`;