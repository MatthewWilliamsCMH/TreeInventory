//---------imports----------
//external libraries
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useOutletContext } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { GithubPicker } from 'react-color'

//functions and constants
import { markerColorList } from '../../utils/constants.js';

//queries
import { GET_SPECIES } from '../../queries/get_species.js';

//mutations
import { ADD_SPECIES } from '../../mutations/add_species.js';

//stylesheets
import './NewSpeciesOverlay.css';

const Overlay = ({ setOverlayVisible }) => {
  //----------data reception and transmission----------
  //set up queries
  const { loading: getSpeciesLoading, error: getSpeciesError, data: getSpeciesData } = useQuery(GET_SPECIES);
  const { refetch: refetchSpecies } = useQuery(GET_SPECIES, {
    fetchPolicy: 'network-only'
  });

  //set up mutations
  const [addSpecies, { loading: addSpeciesLoading }] = useMutation(ADD_SPECIES, {
    onCompleted: async () => {
      await refetchSpecies()
      // await getSpeciesData()
    }
  });

  //get current global states using context
  const { updatedTree, setUpdatedTree } = useOutletContext();

  //set local states to initial values
  const [commonName, setCommonName] = useState(updatedTree?.commonName || '');
  const [scientificName, setScientificName] = useState(updatedTree?.scientificName || '');
  const [family, setFamily] = useState('');
  const [markerColor, setMarkerColor] = useState('');
  const [nonnative, setNonnative] = useState(false);
  const [invasive, setInvasive] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { familyList, usedColors } = getSpeciesData.getSpecies.reduce((acc, species) => {
    //add unique families
    if (!acc.familySet.has(species.family)) {
      acc.familySet.add(species.family);
      acc.familyList.push({
        label: species.family,
        value: species.family
      })
    }
    acc.familyList.sort((a, b) => a.label.localeCompare(b.label));

    //add unique colors
    if (!acc.colorSet.has(species.markerColor)) {
      acc.colorSet.add(species.markerColor);
      acc.usedColors.push(species.markerColor);
    }
    return acc;
  },
  {
    familyList: [],
    usedColors: [],
    familySet: new Set(),
    colorSet: new Set()
  });

  const availableColors = markerColorList
    .filter(color => !usedColors.includes(color))
    .sort();

  //set local references to initial values
  const overlayCommonName = useRef(null);
  const overlayScientificName = useRef(null);

  //----------useEffects----------
  //open the modal
  useEffect(() => {
    //disable interaction with the background when modal is open
    const body = document.body;
    body.style.overflow = 'hidden'; //prevent scrolling on the background
    body.style.pointerEvents = 'none'; //prevent pointer events on the background

    //ensure modal is active and allow pointer events on it
    const modal = document.getElementById('overlay'); //make sure modal is active
    if (modal) {
      modal.style.pointerEvents = 'auto';
    }

    //cleanup; restore normal pointer events and scrolling behavior to background
    return () => {
      body.style.pointerEvents = 'auto';
      body.style.overflow = 'auto';
    };
  }, []);

  useEffect (() => {
    if (commonName) {
      overlayScientificName.current?.focus()
    }
    else {
      overlayCommonName.current?.focus();
    }
  }, []);
  
  //----------called functions----------
  //handle control changes
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

        if (!familyList.some(item => item.value === value)) {
          //new family
          setShowColorPicker(true);
          setMarkerColor('');
        } else {
          //existing family
          const existingSpecies = getSpeciesData.getSpecies.find(
            (s) => s.family === value
          );
          if (existingSpecies) {
            setMarkerColor(existingSpecies.markerColor);
          }
          setShowColorPicker(false);
        }
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

  //handle OK button
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

      setOverlayVisible(false);
    }
    catch (err) {
      console.error('Error adding species:', err);
    }
  };

  //handle cancel button
  const handleCancel = () => {
    setOverlayVisible(false);
  };

  //----------render component----------
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

        <div className = 'control'>
          <label htmlFor = 'family'>Family name</label>
          <CreatableSelect
            id = 'family'
            onChange = {(selectedOption) => handleInputChange('family', selectedOption?.value || '')}
            options = {familyList}
            menuPosition = 'fixed'
            styles = {{
              control: (base) => ({
                ...base,
                border: '1px solid #888',
                borderRadius: '0px',
              }),
              menu: (provided) => ({
                ...provided,
                maxHeight: 300,
              })
            }}
          />
          {showColorPicker && (
            <GithubPicker
              color = {markerColor}
              colors = {availableColors}
              onChangeComplete={(colorResult) => {
                setMarkerColor(colorResult.hex);
                setShowColorPicker(false);
              }}
              triangle="hide"
              width="188px"
            />
          )}
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