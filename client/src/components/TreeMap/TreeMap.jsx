import React, { useEffect, useRef, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PhysicalDataForm from "../PhysicalData/PhysicalDataForm";

//I"ll need to add a query, GET_HIDDEN_TREES for hidden trees

const GET_TREES = gql`
  query getTrees {
    getTrees {
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

const GET_TREE = gql`
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

const ADD_TREE = gql`
  mutation addTree (
    $lastVisited: String!
    $nonnative: Boolean
    $invasive: Boolean
    $species: SpeciesInput
    $variety: String
    $garden: String!
    $location: LocationInput!
    $dbh: String
    $installedDate: String
    $installedBy: String
    $felledDate: String
    $felledBy: String
    $maintenanceNeeds: MaintenanceNeedsInput
    $siteInfo: SiteInfoInput
    $careHistory: String
    $notes: String
    $photos: String
  ) {
    addTree(
      lastVisited: $lastVisited
      nonnative: $nonnative
      invasive: $invasive
      species: $species
      variety: $variety
      garden: $garden
      location: $location
      dbh: $dbh
      installedDate: $installedDate
      installedBy: $installedBy
      felledDate: $felledDate
      felledBy: $felledBy
      maintenanceNeeds: $maintenanceNeeds
      siteInfo: $siteInfo
      careHistory: $careHistory
      notes: $notes
      photos: $photos
    ) {
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

const UPDATE_TREE = gql`
  mutation updateTree(
    $id: ID!
    $lastVisited: String
    $nonnative: Boolean
    $invasive: Boolean
    $species: SpeciesInput
    $variety: String
    $garden: String
    $location: LocationInput
    $dbh: String
    $installedDate: String
    $installedBy: String
    $felledDate: String
    $felledBy: String
    $maintenanceNeeds: MaintenanceNeedsInput
    $siteInfo: SiteInfoInput
    $careHistory: String
    $notes: String
    $photos: String
  ) {
    updateTree(
      id: $id
      lastVisited: $lastVisited
      nonnative: $nonnative
      invasive: $invasive
      species: $species
      variety: $variety
      garden: $garden
      location: $location
      dbh: $dbh
      installedDate: $installedDate
      installedBy: $installedBy
      felledDate: $felledDate
      felledBy: $felledBy
      maintenanceNeeds: $maintenanceNeeds
      siteInfo: $siteInfo
      careHistory: $careHistory
      notes: $notes
      photos: $photos
    ) {
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

const TreeMap = () => {
  const navigate = useNavigate();
  const { selectedTree, setSelectedTree } = useOutletContext();
  const { updatedTree, setUpdatedTree } = useOutletContext();

  const { loading: loadingGetAll, error: errorGetAll, data: dataGetAll } = useQuery(GET_TREES); //fetch all trees
  const [trees, setTrees] = useState(dataGetAll?.getTrees || []); //establish state that will store the list of trees; set to the list or to an empty array
  
  const [addTree, { loading: loadingAddOne, error: errorAddOne}] = useMutation(ADD_TREE); //add one tree
  const [updateTree, { loading: loadingUpdateOne, error: errorUpdateOne}] = useMutation(UPDATE_TREE)//update one tree
  
  const mapRef = useRef(null); //use ref for map container
  const map = useRef(null); //use ref to store Leaflet map instance

  useEffect(() => {
    if (mapRef.current && !map.current) {
      map.current = L.map(mapRef.current).setView([39.97738230836944, -83.04934859084177], 19);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom:23}).addTo(map.current);
    }

    if (map.current && dataGetAll && dataGetAll.getTrees) {
      map.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.current.removeLayer(layer);
        }
      },
    );

      dataGetAll.getTrees.forEach((tree) => {
      const treeID = tree.id.toString();
      const { northing, easting } = tree.location;
      const popupContent = `
        <b>${tree.species?.commonName}</b><br>
        <i>${tree.species?.scientificName}</i><br>
        Id: ${treeID}
      `;
      const marker = L.marker([northing, easting])
        .bindPopup(popupContent)
        .addTo(map.current);
        
        marker.on("popupopen", (event) => {
          const popup = event.popup;
          const popupElement = popup.getElement();
          popupElement.addEventListener("click", () => {
            setSelectedTree(tree); //this will persist so that it can be recalled if the user cancels updates
            setUpdatedTree(tree); //this will be updated when user changes data on the form
            navigate("/physicaldata");
            map.current.closePopup(popup);
          });
        });
      });
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [dataGetAll]);

  const handleAddTree = (treeInput) => {
    addTree({ variables: treeInput })
    .then(({ data }) => {
      console.log("Tree added: ", data.addTree);
      setTrees((prevTrees) => [...prevTrees, data.addTree])
    })
    .catch ((error) => {
      console.error("Error adding tree: ", error);
    })
  }

  const handleUpdateTree = (treeId, treeInput) => {
    updateTree({ variables: { id: treeId, ...treeInput } })
    .then (({ data }) => {
      console.log("Tree updated: ", data.updateTree);
      setTrees((prevTrees) =>
        prevTrees.map((tree) =>
          tree.id === data.updateTree.id ? data.updateTree : tree
        )
      )
    })
    .catch((error) => {
      console.error("Error updating tree: ", error);
    });
  };

  if (loadingGetAll || loadingAddOne || loadingUpdateOne) {
    return <p>Loading...</p>;
  }
  if (errorGetAll || errorAddOne || errorUpdateOne) {
    return <p>Error: {errorGetAll?.message || errorAddOne?.message || errorUpdateOne?.message}</p>;
  }

  return (
    // <>
    //   {updatedTree ? (
    //     <PhysicalDataForm />
    //   ) : (
        <div ref = {mapRef} style = {{ height: "100vh", width: "100vw" }}></div>
  //     )}
  //   </>
  );
};
export default TreeMap;