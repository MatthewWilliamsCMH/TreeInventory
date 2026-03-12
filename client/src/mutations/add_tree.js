import { gql } from "@apollo/client";

export const ADD_TREE = gql`
  mutation addTree(
    $commonName: String!
    $variety: String
    $dbh: String
    $multistem: Boolean
    $photos: TreePhotosInput
    $notes: String
    $location: LocationInput
    $garden: String
    $siteConditions: siteConditionsInput
    $lastUpdated: String!
    $installedDate: String
    $installedBy: String
    $felledDate: String
    $felledBy: String
    $careNeeds: CareNeedsInput
    $hidden: Boolean
  ) {
    addTree(
      commonName: $commonName
      variety: $variety
      dbh: $dbh
      multistem: $multistem
      photos: $photos
      notes: $notes
      location: $location
      garden: $garden
      siteConditions: $siteConditions
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
      multistem
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
      siteConditions {
        slope
        overheadLines
        treeCluster
        proximateStructure
        proximateFence
        propertyLine
      }
      lastUpdated
      installedDate
      installedBy
      felledDate
      felledBy
      careNeeds {
        structuralSupport
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
