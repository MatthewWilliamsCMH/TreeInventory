//---------imports----------
//external libraries
import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Header from './components/Header/Header.jsx';
import Navbar from './components/Navbar/Navbar.jsx';

//components and helpers
//use aggregation function to combine tree, species, and family data instead of the helper below (or just chagne the helper to use the aggregation function)
import { combineTreeAndSpeciesData } from './utils/helpers.js';
import { dbhList, gardenList } from './utils/constants.js';

//stylesheets
import './reset.css';
import './custom-bootstrap.scss';
import styles from './app.module.css';

//queries
import { GET_TREES } from './queries/get_trees.js';
import { GET_SPECIES } from './queries/get_species.js';

function App() {
  //-----------data reception and transmission----------
  //initialize global states
  const [allSpecies, setAllSpecies] = useState([]);
  const [allTrees, setAllTrees] = useState([]);
  const [selectedTree, setSelectedTree] = useState(null);
  const [treeLocation, setTreeLocation] = useState(null);
  const [updatedTree, setUpdatedTree] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    commonName: [],
    dbh: dbhList,
    garden: gardenList,
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
    siteInfo: {
      slope: false,
      overheadLines: false,
      treeCluster: false,
      proximateStructure: false,
      proximateFence: false,
      propertyLine: false,
    },
    invasive: false,
    nonnative: false,
    hidden: true,
  });
  const [mapCenter, setMapCenter] = useState([39.97757, -83.04937]); //default for demo and develop modes
  const [mapZoom, setMapZoom] = useState(18);
  const [formColor, setFormColor] = useState({ backgroundColor: 'white' }); //default background for noninvasive trees
  const mergedTrees = useMemo(() => {
    if (!allTrees.length || !allSpecies.length) return [];
    return allTrees.map((tree) => combineTreeAndSpeciesData(tree, allSpecies));
  }, [allTrees, allSpecies]);

  //set up queries
  const {
    data: getTreesData,
    error: getTreesError,
    loading: getTreesLoading,
    refetch: refetchTrees,
  } = useQuery(GET_TREES, { fetchPolicy: 'network-only' });
  const {
    data: getSpeciesData,
    error: getSpeciesError,
    loading: getSpeciesLoading,
    refetch: refetchSpecies,
  } = useQuery(GET_SPECIES);

  //----------useEffects----------
  //get user location for develop and production modes
  useEffect(() => {
    const useFixedLocation = process.env.FIXED_LOCATION === 'true';
    if (!useFixedLocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  //get list of trees and their data
  useEffect(() => {
    if (getTreesData?.trees) {
      setAllTrees(getTreesData.trees);
    }
  }, [getTreesData]);

  //convert species array into map keyed by common name
  useEffect(() => {
    if (getSpeciesData?.species) {
      setAllSpecies(getSpeciesData.species);
    }
  }, [getSpeciesData]);

  //set filter criteria for initial render
  useEffect(() => {
    if (allSpecies.length) {
      setFilterCriteria((prev) => ({
        ...prev,
        commonName: allSpecies.map((species) => species.commonName),
      }));
    }
  }, [allSpecies]);

  //update selectedTree as selection changes
  useEffect(() => {
    if (selectedTree) {
      setUpdatedTree(selectedTree);
    }
  }, [selectedTree]);

  //----------rendering----------
  return (
    <div className='app'>
      <Header />
      <Outlet
        context={{
          allSpecies,
          setAllSpecies,
          refetchSpecies,
          allTrees,
          setAllTrees,
          refetchTrees,
          mergedTrees,
          selectedTree,
          setSelectedTree,
          treeLocation,
          setTreeLocation,
          updatedTree,
          setUpdatedTree,
          mapCenter,
          setMapCenter,
          mapZoom,
          setMapZoom,
          filterOpen,
          setFilterOpen,
          filterCriteria,
          setFilterCriteria,
          formColor,
          setFormColor,
        }}
      />
    </div>
  );
}

export default App;
