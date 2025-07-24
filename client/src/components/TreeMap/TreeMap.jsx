//---------imports----------
//external libraries
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';

//components
import FilterDrawer from './FilterDrawer.jsx';

//stylesheets
import 'leaflet/dist/leaflet.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './treeMap.module.css';

//mutations
import { UPDATE_TREE_LOCATION } from '../../mutations/update_tree_location';

const TreeMap = () => {
  //initialize hooks
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]); 
  const userLocationRef = useRef(null);

  //get global states from parent component
  const {
    allSpecies, setAllSpecies,
    allTrees, setAllTrees,
    setSelectedTree,
    setUpdatedTree,
    mergedTrees,
    mapCenter, setMapCenter,
    mapZoom, setMapZoom,
    filterOpen, setFilterOpen,
    filterCriteria,
    formColor, setFormColor 
  } = useOutletContext();

  //set local states to initial values
  const [markerRadius, setMarkerRadius] = useState(6)
  const filteredTrees = useMemo(() => {
    if (!mergedTrees || !Array.isArray(mergedTrees)) return [];

    return mergedTrees.filter(tree => {
      //filter selects
      //unremark these once all trees have been updated
      if (!filterCriteria.commonName?.includes(tree.commonName)) return false;
      if (tree.dbh?.trim() && !filterCriteria.dbh?.includes(tree.dbh)) return false;
      if (tree.garden?.trim() && !filterCriteria.garden?.includes(tree.garden)) return false;
      const siteInfoKeys = Object.keys(filterCriteria.siteInfo || {});
      for (const key of siteInfoKeys) {
        if (filterCriteria.siteInfo[key] === false && tree.siteInfo?.[key] === true) return false;
      }
      const careNeedsKeys = Object.keys(filterCriteria.careNeeds || {});
      for (const key of careNeedsKeys) {
        if (filterCriteria.careNeeds[key] === false && tree.careNeeds?.[key] === true) return false;
      }
      if (!filterCriteria.nonnative && tree.nonnative) return false;
      if (!filterCriteria.invasive && tree.invasive) return false;
      if (!filterCriteria.hidden && tree.hidden) return false;

      return true;
    });
  }, [mergedTrees, filterCriteria]);


  //set up mutations
  const [updateTreeLocation] = useMutation(UPDATE_TREE_LOCATION);

  //----------initialize map----------
  //generate marker icons
  const generateTreeMarkerIcon = (tree, species, radius, opacity = 1) => {
    const markerStrokeWidth = tree.lastUpdated > '1741132800' ? '3' : '1'; //temporary; remove after existing trees are updated; DO CONSIDER ADDING THICK STROKE TO SELECTED TREE FOR EASIER IDENTIFICATION
    const iconSize = (radius * 2) + parseInt(markerStrokeWidth);
    const markerColor = species.markerColor || 'FFFFFF';

    const svgIcon = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${iconSize} ${iconSize}'>
        <circle cx='${iconSize/2}' cy='${iconSize/2}' r='${radius}' 
          fill='${markerColor}' fill-opacity='${opacity}' 
          stroke='lightgray' stroke-width='${markerStrokeWidth}'/>
      </svg>
    `;

    return L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
      iconSize: [iconSize, iconSize],
      iconRetinaUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon)
    });
  };

  //----------useEffects----------
  useEffect(() => {
    if (!mapRef.current || map.current) return;

    map.current = L.map(mapRef.current, {
      zoomControl: false,
      center: mapCenter,
      zoom: mapZoom,
      tapTolerance: 15,
      tapHold: false
    });
      //tile-layer options
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:23}).addTo(map.current);
      // L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg', {maxZoom:23}).addTo(map.current);
    const googleMutant = L.gridLayer.googleMutant({
      maxZoom: 24,
      type: 'satellite',
      attribution: "...",
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    }).addTo(map.current);

    navigator.geolocation.watchPosition(
      ({ coords: { latitude, longitude } }) => {
        if (userLocationRef.current && map.current.hasLayer(userLocationRef.current)) {
          map.current.removeLayer(userLocationRef.current);
        }

        userLocationRef.current = L.circle([latitude, longitude], {
          radius: 8,
          weight: 4,
          color: '#FFFF00',
          fillOpacity: 0.3,
        }).addTo(map.current);
      },
      error => console.log("Geolocation error:", error)
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

  useEffect(() => {
    if (!map.current || !filteredTrees || !allSpecies) return;

    // clear all existing markers
    markersRef.current.forEach(({ marker }) => map.current.removeLayer(marker));
    markersRef.current = [];

    // re-add current filtered markers
    filteredTrees.forEach(tree => {
      // if (tree.felledDate === '') {
        createTreeMarker(tree, allSpecies);
      // }
    });
  }, [filteredTrees, allSpecies]);

  useEffect(() => {
    const newRadius = Math.min(Math.max(Math.floor((mapZoom - 18) * 3 + 6), 6), 24) || 6;
    setMarkerRadius(newRadius);

    markersRef.current.forEach(markerInfo => {
      const { marker, tree, species, opacity = 1 } = markerInfo;
      // Use the marker's current opacity, not default
      const updatedIcon = generateTreeMarkerIcon(tree, species, newRadius, opacity);
      marker.setIcon(updatedIcon);
    });
  }, [mapZoom]);

  //create the tree markers and attach popups
  const createTreeMarker = (tree, speciesMap) => {
    const { northing, easting } = tree.location;
    const species = speciesMap.find(species => species.commonName === tree.commonName);
    const myIcon = generateTreeMarkerIcon(tree, species, markerRadius);

    const popupContent = `
      ${tree.photos.environs ? `<img src="${tree.photos.environs}" alt="Environs" style="max-width: 100px; max-height: 100px;"><br>` : ''}
      Id: ${tree.id}<br>
      <b>${tree.commonName}</b><br>
      <i>${tree.scientificName}</i><br>
      Family: <span style="display: inline-block; width: 12px; height: 12px; background-color: ${tree.markerColor}; margin-right: 5px;"></span>${tree.family}<br>
      DBH: ${tree.dbh} inches
    `;
    
    const marker = L
      .marker(
        [northing, easting], {
          icon: myIcon,
          riseOnHover: true,
          interactive: true,
          bubblingMouseEvents: false
        }
      )
      .addTo(map.current);
    
    // Store the tree's marker state (including opacity)
    const markerInfo = {
      marker,
      tree,
      species,
      opacity: 1,
      draggable: false
    };
    
    markersRef.current.push(markerInfo);

    marker.on('dragend', function(event) {
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
    });

    //click timer to differentiate between single and double clicks
    let clickTimer = null;
    const clickDelay = 200;
    
    marker.on('click', (event) => {
      //if second click within the delay run dblclick handler
      if (clickTimer) {
        return;
      }
      
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
      L.DomEvent.stopPropagation(event);
      
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

      //generate new icon with updated opacity and current radius
      const updatedIcon = generateTreeMarkerIcon(tree, species, currentRadius, markerInfo.opacity);
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
        setSelectedTree(tree);
        setUpdatedTree(tree);
        setFormColor({ backgroundColor: tree.invasive ? '#FFDEDE' : 'white' });
        navigate('/TreeData');
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
    setFormColor({ backgroundColor: 'white' })
    navigate('/TreeData')
  }
  return (
    <>
      <div 
        id='filter-thumb'
        className={`${styles.filterThumb} ${filterOpen ? styles.filterThumbOpen : styles.filterThumbClose}`}
        onClick={() => setFilterOpen(prev => !prev)}
      >
        <i className='bi-filter'></i>
      </div>
      <div 
        id='map' 
        className={styles.map} 
        ref={mapRef} 
        style={{ height: '100vh', width: '100vw' }}>
      </div>
      <FilterDrawer filteredTrees={filteredTrees} />
    </>
  );
};

export default TreeMap;