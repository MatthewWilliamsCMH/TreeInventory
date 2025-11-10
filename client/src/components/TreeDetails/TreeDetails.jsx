//---------imports----------
//external libraries
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

//local helpers, constants, queries, and mutations
import { formatDateForDisplay, handleDateFocus } from '../../utils/helpers.js';

//stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../TreeData/treeData.module.css';

const TreeDetails = () => {
  //-----------data reception and transmission----------
  //get current global states from parent
  const { selectedTree } = useOutletContext();

  //set local states to initial values
  const [commonToScientific, setCommonToScientific] = useState(null);
  const [updatedSpeciesField, setUpdatedSpeciesField] = useState(null);
  const commonNameRef = useRef(null);

  //initialize hooks
  const navigate = useNavigate();

  //----------called functions----------
  setCommonToScientific((prev) => ({
    ...prev,
    [newSpecies.commonName]: newSpecies.scientificName,
  }));

  //handle done button
  const handleCancel = () => {
    setUpdatedTree(null);
    navigate('/');
  };

  //----------render component----------
  return (
    //common name, scientific name [cross referenced from common name], family [cross referenced from common name], variety, diameter, garden, photos
    <>
      <h2 className='mt-1'>{selectedTree.commonName}</h2>
      {/*This needs to use flexbox to put the data below in up to two columns with the photos below in up to three columns*/}
      <div md={6}>
        <dl>
          <dt>Scientific name: </dt> {/*cross reference species table using common name*/}
          <dt>Family: </dt> {/*cross reference species table using common name*/}
          <dt>Variety: {selectedTree.variety || 'unknown'}</dt>
          <dt>Diameter: {selectedTree.dbh} inches</dt>
          <dt>Garden:{selectedTree.garden}</dt>
          <dt>Native: {selectedTree.native}</dt>
          <dt>Invasive: {selectedTree.invasive}</dt>
          <p>
            Invasive species are plants or animals that are not native to the area, reproduce
            rapidly, and outcompete native species.
          </p>
        </dl>
      </div>

      <div>
        {/*for each photo whose value is not "" or null, display in 1 x 1 box. the boxes can be clicked to open a larger version.*/}
      </div>
      <div>
        {/*this shoudld be at the bottom of the form*/}
        <p>
          {' '}
          Last updated: {new Date(parseInt(updatedTree.lastUpdated)).toLocaleDateString(
            'en-US'
          )}{' '}
        </p>
      </div>
      <Button
        variant='primary'
        size='sm'
        type='button'
        onClick={handleCancel}
      >
        Done
      </Button>
    </>
  );
};

export default TreeDetails;
