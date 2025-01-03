import React, { useEffect, useRef, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.gridlayer.googlemutant";

import { GET_TREES } from "../../queries/get_trees";
import { ADD_TREE } from "../../mutations/add_tree";
import { UPDATE_TREE } from "../../mutations/update_tree";
import { UPDATE_TREE_LOCATION } from "../../mutations/update_tree_location";

const TreeMap = () => {
  const navigate = useNavigate();  //enable routing
  
  //accept objects and functions for storing data
  const { selectedTree, setSelectedTree, treeLocation, setTreeLocation, setFormValues } = useOutletContext();

  //set up queries and mutations
  const { loading: getAllLoading, error: getAllError, data: getAllData } = useQuery(GET_TREES, {fetchPolicy: "network-only"}); //fetch all trees
  const [addTree, { loading: addTreeLoading, error: addTreeError}] = useMutation(ADD_TREE); //add one tree
  const [updateTree, { loading: updateTreeLoading, error: updateTreeError}] = useMutation(UPDATE_TREE)//update one tree
  const [updateTreeLocation, { loading: updateTreeLocationLoading, error: updateTreeLocationError}] = useMutation(UPDATE_TREE_LOCATION)//update location of one tree
  
  //initialize map
  const mapRef = useRef(null); //use ref for map container
  const map = useRef(null); //use ref to store Leaflet map instance

  useEffect(() => {
    //the map container exists but is empty
    if (mapRef.current && !map.current) {
      map.current = L.map(mapRef.current).setView([39.97738230836944, -83.04934859084177], 19);
      //alternate tile layers
      // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom:23}).addTo(map.current);
      // L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg', {maxZoom:23}).addTo(map.current);
      const googleMutant = L.gridLayer.googleMutant({
        maxZoom: 24,
        type: 'satellite', // Choose your tile type (e.g., 'roadmap', 'satellite', 'terrain', 'hybrid')
        attribution: '&copy; <a href="https://www.google.com/intl/en-US_US/help/terms_maps.html">Google</a>',
        apiKey: 'AIzaSyA5piHGoJrVT5jKhaVezZUwOoPUAAYQcJs'
      }).addTo(map.current);

      map.current.on("click", handleAddTree);
    }

    //remove old data and fetch the data anew
    if (map.current && getAllData?.getTrees) {
      map.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.current.removeLayer(layer);
        }
      });
      getAllData.getTrees.forEach(createTreeMarker);
    }

    //clear the map container and instance before unmounting the component
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [getAllData, selectedTree]);

  //create the tree markers and attach popups
  const createTreeMarker = (tree) => {
    const { northing, easting } = tree.location;
    const markerColor = tree.species.markerColor || "white";
    // Create an inline SVG icon with dynamic color; when ready, set color based on tree species
    // switch (tree.species.commonName) {
    // case "Common hackberry":
    //   iconColor = "green";
    //   break;
    // case "Siberian elm":
    //   iconColor = "blue"
    //   break;
    // case "Red maple":
    //   iconColor = "red"
    //   break;
    // case "Eastern redbud":
    //   iconColor = "pink"
    //   break;
    // case "Black maple":
    //   iconColor = "lightBlue"
    //   break;
    // case "American sycamore":
    //   iconColor = "purple"
    //   break;
    // case "Honey locust":
    //   iconColor = "gold"
    //   break;
    // case "Norway maple":
    //   iconColor = "orange"
    //   break;
    // default:
    //   iconColor = "white"
    // }
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="6" fill="${markerColor}" stroke="black" stroke-width="1"/>
      </svg>
    `;

    const myIcon = L.icon({
      iconUrl: "data:image/svg+xml;base64," + btoa(svgIcon),
      iconSize: [10, 10],
      iconRetinaUrl: "data:image/svg+xml;base64," + btoa(svgIcon),
    });
    // to use the following, change species from key-value pair to an object and add markerColor to the object. Will require a lot of refactoring.
    // const markerColor = tree.species.markerColor;
    const popupContent = `
      <b>${tree.species?.commonName}</b><br>
      <i>${tree.dbh} inches</i><br>
      Id: ${tree.id}
    `;
    
    const marker = L.marker([northing, easting], {
      draggable: "true",
      icon: myIcon
    })
      .bindPopup(popupContent)
      .addTo(map.current);

    marker.on('dragend', function(event){
      const { lat, lng } = event.target._latlng;
      const draggedTreeId = tree.id;
      const { data } = updateTreeLocationMutation({
        variables: {
          id: draggedTreeId,
          location: {
            northing: lat,
            easting: lng
          }
        }
      })
    });

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
        scientificName: "",
        nonnative: false,
        invasive: false,
        markerColor: ""
      },
      variety: "",
      dbh: "",
      photos: {
        bark: "",
        summerLeaf: "",
        autumnLeaf: "",
        fruit: "",
        flower: "",
        environs: ""
      },
      notes: "",
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

  if (getAllLoading || addTreeLoading || updateTreeLoading|| updateTreeLocationLoading) {
    return <p>Loading...</p>;
  }
  if (getAllError || addTreeError || updateTreeError) {
    return <p>Error: {getAllError?.message || addTreeError?.message || updateTreeError?.message}</p>;
  }

  return (
    <div id="map" ref = {mapRef} style = {{ height: "100vh", width: "100vw" }}></div>
  );
};

export default TreeMap;