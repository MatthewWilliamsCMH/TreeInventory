//----------Import----------
//external libraries
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import leaflet from "leaflet";
import "leaflet.gridlayer.googlemutant";

//local components
import AppContext from "../../appContext";
import FilterDrawer from "./FilterDrawer.jsx";

//project-specific helpers
import { generateTreeMarkerIcon } from "../../utils/helpers.js";

//project-specific mutations
import { UPDATE_TREE_LOCATION } from "../../mutations/update_tree_location";

//styles (load order is important)
import "leaflet/dist/leaflet.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./treeMap.module.css";

//----------Create Component----------
const TreeMap = () => {
  //access global states from parent (using Context)
  const {
    allSpecies,
    allTrees,
    filterCriteria,
    filterOpen,
    formColor,
    isLoggedIn,
    mapCenter,
    mapZoom,
    mergedTrees,
    selectedTree,
    setAllSpecies,
    setAllTrees,
    setFilterOpen,
    setFormColor,
    setMapCenter,
    setMapZoom,
    setSelectedTree,
    setWorkingTree,
  } = useContext(AppContext);

  //initialize React hooks (e.g., useRef, useNavigate, custom hooks)
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const userLocationRef = useRef(null);
  const previousSelectedTreeRef = useRef(null);
  const isLoggedInRef = useRef(isLoggedIn);

  //define local states and set initial values
  const [markerRadius, setMarkerRadius] = useState(6);
  // const filteredTrees = useMemo(() => {
  //   if (!mergedTrees || !Array.isArray(mergedTrees)) return [];

  //   return mergedTrees.filter((tree) => {
  //     if (!filterCriteria.multistem && tree.multistem) return false;
  //     if (!filterCriteria.hidden && tree.hidden) return false;
  //     if (!filterCriteria.nonnative && tree.nonnative) return false;
  //     if (!filterCriteria.invasive && tree.invasive) return false;

  //     for (const [key, isOn] of Object.entries(
  //       filterCriteria.careNeeds || {},
  //     )) {
  //       if (!isOn && tree.careNeeds?.[key]) return false;
  //     }

  //     for (const [key, isOn] of Object.entries(
  //       filterCriteria.siteConditions || {},
  //     )) {
  //       if (!isOn && tree.siteConditions?.[key]) return false;
  //     }

  //     const speciesMatch = filterCriteria.commonName?.includes(tree.commonName);
  //     const dbhMatch =
  //       !tree.dbh?.trim() || filterCriteria.dbh?.includes(tree.dbh);
  //     const gardenMatch =
  //       !tree.garden?.trim() || filterCriteria.garden?.includes(tree.garden);

  //     return speciesMatch && dbhMatch && gardenMatch;
  //   });
  // }, [mergedTrees, filterCriteria]);

  const filteredTrees = useMemo(() => {
    if (!mergedTrees || !Array.isArray(mergedTrees)) return [];

    return mergedTrees.filter((tree) => {
      // top-level toggles
      if (!filterCriteria.multistem && tree.multistem) return false;
      if (!filterCriteria.hidden && tree.hidden) return false;
      if (!filterCriteria.nonnative && tree.nonnative) return false;
      if (!filterCriteria.invasive && tree.invasive) return false;

      // careNeeds nested toggles
      for (const [key, isOn] of Object.entries(
        filterCriteria.careNeeds || {},
      )) {
        if (key === "noCareNeedFlags") continue; // skip pseudo-toggle here
        if (!isOn && tree.careNeeds?.[key]) return false; // exclude tree if toggle off
      }

      // pseudo-toggle for trees with no care-need flags
      const hasAnyFlag = Object.keys(filterCriteria.careNeeds || {})
        .filter((k) => k !== "noCareNeedFlags")
        .some((k) => tree.careNeeds?.[k]);
      if (!filterCriteria.careNeeds?.noCareNeedFlags && !hasAnyFlag) {
        return false; // remove tree with no flags
      }

      // siteConditions nested toggles
      for (const [key, isOn] of Object.entries(
        filterCriteria.siteConditions || {},
      )) {
        if (key === "noSiteConditionFlags") continue;
        if (!isOn && tree.siteConditions?.[key]) return false;
      }

      // pseudo-toggle for trees with no site-condition flags
      const hasAnySiteFlag = Object.keys(filterCriteria.siteConditions || {})
        .filter((k) => k !== "noSiteConditionFlags")
        .some((k) => tree.siteConditions?.[k]);
      if (
        !filterCriteria.siteConditions?.noSiteConditionFlags &&
        !hasAnySiteFlag
      ) {
        return false;
      }

      // typeahead filters
      const speciesMatch = filterCriteria.commonName?.includes(tree.commonName);
      const dbhMatch =
        !tree.dbh?.trim() || filterCriteria.dbh?.includes(tree.dbh);
      const gardenMatch =
        !tree.garden?.trim() || filterCriteria.garden?.includes(tree.garden);

      return speciesMatch && dbhMatch && gardenMatch;
    });
  }, [mergedTrees, filterCriteria]);

  //define mutations (using Apollo Client)
  const [updateTreeLocation] = useMutation(UPDATE_TREE_LOCATION);

  //useEffects
  //create map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = leaflet.map(mapContainerRef.current, {
      zoomControl: false,
      center: mapCenter,
      zoom: mapZoom,
      tapTolerance: 15,
      tapHold: false,
    });
    //tile-layer options
    // leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:23}).addTo(mapRef.current);
    // leaflet.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg', {maxZoom:23}).addTo(mapRef.current);
    const googleMutant = leaflet.gridLayer
      .googleMutant({
        maxZoom: 24,
        type: "satellite",
        attribution: "...",
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      })
      .addTo(mapRef.current);

    //commented out because it's not centering on user location, and right now, I don't need it; I'll reactivate it when I do
    // navigator.geolocation.watchPosition(
    //   ({ coords: { latitude, longitude } }) => {
    //     if (!mapRef.current) return;
    //     if (userLocationRef.current && mapRef.current.hasLayer(userLocationRef.current)) {
    //       mapRef.current.removeLayer(userLocationRef.current);
    //     }

    //     userLocationRef.current = leaflet
    //       .circle([latitude, longitude], {
    //         radius: 8,
    //         weight: 4,
    //         color: '#FFFF00',
    //         fillOpacity: 0.3,
    //       })
    //       .addTo(mapRef.current);
    //   },
    //   (error) => console.log('Geolocation error:', error),
    // );

    mapRef.current.on("click", handleAddTree);
    mapRef.current.on("zoomend", () => setMapZoom(mapRef.current.getZoom()));

    return () => {
      const leafletCenter = mapRef.current.getCenter();
      setMapCenter([leafletCenter.lat, leafletCenter.lng]);
      mapRef.current.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  //keep isLoggedInRef updated with latest value of isLoggedIn so it can be accessed in event handlers without stale closure issues
  useEffect(() => {
    isLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn]);

  //add a new tree if user logged in
  useEffect(() => {
    if (!mapRef.current) return;

    if (isLoggedInRef.current) {
      mapRef.current.on("click", handleAddTree);
      return () => {
        if (mapRef.current) mapRef.current.off("click", handleAddTree);
      };
    }

    mapRef.current.off("click", handleAddTree);
  }, [isLoggedIn]);

  //update markers when filteredTrees or allSpecies change
  useEffect(() => {
    if (!mapRef.current || !filteredTrees || !allSpecies) return;

    Object.values(markersRef.current).forEach(({ marker }) =>
      mapRef.current.removeLayer(marker),
    );
    markersRef.current = {};
    filteredTrees.forEach((tree) => {
      createTreeMarker(tree, allSpecies);
    });
  }, [filteredTrees, allSpecies]);

  //update marker radius and icons on zoom change
  useEffect(() => {
    const newRadius =
      Math.min(Math.max(Math.floor((mapZoom - 18) * 3 + 6), 6), 24) || 6;
    setMarkerRadius(newRadius);

    Object.values(markersRef.current).forEach((markerInfo) => {
      const { marker, tree, species, opacity = 1 } = markerInfo;
      const isSelected = selectedTree?.id === tree.id;
      const updatedIcon = generateTreeMarkerIcon({
        tree,
        species,
        radius: newRadius,
        opacity,
        isSelected,
      });
      marker.setIcon(updatedIcon);
    });
  }, [mapZoom]);

  //handlers and callback functions
  //create the tree markers and attach popups
  const createTreeMarker = (tree, speciesMap) => {
    const { northing, easting } = tree.location;
    const species = speciesMap.find(
      (species) => species.commonName === tree.commonName,
    );
    const isSelected = selectedTree?.id === tree.id;
    const myIcon = generateTreeMarkerIcon({
      tree,
      species,
      radius: markerRadius,
      opacity: 1,
      isSelected,
    });
    const popupContent = `
      ${
        tree.photos.environs?.url
          ? `<img src="${tree.photos.environs?.url}" alt="Environs" style="max-width: 100px; max-height: 100px; padding-bottom: 10px;"><br>`
          : ""
      }
      <b>${tree.commonName}</b><br>
      <i>${tree.scientificName}</i><br>
      Family: <span style="display: inline-block; width: 12px; height: 12px; background-color: ${
        tree.markerColor
      }; margin-right: 5px;"></span>${tree.family}<br>
      DBH: ${tree.dbh} inches<br>
      Last Updated: ${tree.lastUpdated ? new Date(parseInt(tree.lastUpdated)).toLocaleDateString("en-US") : "N/A"}
     `;

    const marker = leaflet
      .marker([northing, easting], {
        icon: myIcon,
        riseOnHover: true,
        interactive: true,
        bubblingMouseEvents: false,
      })
      .addTo(mapRef.current);

    const markerInfo = {
      marker,
      tree,
      species,
      opacity: 1,
      draggable: false,
    };

    markersRef.current[tree.id] = markerInfo;

    marker.on("dragend", function (event) {
      const { lat, lng } = event.target._latlng;
      const draggedTreeId = tree.id;
      updateTreeLocation({
        variables: {
          id: draggedTreeId,
          location: {
            northing: lat,
            easting: lng,
          },
        },
      });
    });

    //click timer to differentiate between single and double clicks
    let clickTimer = null;
    const clickDelay = 200;

    marker.on("click", (event) => {
      //if second click within the delay run dblclick handler
      if (clickTimer) {
        return;
      }

      mapRef.current.getContainer().style.cursor = "pointer";
      marker.bindPopup(popupContent).openPopup();

      //if a tree was already selected, find its id and set its marker back to normal
      if (selectedTree && markersRef.current[selectedTree.id]) {
        markersRef.current[selectedTree.id].marker.setIcon(
          generateTreeMarkerIcon({
            tree: selectedTree,
            species: markersRef.current[selectedTree.id].species,
            isSelected: false,
          }),
        );
      }

      //establish newly selected tree
      const isSelected = true;
      setSelectedTree(tree);
      setWorkingTree(tree);
      //if no second click within the delay treat as single click
      clickTimer = setTimeout(() => {
        marker.bindPopup(popupContent).openPopup();
        clickTimer = null;
      }, clickDelay);
    });

    marker.on("dblclick", (event) => {
      //clear single-click timer to prevent popup
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }

      if (isLoggedInRef.current) {
        //close popup
        if (marker.isPopupOpen()) {
          marker.closePopup();
        }

        //stop event from triggering map's double-click zoom
        leaflet.DomEvent.stopPropagation(event);

        //toggle draggable state
        markerInfo.draggable = !markerInfo.draggable;
        if (markerInfo.draggable) {
          marker.dragging.enable();
        } else {
          marker.dragging.disable();
        }

        //toggle opacity
        markerInfo.opacity = markerInfo.opacity === 1 ? 0.5 : 1;

        //calculate current radius based on actual zoom level
        const currentZoom = map.current.getZoom();
        const currentRadius =
          Math.min(Math.max(Math.floor((currentZoom - 18) * 3 + 6), 6), 24) ||
          6;
        const isSelected = selectedTree?.id === tree.id;

        //generate new icon with updated opacity and current radius
        const updatedIcon = generateTreeMarkerIcon({
          tree,
          species,
          radius: currentRadius,
          opacity: markerInfo.opacity,
          isSelected,
        });
        marker.setIcon(updatedIcon);
      }
    });

    marker.on("popupopen", (event) => {
      const popup = event.popup;
      const popupElement = popup.getElement();

      //prevent navigation when clicking close button
      const closeButton = popupElement.querySelector(
        ".leaflet-popup-close-button",
      );
      if (closeButton) {
        closeButton.addEventListener("click", (event) => {
          event.stopPropagation();
        });
      }

      //allow navigation when any part of popup except close button is clicked
      popupElement.addEventListener("click", () => {
        if (selectedTree && markersRef.current[selectedTree.id]) {
          markersRef.current[selectedTree.id].marker.setIcon(
            generateTreeMarkerIcon({
              tree: selectedTree,
              species: markersRef.current[selectedTree.id].species,
              isSelected: false,
            }),
          );
        }

        //establish newly selected tree
        const isSelected = true;
        setSelectedTree(tree);
        setWorkingTree(tree);
        setFormColor({ backgroundColor: tree.invasive ? "#FFDEDE" : "white" });
        if (isLoggedInRef.current) {
          navigate("/TreeData");
        } else {
          navigate("/TreeDetails");
        }
        mapRef.current.closePopup();
      });
    });

    //change cursor when hovering over marker
    marker.on("mouseover", () => {
      mapRef.current.getContainer().style.cursor = "pointer";
    });

    marker.on("mouseout", () => {
      mapRef.current.getContainer().style.cursor = "default";
    });
  };

  //create new tree object with lat and lng complete but other fields blank
  const handleAddTree = (event) => {
    const { lat, lng } = event.latlng;
    const newTree = {
      commonName: "",
      variety: "",
      dbh: "",
      multistem: false,
      photos: {
        bark: { url: "", publicId: "" },
        summerLeaf: { url: "", publicId: "" },
        autumnLeaf: { url: "", publicId: "" },
        fruit: { url: "", publicId: "" },
        flower: { url: "", publicId: "" },
        environs: { url: "", publicId: "" },
      },
      notes: "",
      location: {
        northing: lat,
        easting: lng,
      },
      garden: "",
      siteConditions: {
        slope: false,
        overheadLines: false,
        treeCluster: false,
        proximateStructure: false,
        proximateFence: false,
        propertyLine: false,
      },
      lastUpdated: "",
      installedDate: "",
      installedBy: "",
      felledDate: "",
      felledBy: "",
      careNeeds: {
        structuralSupport: false,
        raiseCrown: false,
        routinePrune: false,
        trainingPrune: false,
        priorityPrune: false,
        pestTreatment: false,
        installGrate: false,
        removeGrate: false,
        fell: false,
        removeStump: false,
      },
      hidden: false,
    };
    setSelectedTree(newTree);
    setWorkingTree(newTree);
    setFormColor({ backgroundColor: "white" });
    navigate("/TreeData");
  };

  //----------Render Component----------
  return (
    <>
      <div
        id="filter-thumb"
        className={`${styles.filterThumb} ${
          filterOpen ? styles.filterThumbOpen : styles.filterThumbClose
        }`}
        onClick={() => setFilterOpen((prev) => !prev)}
      >
        <i className="bi-filter"></i>
      </div>
      <div
        id="map"
        className={styles.map}
        ref={mapContainerRef}
        style={{ height: "100vh", width: "100vw" }}
      ></div>
      <FilterDrawer filteredTrees={filteredTrees} />
    </>
  );
};

export default TreeMap;
