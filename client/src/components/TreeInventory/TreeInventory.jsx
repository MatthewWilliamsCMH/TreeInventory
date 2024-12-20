import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_TREES } from "../../queries/get_trees";
import "./TreeInventory.css";

const TreeInventory = () => {
  const { setSelectedTree, setFormValues } = useOutletContext();
  const { loading, error, data } = useQuery(GET_TREES);
  const navigate = useNavigate();

  if (loading) return <div>Loading trees...</div>;
  if (error) return <div>Error loading trees: {error.message}</div>;

  const trees = data?.getTrees || [];
  if (!trees.length) return <div>No trees found</div>;

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Sorting handler
  const handleSort = (columnKey) => {
    // If the same column is clicked, reverse the direction
    if (sortConfig.key === columnKey) {
      setSortConfig((prev) => ({
        key: columnKey,
        direction: prev.direction === "asc" ? "desc" : "asc",
      }));
    } 
    else {
      // If a different column is clicked, sort it ascending
      setSortConfig({ key: columnKey, direction: "asc" });
    }
  };

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

  const handleTreeClick = (tree) => {
    setSelectedTree(tree);
    setFormValues(tree);
    navigate("/physicaldata");
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("commonName")}>Common Name</th>
            <th onClick={() => handleSort("garden")}>Garden</th>
            <th onClick={() => handleSort("dbh")}>DBH</th>
            <th onClick={() => handleSort("notes")}>Notes</th>
            <th onClick={() => handleSort("id")}>ID</th>
          </tr>
        </thead>
        <tbody>
          {sortedTrees.map((tree) => (
            <tr key={tree?.id || "unknown"} onClick={() => handleTreeClick(tree)}>
              <td>{tree?.species?.commonName || ""}</td>
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
