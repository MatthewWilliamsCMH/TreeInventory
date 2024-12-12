import React, { useEffect, useRef, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { GET_TREES } from "../../queries/get_trees";
import { GET_TREE } from "../../queries/get_tree"; //needed?
import { ADD_TREE } from "../../mutations/add_tree";
import { UPDATE_TREE } from "../../mutations/update_tree";
// import { GET_HIDDEN_TREES } from "../queries/get_hidden_trees";

// import PhysicalDataForm from "../PhysicalData/PhysicalDataForm";

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