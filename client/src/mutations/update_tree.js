import { gql } from '@apollo/client';

export const UPDATE_TREE = gql`
  mutation updateTree(
    $id: ID!
    $commonName: String!
    $variety: String
    $dbh: String
    $photos: TreePhotosInput
    $notes: String
    $garden: String
    $siteInfo: SiteInfoInput
    $lastUpdated: String!
    $installedDate: String
    $installedBy: String
    $felledDate: String
    $felledBy: String
    $careNeeds: CareNeedsInput
    $hidden: Boolean
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
      hidden: $hidden
    ) {
      id
      commonName
      variety
      dbh
      photos {
        bark {
          url
          publicId
        }
        summerLeaf {
          url
          publicId
        }
        autumnLeaf {
          url
          publicId
        }
        fruit {
          url
          publicId
        }
        flower {
          url
          publicId
        }
        environs {
          url
          publicId
        }
      }
      notes
      garden
      siteInfo {
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
        multistem
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
