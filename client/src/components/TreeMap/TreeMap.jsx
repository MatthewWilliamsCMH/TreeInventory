//----------Import----------
//external libraries
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import leaflet from 'leaflet';
import 'leaflet.gridlayer.googlemutant';

//local components
import AppContext from '../../appContext';
import FilterDrawer from './FilterDrawer.jsx';

//project-specific helpers
import { generateTreeMarkerIcon } from '../../utils/helpers.js';

//project-specific mutations
import { UPDATE_TREE_LOCATION } from '../../mutations/update_tree_location';

//styles (load order is important)
import 'leaflet/dist/leaflet.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './treeMap.module.css';

//----------Create Component----------
const TreeMap = () => {
  //initialize React hooks (e.g., useRef, useNavigate, custom hooks)
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const previousSelectedTreeRef = useRef(null);
  const userLocationRef = useRef(null);

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

  //define local states and set initial values
  const [markerRadius, setMarkerRadius] = useState(6);
  const filteredTrees = useMemo(() => {
    if (!mergedTrees || !Array.isArray(mergedTrees)) return [];

    return mergedTrees.filter((tree) => {
      if (!filterCriteria.hidden && tree.hidden) return false;
      if (!filterCriteria.nonnative && tree.nonnative) return false;
      if (!filterCriteria.invasive && tree.invasive) return false;

      for (const [key, isOn] of Object.entries(filterCriteria.careNeeds || {})) {
        if (!isOn && tree.careNeeds?.[key]) return false;
      }

      for (const [key, isOn] of Object.entries(filterCriteria.siteInfo || {})) {
        if (!isOn && tree.siteInfo?.[key]) return false;
      }

      const speciesMatch = filterCriteria.commonName?.includes(tree.commonName);
      const dbhMatch = !tree.dbh?.trim() || filterCriteria.dbh?.includes(tree.dbh);
      const gardenMatch = !tree.garden?.trim() || filterCriteria.garden?.includes(tree.garden);

      return speciesMatch && dbhMatch && gardenMatch;
    });
  }, [mergedTrees, filterCriteria]);

  //define mutations (using Apollo Client)
  const [updateTreeLocation] = useMutation(UPDATE_TREE_LOCATION);

  //useEffects
  //create map
  useEffect(() => {
    if (!mapRef.current || map.current) return;

    map.current = leaflet.map(mapRef.current, {
      zoomControl: false,
      center: mapCenter,
      zoom: mapZoom,
      tapTolerance: 15,
      tapHold: false,
    });
    //tile-layer options
    // leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:23}).addTo(map.current);
    // leaflet.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg', {maxZoom:23}).addTo(map.current);
    const googleMutant = leaflet.gridLayer
      .googleMutant({
        maxZoom: 24,
        type: 'satellite',
        attribution: '...',
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      })
      .addTo(map.current);

    navigator.geolocation.watchPosition(
      ({ coords: { latitude, longitude } }) => {
        if (!map.current) return;
        if (userLocationRef.current && map.current.hasLayer(userLocationRef.current)) {
          map.current.removeLayer(userLocationRef.current);
        }

        userLocationRef.current = leaflet
          .circle([latitude, longitude], {
            radius: 8,
            weight: 4,
            color: '#FFFF00',
            fillOpacity: 0.3,
          })
          .addTo(map.current);
      },
      (error) => console.log('Geolocation error:', error)
    );

    map.current.on('click', handleAddTree);
    map.current.on('zoomend', () => setMapZoom(map.current.getZoom()));

    return () => {
      const leafletCenter = map.current.getCenter();
      setMapCenter([leafletCenter.lat, leafletCenter.lng]);
      map.current.remove();
      map.current = null;
      markersRef.current = [];
    };
  }, []);

  //add a new tree if user logged in
  useEffect(() => {
    if (!map.current) return;

    if (isLoggedIn) {
      map.current.on('click', handleAddTree);
      return () => {
        if (map.current) map.current.off('click', handleAddTree);
      };
    }

    map.current.off('click', handleAddTree);
  }, [isLoggedIn]);

  //update markers when filteredTrees or allSpecies change
  useEffect(() => {
    if (!map.current || !filteredTrees || !allSpecies) return;

    markersRef.current.forEach(({ marker }) => map.current.removeLayer(marker));
    markersRef.current = [];
    filteredTrees.forEach((tree) => {
      createTreeMarker(tree, allSpecies);
    });
  }, [filteredTrees, allSpecies]);

  //update marker radius and icons on zoom change
  useEffect(() => {
    const newRadius = Math.min(Math.max(Math.floor((mapZoom - 18) * 3 + 6), 6), 24) || 6;
    setMarkerRadius(newRadius);

    markersRef.current.forEach((markerInfo) => {
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
    const species = speciesMap.find((species) => species.commonName === tree.commonName);
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
          ? `<img src="${tree.photos.environs?.url}" alt="Environs" style="max-width: 100px; max-height: 100px;"><br>`
          : ''
      }
      Id: ${tree.id}<br>
      <b>${tree.commonName}</b><br>
      <i>${tree.scientificName}</i><br>
      Family: <span style="display: inline-block; width: 12px; height: 12px; background-color: ${
        tree.markerColor
      }; margin-right: 5px;"></span>${tree.family}<br>
      DBH: ${tree.dbh} inches
    `;

    const marker = leaflet
      .marker([northing, easting], {
        icon: myIcon,
        riseOnHover: true,
        interactive: true,
        bubblingMouseEvents: false,
      })
      .addTo(map.current);

    const markerInfo = {
      marker,
      tree,
      species,
      opacity: 1,
      draggable: false,
    };

    markersRef.current.push(markerInfo);

    marker.on('dragend', function (event) {
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

    marker.on('click', (event) => {
      //if second click within the delay run dblclick handler
      if (clickTimer) {
        return;
      }

      if (previousSelectedTreeRef.current) {
        const prevMarkerInfo = markersRef.current.find(
          (m) => m.tree.id === previousSelectedTreeRef.current.id
        );
        if (prevMarkerInfo) {
          prevMarkerInfo.marker.setIcon(
            generateTreeMarkerIcon({
              tree: prevMarkerInfo.tree,
              species: prevMarkerInfo.species,
              radius: markerRadius,
              opacity: prevMarkerInfo.opacity,
              isSelected: false,
            })
          );
        }
      }

      const markerInfo = markersRef.current.find((m) => m.tree.id === tree.id);
      if (markerInfo) {
        markerInfo.marker.setIcon(
          generateTreeMarkerIcon({
            tree,
            species,
            radius: markerRadius,
            opacity: markerInfo.opacity,
            isSelected: true,
          })
        );
      }

      previousSelectedTreeRef.current = tree;
      setSelectedTree(tree);

      //if no second click within the delay treat as single click
      clickTimer = setTimeout(() => {
        marker.bindPopup(popupContent).openPopup();
        clickTimer = null;
      }, clickDelay);
    });

    marker.on('dblclick', (event) => {
      //clear single-click timer to prevent popup
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }

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
      const currentRadius = Math.min(Math.max(Math.floor((currentZoom - 18) * 3 + 6), 6), 24) || 6;
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
    });

    marker.on('popupopen', (event) => {
      const popup = event.popup;
      const popupElement = popup.getElement();

      //prevent navigation when clicking close button
      const closeButton = popupElement.querySelector('.leaflet-popup-close-button');
      if (closeButton) {
        closeButton.addEventListener('click', (event) => {
          event.stopPropagation();
        });
      }

      //allow navigation when any part of popup except close button is clicked
      popupElement.addEventListener('click', () => {
        if (previousSelectedTreeRef.current) {
          const prevMarkerInfo = markersRef.current.find(
            (m) => m.tree.id === previousSelectedTreeRef.current.id
          );
          if (prevMarkerInfo) {
            prevMarkerInfo.marker.setIcon(
              generateTreeMarkerIcon({
                tree: prevMarkerInfo.tree,
                species: prevMarkerInfo.species,
                radius: markerRadius,
                opacity: prevMarkerInfo.opacity,
                isSelected: false,
              })
            );
          }
        }

        const isSelected = true;
        const newIcon = generateTreeMarkerIcon({
          tree,
          species,
          radius: markerRadius,
          opacity: 1,
          isSelected,
        });
        const markerInfo = markersRef.current.find((m) => m.tree.id === tree.id);
        if (markerInfo) {
          markerInfo.marker.setIcon(newIcon);
        }
        previousSelectedTreeRef.current = tree;
        setSelectedTree(tree);
        setWorkingTree(tree);
        setFormColor({ backgroundColor: tree.invasive ? '#FFDEDE' : 'white' });
        if (isLoggedIn) {
          navigate('/TreeData');
        } else {
          navigate('/TreeDetails');
        }
        map.current.closePopup();
      });
    });

    //change cursor when hovering over marker
    marker.on('mouseover', () => {
      map.current.getContainer().style.cursor = 'pointer';
    });

    marker.on('mouseout', () => {
      map.current.getContainer().style.cursor = 'default';
    });
  };

  //create new tree object with lat and lng complete but other fields blank
  const handleAddTree = (event) => {
    const { lat, lng } = event.latlng;
    const newTree = {
      commonName: '',
      variety: '',
      dbh: '',
      photos: {
        bark: { url: '', publicId: '' },
        summerLeaf: { url: '', publicId: '' },
        autumnLeaf: { url: '', publicId: '' },
        fruit: { url: '', publicId: '' },
        flower: { url: '', publicId: '' },
        environs: { url: '', publicId: '' },
      },
      notes: '',
      location: {
        northing: lat,
        easting: lng,
      },
      garden: '',
      siteInfo: {
        slope: false,
        overheadLines: false,
        treeCluster: false,
        proximateStructure: false,
        proximateFence: false,
        propertyLine: false,
      },
      lastUpdated: '',
      installedDate: '',
      installedBy: '',
      felledDate: '',
      felledBy: '',
      careNeeds: {
        multistem: false,
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
    setFormColor({ backgroundColor: 'white' });
    navigate('/TreeData');
  };

  //----------Render Component----------
  return (
    <>
      <div
        id='filter-thumb'
        className={`${styles.filterThumb} ${
          filterOpen ? styles.filterThumbOpen : styles.filterThumbClose
        }`}
        onClick={() => setFilterOpen((prev) => !prev)}
      >
        <i className='bi-filter'></i>
      </div>
      <div
        id='map'
        className={styles.map}
        ref={mapRef}
        style={{ height: '100vh', width: '100vw' }}
      ></div>
      <FilterDrawer filteredTrees={filteredTrees} />
    </>
  );
};

export default TreeMap;
