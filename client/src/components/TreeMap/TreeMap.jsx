import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.gridlayer.googlemutant';

import { GET_TREES } from '../../queries/get_trees';
import { GET_SPECIES } from '../../queries/get_species';
import { UPDATE_TREE_LOCATION } from '../../mutations/update_tree_location';

const TreeMap = () => {
  const navigate = useNavigate();

  // Initialize map
  const mapRef = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]); 
  const userLocationRef = useRef(null);

  // Get global states from parent component
  const { 
    setSelectedTree, 
    setUpdatedTree, 
    mapZoom, setMapZoom, 
    mapCenter, setMapCenter,
    setFormStyle 
  } = useOutletContext();

  // Establish local states
  const [markerRadius, setMarkerRadius] = useState(6);

  // Set up queries and mutations
  const { loading: getTreesLoading, error: getTreesError, data: getTreesData } = useQuery(GET_TREES, {fetchPolicy: 'network-only'}); // Fetch all trees
  const { loading: getSpeciesLoading, error: getSpeciesError, data: getSpeciesData } = useQuery(GET_SPECIES);
  const [updateTreeLocation] = useMutation(UPDATE_TREE_LOCATION, {fetchPolicy:'no-cache'});

  // Centralized code to generate markers
  const generateTreeMarkerIcon = (tree, speciesInfo, radius) => {
    const markerStrokeWidth = tree.lastUpdated > '1741132800' ? '3' : '1'; // This is temporary to distinguish verified trees from unverified ones
    const iconSize = (radius * 2) + parseInt(markerStrokeWidth); // parseInt converts string '3' or '1' to integer
    const markerColor = speciesInfo.markerColor || 'FFFFFF';

    const svgIcon = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${iconSize} ${iconSize}'>
        <circle cx='${iconSize/2}' cy='${iconSize/2}' r='${radius}' fill='${markerColor}' stroke='lightgray' stroke-width='${markerStrokeWidth}'/>
      </svg>
    `;

    return L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
      iconSize: [iconSize, iconSize],
      iconRetinaUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon)
    });
  };

  // Create the tree markers and attach popups - MODIFIED TO AVOID HOOKS INSIDE
  const createTreeMarker = (tree, speciesMap) => {
    const { northing, easting } = tree.location;
    const speciesInfo = speciesMap[tree.commonName];
    const myIcon = generateTreeMarkerIcon(tree, speciesInfo, markerRadius);
    const popupContent = `
      Id: ${tree.id}<br>
      <b>${tree.commonName}</b><br>
      <i>${tree.scientificName}</i><br>
      Family: <span style="display: inline-block; width: 12px; height: 12px; background-color: ${tree.markerColor}; margin-right: 5px;"></span>${tree.family}<br>
      DBH: ${tree.dbh} inches
    `;
    
    // Create marker with draggable initially set to false
    const marker = L.marker(
      [northing, easting], {
        draggable: false,
        icon: myIcon,
        riseOnHover: true,
        interactive: true,
        bubblingMouseEvents: false
      }
    )
    .bindPopup(popupContent)
    .addTo(map.current);
    
    // Store the marker in the markers array
    markersRef.current.push({
      marker,
      tree,
      speciesInfo
    });
    
    // Initialize long press properties directly on the marker
    marker._longPressData = {
      pressTimer: null,
      startPos: null,
      longPressThreshold: 500, // 1 second
      moveThreshold: 5 // 5 pixels
    };
    
    // Start long press timer on mouse down
    marker.on('mousedown', (event) => {
      L.DomEvent.stopPropagation(event); // Prevent map from getting this event
      
      marker._longPressData.startPos = { 
        x: event.originalEvent.clientX, 
        y: event.originalEvent.clientY 
      };
      
      // Clear any existing timer
      if (marker._longPressData.pressTimer) {
        clearTimeout(marker._longPressData.pressTimer);
      }
      
      // Set new timer
      marker._longPressData.pressTimer = setTimeout(() => {
        // After threshold time, enable dragging
        marker.dragging.enable();
        // Visual feedback that marker is now draggable
        map.current.getContainer().style.cursor = 'move';
      }, marker._longPressData.longPressThreshold);
    });
    
    // Cancel timer if mouse up before threshold
    marker.on('mouseup', () => {
      if (marker._longPressData.pressTimer) {
        clearTimeout(marker._longPressData.pressTimer);
        marker._longPressData.pressTimer = null;
      }
      
      if (!marker.dragging._enabled) {
        // If dragging wasn't enabled, this was just a regular click
        // Regular click behavior is already handled by popup
      }
    });
    
    // Cancel timer if mouse moves too much before threshold
    marker.on('mousemove', (event) => {
      if (marker._longPressData.startPos && marker._longPressData.pressTimer) {
        const currentPos = { 
          x: event.originalEvent.clientX, 
          y: event.originalEvent.clientY 
        };
        
        const distance = Math.sqrt(
          Math.pow(currentPos.x - marker._longPressData.startPos.x, 2) + 
          Math.pow(currentPos.y - marker._longPressData.startPos.y, 2)
        );
        
        if (distance > marker._longPressData.moveThreshold) {
          // User is trying to pan, cancel the timer
          clearTimeout(marker._longPressData.pressTimer);
          marker._longPressData.pressTimer = null;
          marker._longPressData.startPos = null;
        }
      }
    });
    
    // Cancel timer if mouse leaves the marker before threshold
    marker.on('mouseout', () => {
      if (marker._longPressData.pressTimer) {
        clearTimeout(marker._longPressData.pressTimer);
        marker._longPressData.pressTimer = null;
      }
      marker._longPressData.startPos = null;
      map.current.getContainer().style.cursor = 'default';
    });
    
    // Handle drag end
    marker.on('dragend', (event) => {
      const { lat, lng } = event.target._latlng;
      const draggedTreeId = tree.id;
      
      updateTreeLocation({
        variables: {
          id: draggedTreeId,
          location: {
            northing: lat,
            easting: lng
          }
        }
      });
      
      // Disable dragging after repositioning
      marker.dragging.disable();
      map.current.getContainer().style.cursor = 'default';
    });
    
    marker.on('popupopen', (event) => {
      const popup = event.popup;
      const popupElement = popup.getElement();
      
      // Prevent navigation when clicking the close button
      const closeButton = popupElement.querySelector('.leaflet-popup-close-button');
      if (closeButton) {
        closeButton.addEventListener('click', (event) => {
          event.stopPropagation();
        });
      }
      
      // Allow navigation when any part of the popup is clicked except the close button
      popupElement.addEventListener('click', () => {
        setSelectedTree(tree);
        setUpdatedTree(tree);
        setFormStyle({ backgroundColor: tree.invasive ? '#FFDEDE' : 'white' });
        navigate('/TreeData');
        map.current.closePopup();
      });
    });
    
    // Change cursor when hovering over marker
    marker.on('mouseover', () => {
      map.current.getContainer().style.cursor = 'pointer';
    });
    
    marker.on('mouseout', () => {
      if (!marker.dragging._enabled) {
        map.current.getContainer().style.cursor = 'default';
      }
    });
  };
  
  // Combine add species fields to tree object, which already has tree fields
  const combineTreeAndSpeciesData = (tree, speciesMap) => {
    const speciesInfo = speciesMap[tree.commonName] || {};
    return {
      ...tree,
      scientificName: speciesInfo.scientificName || '',
      nonnative: speciesInfo.nonnative || false,
      invasive: speciesInfo.invasive || false,
      markerColor: speciesInfo.markerColor || 'FFFFFF',
      family: speciesInfo.family || ''
    };
  };

  // Create new tree object with lat and lng complete but other fields blank
  const handleAddTree = (event) => {
    const { lat, lng } = event.latlng;
    const newTree = {
      commonName: '',
      variety: '',
      dbh: '',
      photos: {
        bark: '',
        summerLeaf: '',
        autumnLeaf: '',
        fruit: '',
        flower: '',
        environs: ''
      },
      notes: '',
      location: {
        northing: lat,
        easting: lng
      },
      garden: '',
      siteInfo: {
        slope: false,
        overheadLines: false,
        treeCluster: false,
        proximateStructure: false,
        proximateFence: false
      },
      lastUpdated: '',
      installedDate: '',
      installedBy: '',
      felledDate: '',
      felledBy: '',
      careNeeds: {
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
      hidden: false
    };
    setUpdatedTree(newTree);
    setFormStyle({ backgroundColor: 'white' });
    navigate('/TreeData');
  };

  useEffect(() => {
    // If the map hasn't been initialized or tree and species data hasn't been returned, abort
    if (!mapRef.current || !getTreesData?.getTrees || !getSpeciesData?.getSpecies) {
      return;
    }
    if (!map.current) {
      map.current = L.map(mapRef.current, {
        zoomControl: false,
        center: mapCenter,
        zoom: mapZoom,
        tapTolerance: 15,
        tapHold: false
      });

      // Tile-layer options
      const googleMutant = L.gridLayer.googleMutant({
        maxZoom: 24,
        type: 'satellite', // Other tile types: 'roadmap','terrain', 'hybrid'
        attribution: "&copy; <a href='https://www.google.com/intl/en-US_US/help/terms_maps.html'>Google</a>",
        apiKey: 'AIzaSyA5piHGoJrVT5jKhaVezZUwOoPUAAYQcJs'
      }).addTo(map.current);

      navigator.geolocation.watchPosition(
        ({ coords: { latitude, longitude } }) => {
          if (userLocationRef.current) {
            map.current.removeLayer(userLocationRef.current);
          }

          userLocationRef.current = L.circle([latitude, longitude], {radius: 4, weight: 3, color: '#F542EF', fillOpacity: .5 }).addTo(map.current);
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
      
      // Ensure species data is ready before creating markers
      const speciesMap = getSpeciesData.getSpecies.reduce((acc, species) => {
        acc[species.commonName] = species;
        return acc;
      }, {});

      getTreesData.getTrees.forEach((tree) => {
        const completeTree = combineTreeAndSpeciesData(tree, speciesMap);
        if (tree.felledDate === '') {
          createTreeMarker(completeTree, speciesMap);
        }
      });

      // Handle map events
      map.current.on('click', handleAddTree);
      map.current.on('zoomend', () => { setMapZoom(map.current.getZoom()) });
    }
    
    // Cleanup
    return () => {
      if (map.current) {
        const leafletCenter = map.current.getCenter();
        setMapCenter([leafletCenter.lat, leafletCenter.lng]);
        
        // Clean up any timers attached to markers
        markersRef.current.forEach(({ marker }) => {
          if (marker._longPressData && marker._longPressData.pressTimer) {
            clearTimeout(marker._longPressData.pressTimer);
          }
        });
        
        map.current.remove();
        map.current = null;
        markersRef.current = [];
      }
    };
  }, [getTreesData, getSpeciesData]);

  useEffect(() => {
    const newRadius = Math.min(Math.max(Math.floor((mapZoom - 18) * 3 + 6), 6), 24) || 6;
    const iconSize = newRadius * 2;
    setMarkerRadius(newRadius);

    markersRef.current.forEach(markerInfo => {
      const { marker, tree, speciesInfo } = markerInfo;
      const updatedIcon = generateTreeMarkerIcon(tree, speciesInfo, newRadius);
      marker.setIcon(updatedIcon);
    });
  }, [mapZoom, getTreesData]);

  if (getTreesLoading || getSpeciesLoading) {
    return <p>Wait...</p>;
  }

  if (getTreesError || getSpeciesError) {
    return <p>Error: {getTreesError?.message || getSpeciesError?.message}</p>;
  }

  return (
    <div id='map' ref={mapRef} style={{ height: '100vh', width: '100vw' }}></div>
  );
};

export default TreeMap;