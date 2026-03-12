import { gql } from "@apollo/client";

export const GET_TREES = gql`
  query getTrees {
    trees: getTrees {
      id
      commonName
      variety
      dbh
      multistem
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
