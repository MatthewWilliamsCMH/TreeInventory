// /Not sure I need this query; leaflet handles getting the tree
import { gql } from "@apollo/client";

export const GET_TREE = gql`
  query getTree {
    getTree {
      id
      lastVisited
      nonnative
      invasive
      species {
        commonName
        scientificName
      }
      variety
      garden
      location {
        northing
        easting
      }
      dbh
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
      siteInfo {
        slope
        overheadLines
        treeCluster
        proximateStructure
        proximateFence
      }
      careHistory
      notes
      photos
    }
  }
`;