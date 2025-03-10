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
  const { selectedTree, setSelectedTree, setUpdatedTree, setFormStyle } = useOutletContext();
  const [mapLoaded, setMapLoaded] = useState(false)

  //set up queries
  const { loading: getAllLoading, error: getAllError, data: getAllData } = useQuery(GET_TREES, {fetchPolicy: 'network-only'}); //fetch all trees
  const { loading: getSpeciesLoading, error: getSpeciesError, data: getSpeciesData, refetch: refetchSpecies } = useQuery(GET_SPECIES);
  
  //set up mutations
  const [updateTreeLocation] = useMutation(UPDATE_TREE_LOCATION, {fetchPolicy:'no-cache'});
  
  //initialize map
  const mapRef = useRef(null); //use ref for map container
  const map = useRef(null); //use ref to store Leaflet map instance

  useEffect(() => {
  if (mapRef.current && !map.current && getAllData?.getTrees && getSpeciesData?.getSpecies) {
    //generate map
      map.current = L.map(mapRef.current, {
        zoomControl: false,
        center: [39.97738230836944, -83.04934859084177],
        zoom: 19,
        tapTolerance: 45, //changed from 30; default is 15
        tapHold: false
      });

      //alternate tile layers
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:23}).addTo(map.current);
      // L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg', {maxZoom:23}).addTo(map.current);
      const googleMutant = L.gridLayer.googleMutant({
        maxZoom: 24,
        type: 'satellite', //other tile types: 'roadmap','terrain', 'hybrid'
        attribution: "&copy; <a href='https://www.google.com/intl/en-US_US/help/terms_maps.html'>Google</a>",
        apiKey: 'AIzaSyA5piHGoJrVT5jKhaVezZUwOoPUAAYQcJs'
      }).addTo(map.current);

      //ensure map is loaded; this is an attempt to prevent intermittent failure to load map and/or markers
      map.current.on('load', () => {
        setMapLoaded(true)
      })

      //add new tree when user clicks on empty area of map
      map.current.on('click', handleAddTree);
    }

    //remove old data and fetch the data anew
    if (map.current && getAllData?.getTrees) {
      map.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.current.removeLayer(layer);
        }
      });

      //ensure species data is ready before creating markers; not sure why this is necessary
      const speciesMap = getSpeciesData.getSpecies.reduce((acc, species) => {
        acc[species.commonName] = species;
        return acc;
      }, {});

      getAllData.getTrees.forEach((tree) => {
        const completeTree = combineTreeAndSpeciesData(tree, speciesMap);
        if (tree.felledDate === '') {
          createTreeMarker(completeTree, speciesMap);
        }
      });
    }

    //clear the map container and instance before unmounting the component
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [getAllData, getSpeciesData, selectedTree, mapLoaded]);

  //combine add species fields to tree object, which already has tree fields
  const combineTreeAndSpeciesData = (tree, speciesMap) => {
    const speciesInfo = speciesMap[tree.commonName] || {};
  return {
      ...tree,
      scientificName: speciesInfo.scientificName || '',
      nonnative: speciesInfo.nonnative || false,
      invasive: speciesInfo.invasive || false,
      markerColor: speciesInfo.markerColor || 'FFFFFF'
    };
  };

  //create the tree markers and attach popups
  const createTreeMarker = (tree, speciesMap) => {
    const { northing, easting } = tree.location;
    const speciesInfo = speciesMap[tree.commonName];
    const markerColor = speciesInfo.markerColor || 'FFFFFF';
    let strokeWidth = '1';
    if (tree.lastUpdated > '1741132800') { //this is a temporary condition to isolate trees that have already been updated
      strokeWidth = '3'
    };
    const svgIcon = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'>
        <circle cx='6' cy='6' r='6' fill='${markerColor}' stroke='lightgray' stroke-width='${strokeWidth}'/>
      </svg>
    `;

    const myIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
      iconSize: [12, 12],
      iconRetinaUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
    });

    const popupContent = `
      <b>${tree.commonName}</b><br>
      <i>${tree.dbh} inches</i><br>
      Id: ${tree.id}
    `;
    
    const marker = L
    .marker(
      [northing, easting], {
        draggable: 'true',
        icon: myIcon,
        riseOnHover: 'true',
        // contextmenu: false,
        interactive: true,     // Keep it clickable
        bubblingMouseEvents: false // Prevent event bubbling      
      }
    )
    .bindPopup(popupContent)
    .addTo(map.current);

    marker.on('dragend', function(event){
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

    marker.on('popupopen', (event) => {
      const popup = event.popup;
      const popupElement = popup.getElement();

      //prevent navigation when clicking the close button
      const closeButton = popupElement.querySelector('.leaflet-popup-close-button');
      if (closeButton) {
        closeButton.addEventListener('click', (event) => {
          event.stopPropagation();
        });
      }

      //allow navigation when any part of the popup is clicked except for the close button.
      popupElement.addEventListener('click', () => {
        setSelectedTree(tree);
        setUpdatedTree(tree);
        setFormStyle({ backgroundColor: tree.invasive ? '#FFDEDE' : 'white' });
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
    setFormStyle({ backgroundColor: 'white' })
    navigate('/TreeData')
  }

  if (getAllLoading || getSpeciesLoading) {
    return <p>Loading...</p>;
  }

  if (getAllError || getSpeciesError) {
    return <p>Error: {getAllError?.message || getSpeciesError?.message}</p>;
  }

  return (
    <div id='map' ref = {mapRef} style = {{ height: '100vh', width: '100vw' }}></div>
  );
};

export default TreeMap;