import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';

import './reset.css';
import './App.css';

function App() {
  const [selectedTree, setSelectedTree] = useState(null);
  const [treeLocation, setTreeLocation] = useState(null);
  const [updatedTree, setUpdatedTree] = useState(null);
  const [mapZoom, setMapZoom] = useState(18);
  const [mapCenter, setMapCenter] = useState([39.977985303479336, -83.04964455222637]);
  const [formStyle, setFormStyle] = useState({ backgroundColor: 'white' });

  //the function below sets default value for lat and lng for the initial render
  useEffect(() => {
    const useFixedLocation = process.env.FIXED_LOCATION === "true";
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

  //sync form state with selectedTree when selectedTree changes
  useEffect(() => {
    if (selectedTree) {
      setUpdatedTree(selectedTree);
    }
  }, [selectedTree]);

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