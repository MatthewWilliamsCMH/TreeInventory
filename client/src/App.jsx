//---------imports----------
//external libraries
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Header from './components/Header/Header.jsx';
import Navbar from './components/Navbar/Navbar.jsx';

//styles
import './reset.css';
import './App.css';

function App() {
  //-----------data----------
  //setup global states
  const [selectedTree, setSelectedTree] = useState(null);
  const [treeLocation, setTreeLocation] = useState(null);
  const [updatedTree, setUpdatedTree] = useState(null);
  const [mapZoom, setMapZoom] = useState(18);
  const [mapCenter, setMapCenter] = useState([39.97768, -83.04935]); //default for demo mode
  const [formStyle, setFormStyle] = useState({  backgroundColor: 'white' }); //default background for noninvasive trees

  //----------useEffects----------
  //get user location for dev and prod modes
  useEffect(() => {
    const useFixedLocation = process.env.FIXED_LOCATION === "true"; //FIXED_LOCATION is true only in demo mode
    if (!useFixedLocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }
  }, []);

  //update selectedTree as selection changes (needed?)
  useEffect(() => {
    if (selectedTree) {
      setUpdatedTree(selectedTree);
    }
  }, [selectedTree]);

  //----------rendering----------
  return (
    <div className='App'>
      <Header />
      <Navbar selectedTree={selectedTree} />
      <Outlet context = {{ 
        selectedTree, setSelectedTree, 
        treeLocation, setTreeLocation,
        updatedTree, setUpdatedTree,
        mapZoom, setMapZoom,
        mapCenter, setMapCenter,
        formStyle, setFormStyle
      }} />
    </div>
  );
}

export default App;