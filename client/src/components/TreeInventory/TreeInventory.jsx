//---------imports----------
//external libraries
import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useOutletContext, useNavigate } from 'react-router-dom';

//stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../custom-bootstrap.scss';

const TreeInventory = () => {
  //initialize hooks
  const navigate = useNavigate();

  //get current global states from parent
  const { mergedTrees, setSelectedTree, setUpdatedTree } = useOutletContext();

  //set local states to initial values
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  //sort trees based on sortConfig
  const sortedTrees = [...mergedTrees].sort((a, b) => {
    if (sortConfig.key === null) return 0;

    const aValue = a[sortConfig.key] ?? '';
    const bValue = b[sortConfig.key] ?? '';

    //sort based on direction (ascending/descending)
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  //----------called functions----------
  //handle click on column headers to sort
  const handleSort = (columnKey) => {
    //if same column clicked, reverse the sort
    setSortConfig((prev) => ({
      key: columnKey,
      direction: prev.key === columnKey ? (prev.direction === 'asc' ? 'desc' : 'asc') : 'asc',
    }));
  };

  //handle selection from table
  const handleTreeClick = (tree) => {
    setSelectedTree(tree);
    setUpdatedTree(tree);
    navigate('/TreeData');
  };

  //----------render component----------
  return (
    <div>
      <Table
        bordered
        size='sm'
        striped
        responsive='sm'
        className='table-striped'
      >
        <thead>
          <tr>
            <th>Environs</th>
            <th onClick={() => handleSort('commonName')}>Common name</th>
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
              <td>
                {tree?.photos.environs ? (
                  <img
                    src={`${tree.photos.environs}`}
                    alt={`Environment surrounding ${tree.commonName}`}
                    style={{ width: '3.75rem' }}
                  />
                ) : (
                  <img
                    src='/ScribbleTree.png'
                    alt='No image'
                    style={{ width: '3.75rem' }}
                  />
                )}
              </td>
              <td>{tree?.commonName || ''}</td>
              <td>{tree?.garden || ''}</td>
              <td>{tree?.dbh ? `${tree.dbh} inches` : ''}</td>
              <td style={{ maxWidth: '20rem' }}>{tree?.notes || ''}</td>
              <td>{tree?.id || ''}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TreeInventory;
