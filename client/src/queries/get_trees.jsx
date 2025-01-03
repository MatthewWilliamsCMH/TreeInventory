import { gql } from "@apollo/client";

export const GET_TREES = gql`
  query getTrees {
    getTrees {
      id
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