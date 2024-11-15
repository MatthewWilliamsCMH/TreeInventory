import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery, useMutation, gql } from "@apollo/client";
import TreeForm from "../TreeForm/TreeForm";  // Import the form component

const GET_TREES = gql`
  query getTrees {
    getTrees {
      id
      lastVisited
      species {
        commonName
        scientificName
      }
      genus
      variety
      garden
      location {
        northing
        easting
      }
      installedDate
      installedBy
      felledDate
      felledBy
      dbh
      careHistory
      maintenanceNeeds {
        install
        fell
        priorityPrune
        routinePrune
        trainingPrune
        installGrate
        removeGrate
        raiseCrown
        pestTreatment
      }
      siteInfo {
        slope
        overheadLines
        proximateStructure
        proximateFence
        treeCluster
      }
      notes
      photo
      nonNative
    }
  }
`;

const GET_TREE = gql`
  query getTree {
    getTree {
      id
      lastVisited
      species {
        commonName
        scientificName
      }
      genus
      variety
      garden
      location {
        northing
        easting
      }
      installedDate
      installedBy
      felledDate
      felledBy
      dbh
      careHistory
      maintenanceNeeds {
        install
        fell
        priorityPrune
        routinePrune
        trainingPrune
        installGrate
        removeGrate
        raiseCrown
        pestTreatment
      }
      siteInfo {
        slope
        overheadLines
        proximateStructure
        proximateFence
        treeCluster
      }
      notes
      photo
      nonNative
    }
  }
`;

const ADD_TREE = gql`
  mutation addTree (
    $lastVisited: String!
    $species: SpeciesInput
    $genus: String!
    $variety: String
    $garden: String!
    $location: LocationInput!
    $installedDate: String
    $installedBy: String
    $felledDate: String
    $felledBy: String
    $dbh: String
    $careHistory: String
    $maintenanceNeeds: MaintenanceNeedsInput
    $siteInfo: SiteInfoInput
    $notes: String
    $photo: String
    $nonNative: Boolean
  ) {
    addTree(
      lastVisited: $lastVisited
      species: $species
      genus: $genus
      variety: $variety
      garden: $garden
      location: $location
      installedDate: $installedDate
      installedBy: $installedBy
      felledDate: $felledDate
      felledDate: $felledBy
      dbh: $dbh
      careHistory: $careHistory
      maintenanceNeeds: $maintenanceNeeds
      siteInfo: $siteInfo
      notes: $notes
      photo: $photo
      nonNative: $nonNative
    ) {
      id
      lastVisited
      species {
        commonName
        scientificName
      }
      genus
      variety
      garden
      location {
        northing
        easting
      }
      installedDate
      installedBy
      felledDate
      felledBy
      dbh
      careHistory
      maintenanceNeeds {
        install
        fell
        priorityPrune
        routinePrune
        trainingPrune
        installGrate
        removeGrate
        raiseCrown
        pestTreatment
      }
      siteInfo {
        slope
        overheadLines
        proximateStructure
        proximateFence
        treeCluster
      }
      notes
      photo
      nonNative
    }
  }
`;

const UPDATE_TREE = gql`
  mutation updateTree(
    $id: ID!
    $lastVisited: String
    $species: SpeciesInput
    $genus: String
    $variety: String
    $garden: String
    $location: LocationInput
    $installedDate: String
    $installedBy: String
    $felledDate: String
    $felledBy: String
    $dbh: String
    $careHistory: String
    $maintenanceNeeds: MaintenanceNeedsInput
    $siteInfo: SiteInfoInput
    $notes: String
    $photo: String
    $nonNative: Boolean
  ) {
    updateTree(
      id: $id
      lastVisited: $lastVisited
      species: $species
      genus: $genus
      variety: $variety
      garden: $garden
      location: $location
      installedDate: $installedDate
      installedBy: $installedBy
      felledDate: $felledDate
      felledBy: $felledBy
      dbh: $dbh
      careHistory: $careHistory
      maintenanceNeeds: $maintenanceNeeds
      siteInfo: $siteInfo
      notes: $notes
      photo: $photo
      nonNative: $nonNative
    ) {
      id
      lastVisited
      species {
        commonName
        scientificName
      }
      genus
      variety
      garden
      location {
        northing
        easting
      }
      installedDate
      installedBy
      felledDate
      felledBy
      dbh
      careHistory
      maintenanceNeeds {
        install
        fell
        priorityPrune
        routinePrune
        trainingPrune
        installGrate
        removeGrate
        raiseCrown
        pestTreatment
      }
      siteInfo {
        slope
        overheadLines
        proximateStructure
        proximateFence
        treeCluster
      }
      notes
      photo
      nonNative
    }
  }
`;

