import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
// import { useQuery } from "@apollo/client"; // Make sure to import useQuery
// import { GET_TREES } from "./queries/get_trees"; // Import your GET_TREES query

import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import "./reset.css";
import "./App.css";

function App() {
  const [selectedTree, setSelectedTree] = useState(null);
  const [formValues, setFormValues] = useState(null);

  //determine forms' background color based on "invasive" flag in formValues
  const formStyle = {
    backgroundColor: formValues && formValues?.invasive ? "#FFDEDE" : "white",
  };

  // //sync form state with selectedTree when selectedTree changes
   useEffect(() => {
    if (selectedTree) {
      setFormValues(selectedTree);
    }
  }, [selectedTree]);

  return (
    <div className="App">
      <Header />
      <Navbar />
      <Outlet context = {{ 
        selectedTree, 
        setSelectedTree, 
        formValues,
        setFormValues,
        formStyle, 
      }} />
    </div>
  );
}

export default App;