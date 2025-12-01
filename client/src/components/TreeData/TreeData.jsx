//---------imports----------
//external libraries
import { useMutation } from '@apollo/client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useNavigate } from 'react-router-dom';

//local helpers, constants, queries, and mutations
import { careNeedsList, dbhList, gardenList, siteInfoList } from '../../utils/constants.js';
import {
  confirmDiscardChanges,
  handleFieldChange,
  formatDateForDisplay,
  formatDateForDb,
  handleDateFocus,
  validateDateField,
} from '../../utils/helpers.js';
import { ADD_TREE } from '../../mutations/add_tree.js';
import { ADD_SPECIES } from '../../mutations/add_species.js';
import { UPDATE_TREE } from '../../mutations/update_tree.js';
import { DELETE_PHOTO } from '../../mutations/delete_photo.js';

//components
//import DangerFlags from './DangerFlags.jsx';
import AppContext from '../../appContext';
import NewSpeciesModal from './NewSpeciesModal.jsx';
import PhotoUploadForm from './PhotoUploadForm.jsx';

//stylesheets
import styles from './treeData.module.css';

const TreeData = () => {
  //-----------data reception and transmission----------
  //get current global states from parent
  const {
    allSpecies,
    formColor,
    refetchSpecies,
    refetchTrees,
    selectedTree,
    setFormColor,
    setWorkingTree,
    workingTree,
  } = useContext(AppContext);

  //set local states to initial values
  const [commonToScientific, setCommonToScientific] = useState(null);
  const [errors, setErrors] = useState({});
  const [installedDateField, setInstalledDateField] = useState(
    formatDateForDisplay(selectedTree.installedDate)
  );
  const [pendingSpecies, setPendingSpecies] = useState(null);
  const [showSpeciesModal, setShowSpeciesModal] = useState(false);
  const [updatedSpeciesField, setUpdatedSpeciesField] = useState(null);
  const [updatedSpeciesValue, setUpdatedSpeciesValue] = useState(null);
  const [felledDateField, setFelledDateField] = useState(
    formatDateForDisplay(selectedTree.felledDate)
  );

  const commonNameRef = useRef(null);

  //initialize keys for controlled inputs
  const [commonNameKey, setCommonNameKey] = useState('commonName-0');
  const [scientificNameKey, setScientificNameKey] = useState('scientificName-0');
  const [dbhKey, setDbhKey] = useState('dbh-0');
  const [gardenKey, setGardenKey] = useState('garden-0');

  //set up mutations
  const [addSpecies] = useMutation(ADD_SPECIES);
  const [addTree] = useMutation(ADD_TREE);
  const [deletePhoto] = useMutation(DELETE_PHOTO);
  const [updateTree] = useMutation(UPDATE_TREE);

  //initialize hooks
  const navigate = useNavigate();

  //----------useEffects----------
  //get list of species names for combo boxes
  useEffect(() => {
    if (allSpecies && allSpecies.length) {
      const commonToScientific = {};
      allSpecies.forEach((species) => {
        if (species.commonName && species.scientificName) {
          commonToScientific[species.commonName] = species.scientificName;
        }
      });
      setCommonToScientific(commonToScientific);
    }
  }, [allSpecies]);

  //set form color
  useEffect(() => {
    setFormColor({ backgroundColor: selectedTree?.invasive ? '#FFDEDE' : 'white' });
  }, [selectedTree?.invasive]);

  //check if the species name exists in the database
  useEffect(() => {
    const trimmedValue = updatedSpeciesValue?.trim();
    if (!updatedSpeciesField || !trimmedValue) return;

    const matchesPendingSpecies =
      pendingSpecies &&
      ((updatedSpeciesField === 'commonName' && pendingSpecies.commonName === trimmedValue) ||
        (updatedSpeciesField === 'scientificName' &&
          pendingSpecies.scientificName === trimmedValue));

    const matchesExistingSpecies =
      allSpecies &&
      allSpecies.some(
        (species) => species.commonName === trimmedValue || species.scientificName === trimmedValue
      );

    if (!matchesExistingSpecies && !matchesPendingSpecies) {
      setsetShowSpeciesModal(true);
    }
    setUpdatedSpeciesField(null);
    setUpdatedSpeciesValue('');
  }, [allSpecies, pendingSpecies, updatedSpeciesField, updatedSpeciesValue]);

  //----------called functions----------
  //handle control changes
  const handleInputChange = (field, event) => {
    //typeahead inputs; special case that behaves differently than vanilla form inputs
    if (Array.isArray(event)) {
      handleTypeaheadChange(field, event);
      return;
    }

    //ensures the event was triggered on a target
    const { target } = event || {};
    if (!target) return;

    //checkboxes and other inputs
    const { type, value, checked } = target;
    switch (type) {
      case 'checkbox':
        handleCheckboxChange(field, checked);
        break;
      default:
        handleDefaultInputChange(field, event);
        break;
    }
  };

  //typeahead handler
  const handleTypeaheadChange = (field, selectionArray) => {
    const selection = selectionArray[0];
    if (!selection) return;
    const isCustom = selection.customOption;
    const value = isCustom ? selection.label : selection.value;

    if (field === 'commonName') {
      const scientific = commonToScientific?.[value] || '';
      setWorkingTree((prev) => ({
        ...prev,
        commonName: value,
        scientificName: scientific,
      }));
    } else if (field === 'scientificName') {
      const common =
        Object.entries(commonToScientific || {}).find(([, sci]) => sci === value)?.[0] || '';
      setWorkingTree((prev) => ({
        ...prev,
        scientificName: value,
        commonName: common,
      }));
    } else {
      setWorkingTree((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  //checkbox handler
  const handleCheckboxChange = (field, checked) => {
    setWorkingTree((prev) => handleFieldChange(prev, field, checked));
  };

  //default input handler
  const handleDefaultInputChange = (field, event) => {
    const value = event.target.value;

    //update the main workingTree state
    setWorkingTree((prev) => handleFieldChange(prev, field, value));
  };

  //handle photo uploads
  const handlePhotoUpload = (url, photoType) => {
    setWorkingTree((prevValues) => ({
      ...prevValues,
      photos: {
        ...prevValues.photos,
        [photoType]: url,
      },
    }));
  };

  //handle adding a new species
  const handleNewSpeciesSubmit = (newSpecies) => {
    setPendingSpecies(newSpecies);

    setWorkingTree((prev) => ({
      ...prev,
      commonName: newSpecies.commonName,
      scientificName: newSpecies.scientificName,
    }));

    setCommonToScientific((prev) => ({
      ...prev,
      [newSpecies.commonName]: newSpecies.scientificName,
    }));
  };

  //cleanup
  const clearSpeciesTrigger = () => {
    setUpdatedSpeciesField(null);
    setUpdatedSpeciesValue('');
  };

  //handle OK to add or update a tree and/or species
  const handleSubmit = async () => {
    const newErrors = {};
    if (!workingTree.commonName?.trim()) {
      newErrors.commonName = 'Common name is required.';
    }
    if (!workingTree.scientificName?.trim()) {
      newErrors.scientificName = 'Scientific name is required.';
    }
    if (!workingTree.garden?.trim()) {
      newErrors.garden = 'Garden is required.';
    }
    if (installedDateField?.trim()) {
      const normalized = validateDateField(installedDateField);
      if (!normalized) {
        newErrors.installedDate = 'Installed date must be in MM/DD/YYYY or < YYYY format.';
      } else {
        workingTree.installedDate = formatDateForDb(normalized);
      }
    }

    if (felledDateField?.trim()) {
      const normalized = validateDateField(felledDateField);
      if (!normalized) {
        newErrors.felledDate = 'Felled date must be in MM/DD/YYYY or < YYYY format.';
      } else {
        workingTree.felledDate = formatDateForDb(normalized);
      }
    }

    if (!workingTree.photos?.environs?.trim()) {
      newErrors.environs = 'An environs photo is required.';
    }

    //build list of filenames to delete
    const filesToDelete = [];

    for (const photoType in selectedTree.photos) {
      const originalUrl = selectedTree.photos?.[photoType] || null;
      const updatedUrl = workingTree.photos?.[photoType] || null;

      if (originalUrl && !updatedUrl) {
        //extract filename from URL
        const parts = originalUrl.split('/uploads/');
        const fileName = parts[1] || null;
        if (fileName) filesToDelete.push(fileName);
        else console.warn('Could not extract filename for deletion from URL:', originalUrl);
      }
    }

    //delete files
    for (const fileName of filesToDelete) {
      try {
        const { data } = await deletePhoto({ variables: { fileName } });
        if (!data?.deletePhoto) {
          console.warn('Server reported failure deleting file:', fileName);
        } else {
          console.log('Deleted file:', fileName);
        }
      } catch (err) {
        console.error('Error deleting file on server:', fileName, err);
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); //clear errors if valid

    try {
      if (pendingSpecies) {
        await addSpecies({ variables: pendingSpecies });
        await refetchSpecies();
        console.log('Species added:', pendingSpecies);
        setPendingSpecies(null);
      }

      const treePayload = {
        commonName: workingTree.commonName,
        variety: workingTree.variety,
        dbh: workingTree.dbh,
        photos: workingTree.photos
          ? {
              bark: workingTree.photos.bark,
              summerLeaf: workingTree.photos.summerLeaf,
              autumnLeaf: workingTree.photos.autumnLeaf,
              fruit: workingTree.photos.fruit,
              flower: workingTree.photos.flower,
              environs: workingTree.photos.environs,
            }
          : null,
        notes: workingTree.notes,
        location: workingTree.location
          ? {
              easting: workingTree.location.easting,
              northing: workingTree.location.northing,
            }
          : null,
        garden: workingTree.garden,
        siteInfo: workingTree.siteInfo
          ? {
              slope: workingTree.siteInfo.slope,
              overheadLines: workingTree.siteInfo.overheadLines,
              treeCluster: workingTree.siteInfo.treeCluster,
              proximateStructure: workingTree.siteInfo.proximateStructure,
              proximateFence: workingTree.siteInfo.proximateFence,
              propertyLine: workingTree.siteInfo.propertyLine,
            }
          : null,
        lastUpdated: new Date().toLocaleDateString('en-US'),
        installedDate: workingTree.installedDate,
        installedBy: workingTree.installedBy,
        felledDate: workingTree.felledDate,
        felledBy: workingTree.felledBy,
        careNeeds: workingTree.careNeeds
          ? {
              multistem: workingTree.careNeeds.multistem,
              raiseCrown: workingTree.careNeeds.raiseCrown,
              routinePrune: workingTree.careNeeds.routinePrune,
              trainingPrune: workingTree.careNeeds.trainingPrune,
              priorityPrune: workingTree.careNeeds.priorityPrune,
              pestTreatment: workingTree.careNeeds.pestTreatment,
              installGrate: workingTree.careNeeds.installGrate,
              removeGrate: workingTree.careNeeds.removeGrate,
              fell: workingTree.careNeeds.fell,
              removeStump: workingTree.careNeeds.removeStump,
            }
          : null,
        hidden: workingTree.hidden,
      };

      if (!workingTree?.id) {
        const { data } = await addTree({ variables: treePayload });
        await refetchTrees();
        console.log('Tree added:', data.addTree);
      } else {
        const { data } = await updateTree({
          variables: { id: workingTree.id, ...treePayload },
        });
        await refetchTrees();
      }

      setWorkingTree(null);
      navigate('/');
    } catch (err) {
      console.error('Error saving tree or species:', err);
    }
  };

  //handle cancel button
  const handleCancel = () => {
    //if no id, it's a new tree
    if (!workingTree?.id && !workingTree?._id) {
      navigate('/');
      return;
    }

    const userConfirmed = confirmDiscardChanges(workingTree, selectedTree);
    if (!userConfirmed) return;
    setWorkingTree(null);
    navigate('/');
  };

  //----------render component----------
  return (
    <>
      <NewSpeciesModal
        clearSpeciesTrigger={clearSpeciesTrigger}
        onCancelClearSpecies={() => {
          setWorkingTree((prev) => ({
            ...prev,
            commonName: '',
            scientificName: '',
          }));
          setPendingSpecies(null);
        }}
        onHide={() => setsetShowSpeciesModal(false)}
        onSubmitNewSpecies={handleNewSpeciesSubmit}
        show={showSpeciesModal}
      />

      <Container
        className='pt-3 ps-5 card'
        style={formColor}
      >
        <Form>
          <Row>
            <Col md={6}>
              <fieldset id='taxonomy'>
                <legend>Taxonomy</legend>
                <Typeahead
                  allowNew
                  className='mt-1'
                  id='commonName'
                  isSearchable={true}
                  key={commonNameKey}
                  labelKey='label'
                  multiple={false}
                  onBlur={() => {
                    const value = (workingTree.commonName || '').trim();
                    if (!value) return;
                    handleInputChange('commonName', [{ label: value, value }]);
                    setUpdatedSpeciesField('commonName');
                    setUpdatedSpeciesValue(value);
                  }}
                  onChange={(selected) => {
                    const value = selected?.[0]?.customOption
                      ? selected[0].label
                      : selected?.[0]?.value;

                    if (value) {
                      handleInputChange('commonName', [{ label: value, value }]);
                    }
                  }}
                  onInputChange={(text) => {
                    if (text.trim() === '') {
                      setWorkingTree((prev) => ({ ...prev, commonName: '' }));
                      return;
                    }
                    setWorkingTree((prev) => ({ ...prev, commonName: text }));
                  }}
                  options={
                    commonToScientific
                      ? Object.keys(commonToScientific)
                          .sort((a, b) => a.localeCompare(b))
                          .map((common) => ({
                            label: common,
                            value: common,
                          }))
                      : []
                  }
                  placeholder='Select or add a common name'
                  ref={commonNameRef}
                  selected={
                    workingTree.commonName
                      ? [
                          {
                            label: workingTree.commonName,
                            value: workingTree.commonName,
                          },
                        ]
                      : []
                  }
                />
                {errors.commonName && <div className='text-danger mt-1'>{errors.commonName}</div>}

                <Typeahead
                  allowNew
                  className='mt-1'
                  id='scientificName'
                  key={scientificNameKey}
                  labelKey='label'
                  multiple={false}
                  onBlur={() => {
                    const value = (workingTree.scientificName || '').trim();
                    if (!value) return;
                    handleInputChange('scientificName', [{ label: value, value }]);
                    setUpdatedSpeciesField('scientificName');
                    setUpdatedSpeciesValue(value);
                  }}
                  onChange={(selected) => {
                    const value = selected?.[0]?.customOption
                      ? selected[0].label
                      : selected?.[0]?.value;

                    if (value) {
                      handleInputChange('scientificName', [{ label: value, value }]);
                    }
                  }}
                  onInputChange={(text) => {
                    if (text.trim() === '') {
                      setWorkingTree((prev) => ({ ...prev, scientificName: '' }));
                      return;
                    }
                    setWorkingTree((prev) => ({ ...prev, scientificName: text }));
                  }}
                  options={
                    commonToScientific
                      ? Object.entries(commonToScientific)
                          .sort(([, a], [, b]) => a.localeCompare(b))
                          .map(([common, scientific]) => ({
                            label: scientific,
                            value: scientific,
                          }))
                      : []
                  }
                  placeholder='Select or add a scientific name'
                  selected={
                    workingTree.scientificName
                      ? [
                          {
                            label: workingTree.scientificName,
                            value: workingTree.scientificName,
                          },
                        ]
                      : []
                  }
                />
                {errors.scientificName && (
                  <div className='text-danger mt-1'>{errors.scientificName}</div>
                )}

                <Form.Control
                  className='mt-1'
                  id='variety'
                  onChange={(event) => {
                    const text = event.target.value;
                    setWorkingTree((prev) => ({ ...prev, variety: text }));
                  }}
                  placeholder={'Provide the variety name'}
                  type='text'
                  value={workingTree.variety}
                />
              </fieldset>

              <fieldset
                className='mt-2'
                id='physicalData'
              >
                <legend>Physical Data</legend>
                <Typeahead
                  className='mt-1'
                  id='dbh'
                  isSearchable={true}
                  key={dbhKey}
                  labelKey='label'
                  multiple={false}
                  onChange={(selected) => {
                    const value = selected?.[0]?.value || '';
                    setWorkingTree((prev) => ({ ...prev, dbh: value }));
                  }}
                  onInputChange={(text) => {
                    if (text.trim() === '') {
                      setWorkingTree((prev) => ({ ...prev, dbh: '' }));
                      return;
                    }
                    setWorkingTree((prev) => ({ ...prev, dbh: text }));
                  }}
                  options={dbhList.map((dbh) => ({
                    label: dbh,
                    value: dbh,
                  }))}
                  placeholder='Select a dbh (multistem: √(a² + b² + … + n²))'
                  renderMenuItemChildren={(option) => <>{option.label}</>}
                  selected={
                    workingTree.dbh ? [{ label: workingTree.dbh, value: workingTree.dbh }] : []
                  }
                />

                <PhotoUploadForm
                  workingTree={workingTree}
                  onPhotoUpload={handlePhotoUpload}
                />
                {errors.environs && <div className='text-danger mt-1'>{errors.environs}</div>}
              </fieldset>

              <fieldset className='mt-2'>
                <legend>Notes</legend>
                <Form.Control
                  as='textarea'
                  id='notes'
                  placeholder={'YYYY: Note'}
                  onChange={(event) => handleInputChange('notes', event)}
                  rows={2}
                  value={workingTree.notes}
                />
              </fieldset>
            </Col>

            <Col md={6}>
              <fieldset id='care'>
                <legend>Care</legend>
                <Form.Group
                  as={Row}
                  className='g-0'
                >
                  <Form.Label
                    column
                    xs={4} //small phones
                    sm={3} //tablets in portrait
                    md={3} //tablets in landscape or small desktops
                    lg={3} //larger screens
                    className='text-start'
                  >
                    Installed on:
                  </Form.Label>
                  <Col
                    xs={8} //small phones
                    sm={9} //tablets in portrait
                    md={9} //tablets in landscape or small desktops
                    lg={9} //larger screens
                  >
                    <Form.Control
                      id='installedDate'
                      onBlur={(event) => {
                        setWorkingTree((prev) => ({
                          ...prev,
                          installedDate: formatDateForDb(event.target.value),
                        }));
                      }}
                      onChange={(event) => setInstalledDateField(event.target.value)}
                      onFocus={() => handleDateFocus(installedDateField, setInstalledDateField)}
                      placeholder={`Record install date ('MM/DD/YYYY' or '< YYYY')`}
                      type='text'
                      value={installedDateField}
                    />
                  </Col>
                </Form.Group>
                {errors.installedDate && (
                  <div className='text-danger mt-1'>{errors.installedDate}</div>
                )}

                <Form.Group
                  as={Row}
                  className='mt-1 g-0'
                >
                  <Form.Label
                    column
                    xs={4} //small phones
                    sm={3} //tablets in portrait
                    md={3} //tablets in landscape or small desktops
                    lg={3} //larger screens
                    className='text-start'
                  >
                    Installed by:
                  </Form.Label>
                  <Col
                    xs={8} //small phones
                    sm={9} //tablets in portrait
                    md={9} //tablets in landscape or small desktops
                    lg={9} //larger screens
                  >
                    <Form.Control
                      id='installedBy'
                      onChange={(event) => {
                        const text = event.target.value;
                        setWorkingTree((prev) => ({ ...prev, installedBy: text }));
                      }}
                      placeholder={`Provide the installer's name`}
                      type='text'
                      value={workingTree.installedBy}
                    />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className='mt-1 g-0'
                >
                  <Form.Label
                    column
                    xs={4} //small phones
                    sm={3} //tablets in portrait
                    md={3} //tablets in landscape or small desktops
                    lg={3} //larger screens
                    className='text-start'
                  >
                    Felled on:
                  </Form.Label>
                  <Col
                    xs={8} //small phones
                    sm={9} //tablets in portrait
                    md={9} //tablets in landscape or small desktops
                    lg={9} //larger screens
                  >
                    <Form.Control
                      id='felledDate'
                      onBlur={(event) => {
                        setWorkingTree((prev) => ({
                          ...prev,
                          felledDate: formatDateForDb(event.target.value),
                        }));
                      }}
                      onChange={(event) => setFelledDateField(event.target.value)}
                      onFocus={() => handleDateFocus(felledDateField, setFelledDateField)}
                      placeholder={`Record felling date ('MM/DD/YYYY' or '< YYYY')`}
                      type='text'
                      value={felledDateField}
                    />
                  </Col>
                </Form.Group>
                {errors.felledDate && <div className='text-danger mt-1'>{errors.felledDate}</div>}

                <Form.Group
                  as={Row}
                  className='mt-1 g-0'
                >
                  <Form.Label
                    column
                    xs={4} //small phones
                    sm={3} //tablets in portrait
                    md={3} //tablets in landscape or small desktops
                    lg={3} //larger screens
                    className='text-start'
                  >
                    Felled by:
                  </Form.Label>
                  <Col
                    xs={8} //small phones
                    sm={9} //tablets in portrait
                    md={9} //tablets in landscape or small desktops
                    lg={9} //larger screens
                  >
                    <Form.Control
                      id='felledBy'
                      onChange={(event) => {
                        const text = event.target.value;
                        setWorkingTree((prev) => ({ ...prev, felledBy: text }));
                      }}
                      placeholder={`Provide the feller's name`}
                      type='text'
                      value={workingTree.felledBy ? workingTree.felledBy : ''}
                    />
                  </Col>
                </Form.Group>

                <Form.Group className='mt-2'>
                  <Row>
                    {careNeedsList.map((need) => (
                      <Col
                        xs={12}
                        sm={6}
                        key={need}
                      >
                        <Form.Check
                          checked={workingTree.careNeeds[need] || false}
                          id={need}
                          label={need
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())}
                          onChange={(event) => handleInputChange(`careNeeds.${need}`, event)}
                          type='checkbox'
                        />
                      </Col>
                    ))}
                  </Row>
                </Form.Group>
              </fieldset>

              <fieldset
                id='siteInfo'
                className='mt-2'
              >
                <legend>Site Conditions</legend>
                <Typeahead
                  key={gardenKey}
                  className='mt-1'
                  id='garden'
                  isSearchable={true}
                  labelKey='label'
                  multiple={false}
                  onChange={(selected) => {
                    const value = selected?.[0]?.value || '';
                    setWorkingTree((prev) => ({ ...prev, garden: value }));
                  }}
                  onInputChange={(text) => {
                    if (text.trim() === '') {
                      setWorkingTree((prev) => ({ ...prev, garden: '' }));
                      return;
                    }
                    setWorkingTree((prev) => ({ ...prev, garden: text }));
                  }}
                  options={gardenList.map((garden) => ({
                    label: garden,
                    value: garden,
                  }))}
                  placeholder='Select a garden'
                  selected={
                    workingTree.garden
                      ? [{ label: workingTree.garden, value: workingTree.garden }]
                      : []
                  }
                />
                {errors.garden && <div className='text-danger mt-1'>{errors.garden}</div>}

                <Form.Group className='mt-2'>
                  <Row>
                    {siteInfoList.map((condition) => (
                      <Col
                        xs={12}
                        sm={6}
                        key={condition}
                      >
                        <Form.Check
                          checked={workingTree.siteInfo[condition] || false}
                          id={condition}
                          label={condition
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())}
                          onChange={(event) => handleInputChange(`siteInfo.${condition}`, event)}
                          type='checkbox'
                        />
                      </Col>
                    ))}
                  </Row>
                </Form.Group>
              </fieldset>
            </Col>
          </Row>

          <Row className='mt-1'>
            <Col md={6}>
              <div
                id='autodata'
                className='mt-1'
              >
                <p>
                  Last updated:{' '}
                  {workingTree.lastUpdated
                    ? new Date(parseInt(workingTree.lastUpdated)).toLocaleDateString('en-US')
                    : new Date().toLocaleDateString('en-US')}
                </p>
              </div>
            </Col>

            <Col className='d-flex gap-1 pt-1 pb-1 justify-content-end'>
              <Button
                className='pull-right'
                variant='primary'
                size='sm'
                type='button'
                onClick={handleSubmit}
              >
                OK
              </Button>

              <Button
                variant='secondary'
                size='sm'
                type='button'
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default TreeData;
