// /Not sure I need this query; leaflet handles getting the tree
import { gql } from "@apollo/client";

export const GET_TREE = gql`
  query getTree {
    getTree {
      id
      species {
        commonName
        scientificName
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
      hidden
    }
  }
`;