const TreeMap = () => {
  const [selectedTree, setSelectedTree] = useState(null) //establish state that will be used to determine selected tree; set to null initially

  const { loading: loadingGetAll, error: errorGetAll, data: dataGetAll } = useQuery(GET_TREES); //fetch all trees
  const [trees, setTrees] = useState(dataGetAll?.getTrees || []); //establish state that will store the list of trees; set to the list or to an empty array

  // const { loading: loadingGetOne, error: errorGetOne, data: dataGetOne } = useQuery(GET_TREE, { //fetch one tree
  //   skip: !selectedTree,
  //   variables: { id: selectedTree?.id }
  // });

  const [addTree, { loading: loadingAddOne, error: errorAddOne}] = useMutation(ADD_TREE); //add one tree

  const [updateTree, { loading: loadingUpdateOne, error: errorUpdateOne}] = useMutation(UPDATE_TREE)//update one tree
  
  const mapRef = useRef(null); //use ref for map container
  const map = useRef(null); //use ref to store Leaflet map instance


  useEffect(() => {
    if (mapRef.current && !map.current) {
      map.current = L.map(mapRef.current).setView([39.97768230836944, -83.04934859084177], 30); //set map to location of Summit Chase and zoom in
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.current); //get tiles from Open Stree Map
    }

    //add markers for each tree if data is available
    if (dataGetAll && dataGetAll.getTrees) {
      dataGetAll.getTrees.forEach((tree) => {
        const treeID = tree.id.toString()
        const { northing, easting } = tree.location; //location of marker and content of popup attached to the marker
        const popupContent = `
          <b>${tree.species?.commonName}</b><br>
          <i>${tree.species?.scientificName}</i><br>
          Id: ${treeID}
        `;
        const marker = L.marker([northing, easting]) //add marker and bind popup to it
          .bindPopup(popupContent)
          .addTo(map.current);
        
        marker.on("popupopen", (event) => {
          const popup = event.popup;
          const popupElement = popup.getElement();

          popupElement.addEventListener("click", () => {
            alert("Hello");
            setSelectedTree(tree);
            map.current.closePopup(popup);
          })
        })
      });
    }

    //cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [dataGetAll]); //rerun the effect when data changes

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
    updateTree({ variables: { id: treeId, ...treeInput } } )
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
  
  //the code below was provided by ChatGPT, but it's not what I want to happen. The <div ref={mapRef}...</div line is correct, but this is the flow I'm looking for
  //1. When the user clicks on or touches a marker, a pop-up for that tree opens with it's id and its common name.
  //2. When the user clicks on or touches the pop-up, a form with OK and Cancel buttons opens with the full data set for the tree; the form may be editable by default, or it may have an edit button to allow updates.
  //3. If the form is dirty, when the user clicks on or touches OK, the db is updated and the form closes. If the form is not dirty, clicking OK closes the form without updating the db.
  //4. When the user clicks on or touches Cancel, the form closes.
  //5. When the user clicks on or touches the map (not on a marker), an empty form with OK and Cancel buttons opens.
  //6. When the user clicks on or touches OK, the tree is added to the db and a marker is added IF the required fields are completed.
  //7. when the user clicks on or touches Cancel, the form closes.

  //lastVisited should be today's date
  //genus should be generated automatically using the first word of the scientific name; does this need to be stored as a separate field? (Probably not.)
  //norhing and easting should be retrieved from the GIS data of the marker.

  //the list of common and scientific names should be pulled from the db, but the user should be able to add new ones by typing them into the respective inputs.

  //dates will need to be converted on the front end to US local format

  //maintenanceNeeds and siteInfo will be a series of check boxes, and their data will be stored as object. E.g, maintenanceNeeds: {install: false, fell: false, priorityPrune: false, routinePrune: true, trainingPruce: false, installGrate: true, removeGrate: false, removeStump: false, corwnRaise: false, pestTreatment: true}. Would it be better to store these as arrays that are just series of 0s and 1s? E.g., maintenanceNeed: [0,0,0,1,0,1,0,0,0,1] for install, fell, priorityPrune, routinePrune, trainingPrune, installGrate, removeGrate, removeStummp, raiseCrown, pestTreatment. It would be more efficient, but less transparent.

  //add a hide button to the form and also a hidden field to the db? I don't want to delete trees, I don't think, so history is maintained, but I don't want deleted trees to be visible by default
  //if I allow hidden, I'll need a way for users to toggle on and off the hidden trees, and those should have a different marker like an "X"
  //should I store the actual photo, or should I create an array of photoURLs so I can have multiple photos of a single tree but also store the image files outside the db to keep the db trim?

  return (
    <>
      {selectedTree} ? (
        <TreeForm selectedTree={selectedTree} setSelectedTree={setSelectedTree} />
      ) : (
        <div ref={mapRef} style={{ height: '100vh', width: '100vw' }}></div>;
      )
    </>
  )
};

export default TreeMap;
