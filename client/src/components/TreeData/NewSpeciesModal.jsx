//----------Import----------
//external libraries
import React, { useEffect, useContext, useRef, useState } from 'react';
import { CirclePicker } from 'react-color';
import { Modal, Button, Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

//local components
import AppContext from '../../appContext';

//project-specific constants
import { markerColorList } from '../../utils/constants.js';

//styles (load order is important)
import styles from './treeData.module.css';

//----------Create Component----------
const NewSpeciesModal = ({
  show,
  onHide,
  clearSpeciesTrigger,
  onCancelClearSpecies,
  onSubmitNewSpecies,
}) => {
  //initialize React hooks (e.g., useRef, useNavigate, custom hooks)
  const modalCommonName = useRef(null);
  const modalScientificName = useRef(null);

  //access global states from parent (using Context)
  const { allSpecies, setAllSpecies, allTrees, setAllTrees, workingTree, setWorkingTree } =
    useContext(AppContext);

  //define local states and set initial values
  const [commonName, setCommonName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [family, setFamily] = useState('');
  const [familyInput, setFamilyInput] = useState('');
  const [markerColor, setMarkerColor] = useState('');
  const [nonnative, setNonnative] = useState(false);
  const [invasive, setInvasive] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [errors, setErrors] = useState({});
  const { familyList, usedColors } = Object.values(allSpecies).reduce(
    (acc, species) => {
      //add unique families
      if (!acc.familySet.has(species.family)) {
        acc.familySet.add(species.family);
        acc.familyList.push({
          label: species.family,
          value: species.family,
        });
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
      colorSet: new Set(),
    }
  );
  const availableColors = markerColorList.filter((color) => !usedColors.includes(color)).sort();

  useEffect(() => {
    if (show) {
      setCommonName(workingTree?.commonName || '');
      setScientificName(workingTree?.scientificName || '');

      //delay needed to ensure DOM elements are available
      setTimeout(() => {
        if (!workingTree?.commonName) {
          modalCommonName.current?.focus();
        } else {
          modalScientificName.current?.focus();
        }
      }, 0);
    }
  }, [show]);

  //handlers and callback functions
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
        if (!familyList.some((item) => item.value === value)) {
          setShowColorPicker(true);
          setMarkerColor('');
        } else {
          const existingSpecies = allSpecies.find((s) => s.family === value);
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

    if (!commonName.trim() || !scientificName.trim() || !family.trim() || !markerColor.trim()) {
      alert('All fields are required to add a species to the database.');
      return;
    }

    const newSpecies = {
      commonName: commonName.trim(),
      scientificName: scientificName.trim(),
      family: family.trim(),
      markerColor,
      nonnative,
      invasive,
    };

    // Let parent handle the update
    onSubmitNewSpecies(newSpecies);
    setAllSpecies((prev) => [...prev, newSpecies]);

    setCommonName('');
    setScientificName('');
    setFamily('');
    setFamilyInput('');
    setMarkerColor('');
    setNonnative(false);
    setInvasive(false);
    setShowColorPicker(false);

    clearSpeciesTrigger();
    onHide();
  };

  const handleCancel = () => {
    onHide();
    clearSpeciesTrigger();
    onCancelClearSpecies();
  };

  //----------Render Component----------
  return (
    <Modal
      backdrop='static'
      centered
      keyboard={false}
      onHide={handleCancel}
      show={show}
    >
      <Modal.Header className='pt-1 pb-1'>
        <Modal.Title>Add New Species</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          id='newCommonName'
          ref={modalCommonName}
          onChange={(event) => handleInputChange('commonName', event.target.value)}
          placeholder='Common name'
          required
          type='text'
          value={commonName}
        />
        <Form.Control
          className='mt-1'
          id='newScientificName'
          onChange={(event) => handleInputChange('scientificName', event.target.value)}
          placeholder='Scientific name'
          ref={modalScientificName}
          required
          type='text'
          value={scientificName}
        />
        <Typeahead
          allowNew
          className='mt-1'
          // filterBy={() => true}
          id='family'
          labelKey='label'
          multiple={false}
          onBlur={() => {
            const value = familyInput.trim();
            if (!value) return;
            handleInputChange('family', value);
          }}
          onChange={(selected) => {
            const value = selected?.[0]?.customOption ? selected[0].label : selected?.[0]?.value;

            if (value) {
              handleInputChange('family', value);
              setFamilyInput(value);
            }
          }}
          onInputChange={(text) => setFamilyInput(text)}
          options={familyList}
          placeholder='Family'
          required
          selected={family ? [{ label: family, value: family }] : []}
        />
        {showColorPicker && (
          <CirclePicker
            className='mt-3'
            color={markerColor}
            colors={availableColors}
            onChangeComplete={(colorResult) => {
              setMarkerColor(colorResult.hex);
              setShowColorPicker(false);
            }}
            // required
            triangle='hide'
            width='100%'
          />
        )}
        <Form.Check
          className='mt-3'
          checked={nonnative}
          id='nonnative'
          label='Nonnative'
          onChange={(event) => handleInputChange('nonnative', event.target.checked)}
        />
        <Form.Check
          checked={invasive}
          id='invasive'
          label='Invasive'
          onChange={(event) => handleInputChange('invasive', event.target.checked)}
        />
      </Modal.Body>
      <Modal.Footer className='pt-1 pb-1'>
        <Button
          variant='primary'
          size='sm'
          onClick={(event) => handleSubmit(event)}
        >
          OK
        </Button>
        <Button
          variant='secondary'
          size='sm'
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewSpeciesModal;
