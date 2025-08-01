import { gql } from '@apollo/client';

export const GET_TREES = gql`
  query getTrees {
    trees: getTrees {
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
