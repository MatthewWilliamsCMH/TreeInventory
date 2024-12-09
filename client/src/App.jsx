import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import "./reset.css";
import "./App.css";

function App() {
  const [selectedTree, setSelectedTree] = useState(null);
  const [updatedTree, setUpdatedTree] = useState(null);

  // Determine form background color based on 'invasive' flag in selectedTree
  const formStyle = {
    backgroundColor: updatedTree && updatedTree?.invasive ? "#FFDEDE" : "white",
  };

  return (
    <div className="App">
      <Header />
      <Navbar />
      <Outlet context={{ selectedTree, setSelectedTree, updatedTree, setUpdatedTree, formStyle }} />
    </div>
  );
}

export default App;
