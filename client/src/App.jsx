import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useQuery } from "@apollo/client"; // Make sure to import useQuery
import { GET_TREES } from "./queries/get_trees"; // Import your GET_TREES query

import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import "./reset.css";
import "./App.css";

function App() {
  const [selectedTree, setSelectedTree] = useState(null);
  const [updatedTree, setUpdatedTree] = useState(null);
  const { refetch } = useQuery(GET_TREES, { fetchPolicy: "cache-and-network" })

  // Determine form background color based on 'invasive' flag in selectedTree
  const formStyle = {
    backgroundColor: updatedTree && updatedTree?.invasive ? "#FFDEDE" : "white",
  };


//this code is to handle refresh or back buttons. Not sure what behavior I want yet. Probably want to refresh the page but not lose the data on refresh and go back to map on back? Or maybe do a history and navigate to the previous component but not lose data?
//   useEffect(() => {
//   const onBeforeUnload = (event) => {
//     event.returnValue = "Anything you wanna put here!";
//     return "Anything here as well, doesn't matter!";
//   };

//   window.addEventListener("beforeunload", onBeforeUnload);

//   return () => {
//     window.removeEventListener("beforeunload", onBeforeUnload);
//   };
// }, []);

  return (
    <div className="App">
      <Header />
      <Navbar />
      <Outlet context = {{ 
        selectedTree, 
        setSelectedTree, 
        updatedTree, 
        setUpdatedTree, 
        formStyle, 
        treesRefetch: refetch 
      }} />
    </div>
  );
}

export default App;
