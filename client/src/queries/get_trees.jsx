import { gql } from "@apollo/client";

export const GET_TREES = gql`
  query getTrees {
    getTrees {
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
    }
  }
`;