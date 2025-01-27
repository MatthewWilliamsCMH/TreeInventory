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

  //determine form background color based on 'invasive' flag in selectedTree
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
        formStyle 
      }} />
    </div>
  );
}

export default App;