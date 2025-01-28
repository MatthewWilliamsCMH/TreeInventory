//---------imports----------
//external libraries
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useOutletContext } from 'react-router-dom';

//queries
import { GET_SPECIES } from '../../queries/get_species';

//mutations
import { ADD_SPECIES } from '../../mutations/add_species.jsx';

//stylesheets
import './Overlay.css';

const Overlay = ({ setOverlayVisible }) => {
  //----------data reception and transmission----------
  //get current global states using context
  const { updatedTree, setUpdatedTree } = useOutletContext();

  //set local states to initial values
  //If I get rid of the switch statement, I won't need to track these states, though I will have to assign the values for species names to the form controls.
  const [commonName, setCommonName] = useState(updatedTree?.commonName || '');
  const [scientificName, setScientificName] = useState(updatedTree?.scientificName || '');
  const [family, setFamily] = useState('');
  const [markerColor, setMarkerColor] = useState('');
  const [nonnative, setNonnative] = useState(false);
  const [invasive, setInvasive] = useState(false);

  //set local references to initial values
  const overlayCommonName = useRef(null);
  const overlayScientificName = useRef(null);

  const { refetch: refetchSpecies } = useQuery(GET_SPECIES, {
    fetchPolicy: 'network-only'
  });

  //set up mutations
  const [addSpecies, { loading: addSpeciesLoading }] = useMutation(ADD_SPECIES, {
    onCompleted: async () => {
      await refetchSpecies()
    }
  });

    useEffect (() => {
    if (commonName) {
      overlayScientificName.current?.focus()
    }
    else {
      overlayCommonName.current?.focus();
    }
  }, []);

  //----------useEffects----------
  //disable interaction with the background when modal is open
  useEffect(() => {
    const body = document.body;
    body.style.overflow = 'hidden'; //prevent scrolling on the background
    body.style.pointerEvents = 'none'; //prevent pointer events on the background

    const modal = document.getElementById('overlay'); //make sure modal is active
    if (modal) {
      modal.style.pointerEvents = 'auto'; //allow pointer events on the modal
    }

    return () => {
      body.style.pointerEvents = 'auto'; //allow pointer events on the background
      body.style.overflow = 'auto'; //allow scrolling on the background
    };
  }, []);

  
  //----------called functions----------
  //handle control changes
  //This seems like an unnecessary and inefficient step; are we using these values other than to write to the db? In TreeData, the data for the event target is written to an object (updatedTree), and that's written to the db. Think about this.
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

  //handle submit
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
          invasive
        }
      });

      setUpdatedTree(prevState => ({
        ...prevState,
        commonName: commonName,
        scientificName: scientificName
      }));

      //I think I need to recall the getSpecies query here, yes?

    setOverlayVisible(false);
    }
    catch (err) {
      console.error('Error adding species:', err);
    }
  };

  //handle cancel
  const handleCancel = () => {
    setOverlayVisible(false);
  };

  //render component
  return (
    <div id = 'overlay' className='overlay'>
      <form onSubmit={handleSubmit}>
        <div className='control'>
          <label htmlFor='commonName'>Common name</label>
          <input
            ref={overlayCommonName}
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
            ref={overlayScientificName}
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
