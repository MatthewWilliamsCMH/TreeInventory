//---------imports----------
//external libraries
import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

//queries NEED EITHER OF THESE SINCE QUERIES NOW USED FOR STATES IN APP.JSX?
import { GET_TREES } from '../../queries/get_trees.js';
import { GET_SPECIES } from '../../queries/get_species.js';

//stylesheets
import './TreeInventory.css';

const TreeInventory = () => {
  //set up hooks
  const navigate = useNavigate();

  //get current global states using context
  const { setSelectedTree, setUpdatedTree } = useOutletContext(); //need to add all trees, too

  //set local states to initial values
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  //set up queries NEEDED NOW?
  const {
    loading: getTreesLoading,
    error: getTreesError,
    data: getTreesData,
  } = useQuery(GET_TREES);
  const {
    loading: getSpeciesLoading,
    error: getSpeciesError,
    data: getSpeciesData,
  } = useQuery(GET_SPECIES);

  const combineTreeAndSpeciesData = (tree, speciesMap) => {
    //-----------data reception and transmission----------
    const speciesInfo = speciesMap[tree.commonName] || {};
    return {
      ...tree,
      scientificName: speciesInfo.scientificName || '',
    };
  };

  let trees = [];
  if (getTreesData?.getTrees && getSpeciesData?.getSpecies) {
    const speciesMap = getSpeciesData.getSpecies.reduce((acc, species) => {
      acc[species.commonName] = species;
      return acc;
    }, {});

    trees = getTreesData.getTrees.map((tree) =>
      combineTreeAndSpeciesData(tree, speciesMap)
    );
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

  //----------loading and error states----------
  if (getTreesLoading) return <div>Loading trees...</div>;
  if (getTreesError) return <div>Error loading trees: {error.message}</div>;
  if (getSpeciesLoading) return <div>Error loading species...</div>;
  if (getSpeciesError)
    return <div>Error loading species: {getSpeciesError.message}</div>;

  //----------called functions----------
  //handle click on column headers to sort
  const handleSort = (columnKey) => {
    //if same column clicked, reverse the sort
    setSortConfig((prev) => ({
      key: columnKey,
      direction:
        prev.key === columnKey
          ? prev.direction === 'asc'
            ? 'desc'
            : 'asc'
          : 'asc',
    }));
  };

  //handle selection from table
  const handleTreeClick = (completeTree) => {
    setSelectedTree(completeTree);
    setUpdatedTree(completeTree);
    navigate('/TreeData');
  };

  //----------render component----------
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('commonName')}>Common name</th>
            <th onClick={() => handleSort('scientificName')}>
              Scientific name
            </th>
            <th onClick={() => handleSort('garden')}>Garden</th>
            <th onClick={() => handleSort('dbh')}>DBH</th>
            <th onClick={() => handleSort('notes')}>Notes</th>
            <th onClick={() => handleSort('id')}>ID</th>
          </tr>
        </thead>
        <tbody>
          {sortedTrees.map((tree) => (
            <tr
              key={tree?.id || 'unknown'}
              onClick={() => handleTreeClick(tree)}
            >
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
