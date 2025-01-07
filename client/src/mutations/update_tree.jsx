import { gql } from "@apollo/client";

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
    $lastVisited: String!
    $installedDate: String
    $installedBy: String
    $felledDate: String
    $felledBy: String
    $maintenanceNeeds: MaintenanceNeedsInput
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