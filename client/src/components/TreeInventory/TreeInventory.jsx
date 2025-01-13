import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { GET_TREES } from '../../queries/get_trees';
import { GET_SPECIES } from '../../queries/get_species';
import './TreeInventory.css';

const TreeInventory = () => {
  const navigate = useNavigate();
  const { selectedTree, setSelectedTree, setUpdatedTree } = useOutletContext();

  //set up queries
  const { loading: getAllLoading, error: getAllError, data: getAllData } = useQuery(GET_TREES);
  const { loading: getSpeciesLoading, error: getSpeciesError, data: getSpeciesData } = useQuery(GET_SPECIES);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

  //sort trees based on sortConfig
  const sortedTrees = [...trees].sort((a, b) => {
    if (sortConfig.key === null) return 0;

    const aValue = a[sortConfig.key] ?? '';
    const bValue = b[sortConfig.key] ?? '';

    //sort based on direction (ascending/descending)
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (columnKey) => {
    //ifsame column clicked, reverse the sort
    setSortConfig((prev) => ({
      key: columnKey,
      direction: prev.key === columnKey ? 
      (prev.direction === 'asc' ? 'desc' : 'asc') : 'asc',
    }));
  }; 

  const handleTreeClick = (completeTree) => {
    setSelectedTree(completeTree);
    setUpdatedTree(completeTree);
    navigate('/TreeData');
  };

  if (getAllLoading) return <div>Loading trees...</div>;
  if (getAllError) return <div>Error loading trees: {error.message}</div>;
  if (getSpeciesError) return <div>Error loading species: {getSpeciesError.message}</div>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('commonName')}>Common name</th>
            <th onClick={() => handleSort('scientificName')}>Scientific name</th>
            <th onClick={() => handleSort('garden')}>Garden</th>
            <th onClick={() => handleSort('dbh')}>DBH</th>
            <th onClick={() => handleSort('notes')}>Notes</th>
            <th onClick={() => handleSort('id')}>ID</th>
          </tr>
        </thead>
        <tbody>
          {sortedTrees.map((tree) => (
            <tr key={tree?.id || 'unknown'} onClick={() => handleTreeClick(tree)}>
              <td>{tree?.commonName || ''}</td>
              <td>{tree?.scientificName || ''}</td>
              <td>{tree?.garden || ''}</td>
              <td>{tree?.dbh ? `${tree.dbh} inches` : ''}</td>
              <td>{tree?.notes || ''}</td>
              <td>{tree?.id || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TreeInventory;