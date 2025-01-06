import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import UppyUploader from "./components/PhysicalData/UppyUploader";

import "./reset.css";
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'
import "./App.css";

function App() {
  const [selectedTree, setSelectedTree] = useState(null);
  const [treeLocation, setTreeLocation] = useState(null);
  const [formValues, setFormValues] = useState(null);

  //determine forms' background color based on "invasive" flag in selectedTree
  const formStyle = {
    backgroundColor: selectedTree && selectedTree?.invasive ? "#FFDEDE" : "white"
  };

    //sync form state with selectedTree when selectedTree changes
    useEffect(() => {
    if (selectedTree) {
      setFormValues(selectedTree);
    }
  }, [selectedTree]);

  return (
    <div className="App">
      <Header />
      <Navbar selectedTree={selectedTree} />
      <Outlet context = {{ 
        selectedTree, setSelectedTree, 
        treeLocation, setTreeLocation,
        formValues, setFormValues,
        formStyle 
      }} />
    </div>
  );
}

export default App;