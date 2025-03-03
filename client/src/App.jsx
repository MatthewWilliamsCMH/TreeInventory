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
  const [formStyle, setFormStyle] = useState({ backgroundColor: 'white' });

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
        formStyle, setFormStyle 
      }} />
    </div>
  );
}

export default App;