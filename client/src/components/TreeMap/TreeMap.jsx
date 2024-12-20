import React, { useEffect, useRef, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { GET_TREES } from "../../queries/get_trees";
import { ADD_TREE } from "../../mutations/add_tree";
import { UPDATE_TREE } from "../../mutations/update_tree";

const TreeMap = () => {
  const navigate = useNavigate();  //enable routing
  
  //accept objects and functions for storing data
  const { selectedTree, setSelectedTree, setFormValues } = useOutletContext();

  //set up queries and mutations
  const { loading: loadingGetAll, error: errorGetAll, data: dataGetAll } = useQuery(GET_TREES, {fetchPolicy: "network-only"}); //fetch all trees
  const [addTree, { loading: loadingAddOne, error: errorAddOne}] = useMutation(ADD_TREE); //add one tree
  const [updateTree, { loading: loadingUpdateOne, error: errorUpdateOne}] = useMutation(UPDATE_TREE)//update one tree
  
  //initialize map
  const mapRef = useRef(null); //use ref for map container
  const map = useRef(null); //use ref to store Leaflet map instance

  useEffect(() => {
    //the map container exists but is empty
    if (mapRef.current && !map.current) {
      map.current = L.map(mapRef.current).setView([39.97738230836944, -83.04934859084177], 19);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom:23}).addTo(map.current);
      map.current.on("click", handleAddTree);
    }

    //remove old data and fetch the data anew
    if (map.current && dataGetAll?.getTrees) {
      map.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.current.removeLayer(layer);
        }
      });
      dataGetAll.getTrees.forEach(createTreeMarker);
    }

    //clear the map container and instance before unmounting the component
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [dataGetAll, selectedTree]);

  //create the tree markers and attach popups
  const createTreeMarker = (tree) => {
    const { northing, easting } = tree.location;
    const popupContent = `
      <b>${tree.species?.commonName}</b><br>
      <i>${tree.garden}</i><br>
      <i>${tree.dbh} inches</i><br>
      Id: ${tree.id}
    `;
    const marker = L.marker([northing, easting])
      .bindPopup(popupContent)
      .addTo(map.current);

    marker.on("popupopen", (event) => {
      const popup = event.popup;
      const popupElement = popup.getElement();
      popupElement.addEventListener("click", () => {
        setSelectedTree(tree);
        setFormValues(tree);
        navigate("/physicaldata");
        map.current.closePopup();
      })
    });
  };

  //create new tree object with lat and lng
  const handleAddTree = (event) => {
    const { lat, lng } = event.latlng;
    const newTree = {
       species: {
        commonName: "",
        scientificName: ""
      },
      variety: "",
      dbh: "",
      photos: "",
      notes: "",
      nonnative: false,
      invasive: false,
      location: {
        northing: lat,
        easting: lng
      },
      garden: "",
      siteInfo: {
        slope: false,
        overheadLines: false,
        treeCluster: false,
        proximateStructure: false,
        proximateFence: false
      },
      lastVisited: "",
      installedDate: "",
      installedBy: "",
      felledDate: "",
      felledBy: "",
      maintenanceNeeds: {
        install: false,
        raiseCrown: false,
        routinePrune: false,
        trainingPrune: false,
        priorityPrune: false,
        pestTreatment: false,
        installGrate: false,
        removeGrate: false,
        fell: false,
        removeStump: false
      },
      careHistory: "",
      hidden: false
    };
    setFormValues(newTree);
    navigate("/physicaldata")
  }

  if (loadingGetAll || loadingAddOne || loadingUpdateOne) {
    return <p>Loading...</p>;
  }
  if (errorGetAll || errorAddOne || errorUpdateOne) {
    return <p>Error: {errorGetAll?.message || errorAddOne?.message || errorUpdateOne?.message}</p>;
  }

  return (
    <div id="map" ref = {mapRef} style = {{ height: "100vh", width: "100vw" }}></div>
  );
};

export default TreeMap;