import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ADD_SPECIES } from '../../mutations/add_species.jsx';

import './Overlay.css';

const Overlay = ({ closeOverlay, updatedTree, setUpdatedTree }) => {
  // State to manage new species input
  const [commonName, setCommonName] = useState(updatedTree?.commonName || '');
  const [scientificName, setScientificName] = useState(updatedTree?.scientificName || '');
  const [family, setFamily] = useState('');
  const [markerColor, setMarkerColor] = useState('');
  const [nonnative, setNonnative] = useState(false);
  const [invasive, setInvasive] = useState(false);

  // Mutation hook to add a species
  const [addSpecies, { loading: addSpeciesLoading }] = useMutation(ADD_SPECIES);

  // Handle submit action
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addSpecies({
        variables: {
          commonName,
          scientificName,
          family,
          markerColor,
          nonnative,
          invasive,
        },
      });

      // Update the parent form with the new species
      setUpdatedTree(prevState => ({
        ...prevState,
        commonName: commonName,
        scientificName: scientificName,
      }));

      // Close the overlay after successful submission
      closeOverlay();

    } catch (err) {
      console.error('Error adding species:', err);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    closeOverlay();  // Close the overlay without making changes
  };

  // Handle changes in form inputs
  const handleInputChange = (field, value) => {
    switch (field) {
      case 'commonName':
        setCommonName(value);
        break;
      case 'scientificName':
        setScientificName(value);
        break;
      case 'family':
        setFamily(value);
        break;
      case 'markerColor':
        setMarkerColor(value);
        break;
      case 'nonnative':
        setNonnative(value);
        break;
      case 'invasive':
        setInvasive(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className='overlay'>
      <form onSubmit={handleSubmit}>
        <div className='control'>
          <label htmlFor='commonName'>Common name</label>
          <input
            type='text'
            className = 'standard'
            id='commonName'
            value={commonName}
            onChange={(e) => handleInputChange('commonName', e.target.value)}
          />
        </div>

        <div className='control'>
          <label htmlFor='scientificName'>Scientific name</label>
          <input
            type='text'
            className='standard'
            id='scientificName'
            value={scientificName}
            onChange={(e) => handleInputChange('scientificName', e.target.value)}
          />
        </div>

        <div className='control'>
          <label htmlFor='family'>Family name</label>
          <input
            type='text'
            className='standard'
            id='family'
            value={family}
            onChange={(e) => handleInputChange('family', e.target.value)}
          />
        </div>

        <div className='control'>
          <label htmlFor='markerColor'>Marker color</label>
          <input
            type='text'
            className='standard'
            id='markerColor'
            value={markerColor}
            onChange={(e) => handleInputChange('markerColor', e.target.value)}
          />
        </div>

        <div className='checkboxgroup'>
        <div>
          <label htmlFor='nonnative'>
            <input
              id='nonnative'
              className='checkbox'
              type='checkbox'
              checked={nonnative}
              onChange={(e) => handleInputChange('nonnative', e.target.checked)}
            />
            Nonnative
          </label>
        </div>
        <div>
          <label htmlFor='invasive'>
            <input
              id='invasive'
              className='checkbox'
              type='checkbox'
              checked={invasive}
              onChange={(e) => handleInputChange('invasive', e.target.checked)}
            />
            Invasive
          </label>
        </div>
        </div>

        <div id='buttongroup'>
          <button type='submit' disabled={addSpeciesLoading}>OK</button>
          <button type='button' onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Overlay;
