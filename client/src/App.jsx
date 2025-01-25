import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import Overlay from './components/TreeData/Overlay';

import './reset.css';
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'
import './App.css';

function App() {
  const [selectedTree, setSelectedTree] = useState(null);
  const [treeLocation, setTreeLocation] = useState(null);
  const [updatedTree, setUpdatedTree] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  // Function to open the overlay
  //I think this needs to move into TreeData.jsx, and setOverlayVisible needs to be added to context here and imported in TreeData.jsx
  const openOverlay = () => {
    setOverlayVisible(true); // Set overlay visibility to true when opening
  };

  //I think this needs to move into Overlay.jsx, and setOverlayVisible needs to be added to context here and imported in Overlay.jsx
  const closeOverlay = () => {
    setOverlayVisible(false); // Set overlay visibility to false when closing
  };

  //Can this move to TreeData.jsx since it's now one form, and this doesn't need to be shared?
  //determine forms' background color based on 'invasive' flag in selectedTree
  const formStyle = {
    backgroundColor: selectedTree && selectedTree?.invasive ? '#FFDEDE' : 'white'
  };

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
        openOverlay, closeOverlay, //I won't need these if I move the functions to the other jsx files.
        overlayVisible, formStyle 
      }} />
      {overlayVisible && (
        <Overlay 
          closeOverlay={closeOverlay} //I won't need this if I move the function into Overlay.jsx
          overlayVisible={overlayVisible}
          updatedTree={updatedTree}
          setUpdatedTree={setUpdatedTree}
        />
      )}
    </div>
  );
}

export default App;