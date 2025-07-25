//---------imports----------
//external libraries
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useNavigate, useOutletContext } from 'react-router-dom';

//local helpers, constants, queries, and mutations
import { dbhList, gardenList, siteInfoList, careNeedsList } from '../../utils/constants.js';
import { handleFieldChange, formatDateForDisplay } from '../../utils/helpers.js';
import { ADD_TREE } from '../../mutations/add_tree.js';
import { UPDATE_TREE } from '../../mutations/update_tree.js';
import { ADD_SPECIES } from '../../mutations/add_species.js';

//components
import DangerFlags from './DangerFlags.jsx';
import PhotoUploadForm from './PhotoUploadForm.jsx';
import NewSpeciesModal from './NewSpeciesModal.jsx';

//stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './treeData.module.css';

const TreeData = () => {
  //-----------data reception and transmission----------
  //get current global states from parent
  const { 
    allSpecies, setAllSpecies,
    refetchSpecies,
    allTrees, setAllTrees, 
    refetchTrees,
    updatedTree, setUpdatedTree, 
    selectedTree, setSelectedTree,
    formColor, setFormColor 
    } = useOutletContext();

  //set local states to initial values
  const [modalVisible, setModalVisible] = useState(false);
  const [commonToScientific, setCommonToScientific] = useState(null);
  const [updatedSpeciesField, setUpdatedSpeciesField] = useState(null);
  const [updatedSpeciesValue, setUpdatedSpeciesValue] = useState(null);
  const [pendingSpecies, setPendingSpecies] = useState(null);

  //set states for inputs with complex behaviors
  const [commonNameInput, setCommonNameInput] = useState('');
  const [commonNameDropdownOpen, setCommonNameDropdownOpen] = useState(false);
  const [scientificNameInput, setScientificNameInput] = useState('');
  const [scientificNameDropdownOpen, setScientificNameDropdownOpen] = useState(false);
  const [dbhInput, setDbhInput] = useState('');
  const [installedDateInput, setInstalledDateInput] = useState(formatDateForDisplay(updatedTree.installedDate) || '');
  const [felledDateInput, setFelledDateInput] = useState(formatDateForDisplay(updatedTree.felledDate) || '');

  //set up mutations
  const [addTree] = useMutation(ADD_TREE);
  const [updateTree] = useMutation(UPDATE_TREE);
  const [addSpecies] = useMutation(ADD_SPECIES);

  //set up hooks
  const navigate = useNavigate();

  //----------useEffects----------
  //get list of species names for combo boxes
  useEffect(() => {
    if (allSpecies && allSpecies.length) {
      const commonToScientific = {};
      allSpecies.forEach(species => {
        if (species.commonName && species.scientificName) {
          commonToScientific[species.commonName] = species.scientificName;
        }
      });
      setCommonToScientific(commonToScientific);
    }
  }, [allSpecies]);

  //set form color
  useEffect(() => {
    setFormColor({ backgroundColor: updatedTree?.invasive ? '#FFDEDE' : 'white' });
  }, [updatedTree?.invasive]);

  //check if the species name exists in the database
  useEffect(() => {
    const trimmedValue = updatedSpeciesValue?.trim();
    if (!updatedSpeciesField || !trimmedValue) return;

    const matchesPendingSpecies =
      pendingSpecies &&
      (
        (updatedSpeciesField === 'commonName' && pendingSpecies.commonName === trimmedValue) ||
        (updatedSpeciesField === 'scientificName' && pendingSpecies.scientificName === trimmedValue)
      );

    const matchesExistingSpecies =
      allSpecies &&
      allSpecies.some(species =>
        species.commonName === trimmedValue ||
        species.scientificName === trimmedValue
      );

    if (!matchesExistingSpecies && !matchesPendingSpecies) {
      setModalVisible(true);
    }

    setUpdatedSpeciesField(null);
    setUpdatedSpeciesValue('');
  }, [updatedSpeciesField, updatedSpeciesValue, allSpecies, pendingSpecies]);


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
      setUpdatedTree(prev => ({
        ...prev,
        commonName: value,
        scientificName: scientific
      }));
    } else if (field === 'scientificName') {
      const common = Object.entries(commonToScientific || {}).find(([, sci]) => sci === value)?.[0] || '';
      setUpdatedTree(prev => ({
        ...prev,
        scientificName: value,
        commonName: common
      }));
    } else {
      setUpdatedTree(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  //checkbox handler
  const handleCheckboxChange = (field, checked) => {
    setUpdatedTree(prev => handleFieldChange(prev, field, checked));
  };

  //default input handler
  const handleDefaultInputChange = (field, event) => {
    const value = event.target.value;

    // Update local input states for date fields so input stays editable
    if (field === 'installedDate') {
      setInstalledDateInput(value);
    }
    if (field === 'felledDate') {
      setFelledDateInput(value);
    }

    // Update the main updatedTree state
    setUpdatedTree(prev => handleFieldChange(prev, field, value));
  };

  //handle photo uploads
  const handlePhotoUpload = (url, photoType) => {
    setUpdatedTree(prevValues => ({
      ...prevValues,
      photos: {
        ...prevValues.photos,
        [photoType]: url
      }
    }));
  };

  // //handle adding a new species
  const handleNewSpeciesSubmit = (newSpecies) => {
    console.log('handleNewSpeciesSubmit called with:', newSpecies);

    setPendingSpecies(newSpecies);

    setUpdatedTree(prev => {
      const newTree = {
        ...prev,
        commonName: newSpecies.commonName,
        scientificName: newSpecies.scientificName
      };
      return newTree;
    });
  };

  //cleanup
  const clearSpeciesTrigger = () => {
    setUpdatedSpeciesField(null);
    setUpdatedSpeciesValue('');
  };

  //handle OK to add or update a tree and/or species
  const handleSubmit = async () => {
    try {
      if (pendingSpecies) {
        await addSpecies({variables: pendingSpecies});
        await refetchSpecies();
        console.log('Species added:', pendingSpecies);
        setPendingSpecies(null);
      }

      const treePayload = {
        commonName: updatedTree.commonName,
        variety: updatedTree.variety,
        dbh: updatedTree.dbh,
        photos: updatedTree.photos ? {
          bark: updatedTree.photos.bark,
          summerLeaf: updatedTree.photos.summerLeaf,
          autumnLeaf: updatedTree.photos.autumnLeaf,
          fruit: updatedTree.photos.fruit,
          flower: updatedTree.photos.flower,
          environs: updatedTree.photos.environs
        } : null,
        notes: updatedTree.notes,
        location: updatedTree.location ? {
          easting: updatedTree.location.easting,
          northing: updatedTree.location.northing
        } : null,
        garden: updatedTree.garden,
        siteInfo: updatedTree.siteInfo ? {
          slope: updatedTree.siteInfo.slope,
          overheadLines: updatedTree.siteInfo.overheadLines,
          treeCluster: updatedTree.siteInfo.treeCluster,
          proximateStructure: updatedTree.siteInfo.proximateStructure,
          proximateFence: updatedTree.siteInfo.proximateFence,
        } : null,
        lastUpdated: new Date().toLocaleDateString('en-US'),
        installedDate: updatedTree.installedDate,
        installedBy: updatedTree.installedBy,
        felledDate: updatedTree.felledDate,
        felledBy: updatedTree.felledBy,
        careNeeds: updatedTree.careNeeds ? {
          install: updatedTree.careNeeds.install,
          raiseCrown: updatedTree.careNeeds.raiseCrown,
          routinePrune: updatedTree.careNeeds.routinePrune,
          trainingPrune: updatedTree.careNeeds.trainingPrune,
          priorityPrune: updatedTree.careNeeds.priorityPrune,
          pestTreatment: updatedTree.careNeeds.pestTreatment,
          installGrate: updatedTree.careNeeds.installGrate,
          removeGrate: updatedTree.careNeeds.removeGrate,
          fell: updatedTree.careNeeds.fell,
          removeStump: updatedTree.careNeeds.removeStump
        } : null,
        hidden: updatedTree.hidden
      };
      console.log('Submitting tree payload:', treePayload);
      if (!updatedTree?.id) {
        const { data } = await addTree({ variables: treePayload });
        await refetchTrees();
        console.log('Tree added:', data.addTree);
      } else {
        const { data } = await updateTree({
          variables: { id: updatedTree.id, ...treePayload }
        });
        await refetchTrees();
        console.log('Tree updated:', data.updateTree);
      }

      setUpdatedTree(null);
      setSelectedTree(null);
      navigate('/')
    } catch (err) {
      console.error('Error saving tree or species:', err);
    }
  }

  //handle cancel button
  const handleCancel = () => {
    setUpdatedTree(null);
    navigate('/');
  };

  //----------render component----------
  return (
    <>
      <NewSpeciesModal
        clearSpeciesTrigger={clearSpeciesTrigger}
        onCancelClearSpecies={() => {
          setCommonNameInput('');
          setScientificNameInput('');
          setUpdatedTree(prev => ({
            ...prev,
            commonName: '',
            scientificName: ''
          }));
        }}
        onHide = {() => setModalVisible(false)}
        onSubmitNewSpecies = {handleNewSpeciesSubmit}
        show = {modalVisible}
      />

      <div className = {styles.dangerFlagsContainer}>
        <DangerFlags updatedTree = {updatedTree}/>
      </div>

      <Container className = 'pt-3' style={{ paddingLeft: '5rem' }}>
        <Form style = {formColor}>
          <Row>
            <Col md = {6}>
              <fieldset id = 'taxonomy'>
                <legend>Taxonomy</legend>
                <Typeahead
                  allowNew
                  className = 'mt-1'
                  filterBy = {() => true}
                  id = 'commonName'
                  labelKey = 'label'
                  multiple = {false}
                  onBlur = {() => {
                    if (commonNameInput.trim()) {
                      handleInputChange('commonName', [
                        { label: commonNameInput.trim(), value: commonNameInput.trim() },
                      ]);
                      setUpdatedSpeciesField('commonName');
                      setUpdatedSpeciesValue(commonNameInput.trim());
                    }
                  }}
                  onChange={(selected) => {
                    const value = selected?.[0]?.customOption
                      ? selected[0].label
                      : selected?.[0]?.value;

                    if (value) {
                      handleInputChange('commonName', [{ label: value, value }]);
                      setCommonNameDropdownOpen(false);
                    }
                  }}
                  onInputChange={(text) => {
                    setCommonNameInput(text);
                    setCommonNameDropdownOpen(true);
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
                  placeholder="Common name"
                  renderMenuItemChildren={(option) => <>{option.label}</>}
                  selected={
                    commonNameInput
                      ? [{ label: commonNameInput, value: commonNameInput }]
                      : updatedTree.commonName
                        ? [{ label: `Common name: ${updatedTree.commonName}`, value: updatedTree.commonName }]
                        : []
                  }
                />
                <Typeahead
                  allowNew
                  className='mt-1'
                  filterBy = {() => true}
                  id = 'scientificName'
                  labelKey = 'label'
                  multiple = {false}
                  onBlur = {() => {
                    if (scientificNameInput.trim()) {
                      handleInputChange('scientificName', [
                        { label: scientificNameInput.trim(), value: scientificNameInput.trim() },
                      ]);
                      setUpdatedSpeciesField('scientificName');
                      setUpdatedSpeciesValue(scientificNameInput.trim());
                    }
                  }}
                  onChange={(selected) => {
                    const value = selected?.[0]?.customOption
                      ? selected[0].label
                      : selected?.[0]?.value;

                    if (value) {
                      handleInputChange('scientificName', [{ label: value, value }]);
                      setScientificNameDropdownOpen(false);
                    }
                  }}
                  onInputChange={(text) => {
                    setScientificNameInput(text);
                    setScientificNameDropdownOpen(!!text.trim());
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
                  placeholder="Scientific name"
                  renderMenuItemChildren={(option) => <>{option.label}</>}
                  selected={
                    scientificNameInput
                      ? [{ label: scientificNameInput, value: scientificNameInput }]
                      : updatedTree.scientificName
                        ? [{ label: `Scientific name: ${updatedTree.scientificName}`, value: updatedTree.scientificName }]
                        : []
                  }
                />
              </fieldset>
              <fieldset id = 'physicalData' className = 'mt-2'>
                <legend>Physical Data</legend>
                <Typeahead
                  className = 'mt-1'
                  id = 'dbh'
                  filterBy = {() => true}
                  labelKey = 'label'
                  multiple = {false}
                  onChange = {event => handleInputChange('dbh', event)}
                  options = {dbhList.map((dbh) => ({
                    label: dbh,
                    value: dbh
                  }))}
                  placeholder = 'DBH'
                  renderMenuItemChildren={(option) => <>{option.label}</>}
                  selected = {
                    updatedTree.dbh
                      ? [{ label: `Diameter: ${updatedTree.dbh}`, value: updatedTree.dbh }]
                      : []
                  }
                />
                <PhotoUploadForm
                  updatedTree = {updatedTree}
                  onPhotoUpload = {handlePhotoUpload}
                />
              </fieldset>
              <fieldset className = 'mt-2'>
                <legend>Notes</legend>
                <Form.Control 
                  as = 'textarea'
                  id = 'notes'
                  placeholder = {'YYYY: Note'}
                  onChange = {event => handleInputChange('notes', event)}
                  rows = {2}
                  value = {updatedTree.notes}
                />
              </fieldset>
            </Col>
            <Col md = {6}>
              <fieldset id = 'care'>
                <legend>Care History</legend>
                <Form.Control
                  id = 'installedDate'
                  className = 'mb-1'
                  onChange = {(event) => handleDefaultInputChange('installedDate', event)}
                  placeholder = {`Installed date ('MM/DD/YYYY' or '<YYYY')`}
                  type = 'text'
                  //need to make this a condition so that "Installed:" is only displayed if there is a value"
                  value = { installedDateInput ? `Installed on: ${installedDateInput}` : '' }
                />
                <Form.Control
                  id = 'installedBy'
                  className = 'mb-1'
                  onChange = {(event) => handleDefaultInputChange('installedBy', event)}
                  placeholder = {'Installed by'}
                  type = 'text'
                  value = {updatedTree.installedBy ? `Installed by: ${updatedTree.installedBy}` : ''}
                />
                <Form.Control
                  id = 'felledDate'
                  className = 'mb-1'
                  onChange = {(event) => handleDefaultInputChange('felledDate', event)}
                  placeholder = {`Felled date ('MM/DD/YYYY' or '<YYYY')`}
                  type = 'text'
                  value = {felledDateInput ? `Felled on: ${felledDateInput}` : ''}
                />
                <Form.Control
                  id = 'felledBy'
                  className = 'mb-1'
                  onChange = {(event) => handleDefaultInputChange('felledBy', event)}
                  placeholder = {'Felled by'}
                  type = 'text'
                  value = {updatedTree.felledBy ? `Felled by: ${updatedTree.felledBy}` : ''}
                />
                <Form.Group className = 'mt-2'>
                  <Row>
                    {careNeedsList.map((need) => (
                      <Col xs = {12} sm = {6} key = {need}>
                        <Form.Check
                          checked = {updatedTree.careNeeds[need] || false}
                          id = {need}
                          label = {need
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase())
                          }
                          onChange = {(event) => handleInputChange(`careNeeds.${need}`, event)}
                          type = 'checkbox'
                        />
                      </Col>
                    ))}
                  </Row>
                </Form.Group>
              </fieldset>
              <fieldset id = 'siteInfo' className = 'mt-2'>
                <legend>Site Info</legend>
                <Typeahead
                  className = 'mt-1'
                  id = 'garden'
                  filterBy = {() => true}
                  labelKey = 'label'
                  multiple = {false}
                  onChange = {event => handleInputChange('garden', event)}
                  options = {gardenList.map((garden) => ({
                    label: garden,
                    value: garden
                  }))}
                  placeholder = 'Garden'
                  renderMenuItemChildren={(option) => <>{option.label}</>}
                  selected = {
                    updatedTree.garden
                      ? [{ label: `Garden: ${updatedTree.garden}`, value: updatedTree.garden }]
                      : []
                  }
                />
                <Form.Group className = 'mt-2'>
                  <Row>
                    {siteInfoList.map((condition) => (
                      <Col xs = {12} sm = {6} key = {condition}>
                        <Form.Check
                          checked = {updatedTree.siteInfo[condition] || false}
                          id = {condition}
                          label = {condition
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase())
                          }
                          onChange = {(event) => handleInputChange(`siteInfo.${condition}`, event)}
                          type = 'checkbox'
                        />
                      </Col>
                    ))}
                  </Row>
                </Form.Group>
              </fieldset>
            </Col>
          </Row>
          <Row className = 'mt-1'>
            <Col md = {6}>
              <div id = 'autodata' className = 'mt-1'>
                <p>Last updated: { 
                  updatedTree.lastUpdated 
                      ? new Date(parseInt(updatedTree.lastUpdated)).toLocaleDateString('en-US') 
                  : new Date().toLocaleDateString('en-US')
                }</p>
              </div>
            </Col>
            <Col className = 'd-flex gap-1 pt-1 pb-1 justify-content-end'>
              <Button
                className = 'pull-right'
                variant='primary'
                size = 'sm'
                type='button'
                onClick={ handleSubmit }
              >
                OK
              </Button>
              <Button
                variant='secondary'
                size = 'sm'
                type='cancel'
                onClick={ handleCancel }
              >
              Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  )
};

export default TreeData;