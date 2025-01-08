import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_TREES } from "../../queries/get_trees";
import { GET_SPECIES } from "../../queries/get_species";
import "./TreeInventory.css";

const TreeInventory = () => {
  const navigate = useNavigate();
  const { selectedTree, setSelectedTree, setFormValues } = useOutletContext();

  // set up queries
  const { loading: getAllLoading, error: getAllError, data: getAllData } = useQuery(GET_TREES, {fetchPolicy: "network-only"}); //fetch all trees
  const { loading: getSpeciesLoading, error: getSpeciesError, data: getSpeciesData } = useQuery(GET_SPECIES); //fetch all species

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const combineTreeAndSpeciesData = (tree, speciesMap) => {
    const speciesInfo = speciesMap[tree.commonName] || {};
    return {
      ...tree,
      scientificName: speciesInfo.scientificName || '',
    };
  };

  let trees = [];
  if (getAllData?.getTrees && getSpeciesData?.getSpecies) {
    const speciesMap = getSpeciesData.getSpecies.reduce((acc, species) => {
      acc[species.commonName] = species;
      return acc;
    }, {});

    trees = getAllData.getTrees.map(tree => combineTreeAndSpeciesData(tree, speciesMap))
  }

  // Sort trees based on sortConfig
  const sortedTrees = [...trees].sort((a, b) => {
    if (sortConfig.key === null) return 0;

    const aValue = a[sortConfig.key] ?? "";
    const bValue = b[sortConfig.key] ?? "";

    // Sort based on direction (ascending/descending)
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Sorting handler
  const handleSort = (columnKey) => {
    // If the same column is clicked, reverse the direction
    setSortConfig((prev) => ({
      key: columnKey,
      direction: prev.key === columnKey ? 
      (prev.direction === "asc" ? "desc" : "asc") : "asc",
    }));
  }; 

  const handleTreeClick = (completeTree) => {
    setSelectedTree(completeTree);
    setFormValues(completeTree);
    navigate("/TreeData");
  };

  if (getAllLoading) return <div>Loading trees...</div>;
  if (getAllError) return <div>Error loading trees: {error.message}</div>;
  if (getSpeciesError) return <div>Error loading species: {getSpeciesError.message}</div>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("commonName")}>Common name</th>
            {/* This is not populating */}
            <th onClick={() => handleSort("scientificName")}>Scientific name</th>
            <th onClick={() => handleSort("garden")}>Garden</th>
            <th onClick={() => handleSort("dbh")}>DBH</th>
            <th onClick={() => handleSort("notes")}>Notes</th>
            <th onClick={() => handleSort("id")}>ID</th>
          </tr>
        </thead>
        <tbody>
          {sortedTrees.map((tree) => (
            <tr key={tree?.id || "unknown"} onClick={() => handleTreeClick(tree)}>
              <td>{tree?.commonName || ""}</td>
              <td>{tree?.scientificName || ""}</td>
              <td>{tree?.garden || ""}</td>
              <td>{tree?.dbh ? `${tree.dbh} inches` : ""}</td>
              <td>{tree?.notes || ""}</td>
              <td>{tree?.id || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TreeInventory;
