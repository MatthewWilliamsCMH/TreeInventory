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
    allSpecies,
    setAllSpecies,
    refetchSpecies,
    allTrees,
    setAllTrees,
    refetchTrees,
    updatedTree,
    setUpdatedTree,
    selectedTree,
    setSelectedTree,
    formColor,
    setFormColor,
  } = useOutletContext();

  //set local states to initial values
  const [modalVisible, setModalVisible] = useState(false);
  const [commonToScientific, setCommonToScientific] = useState(null);
  const [updatedSpeciesField, setUpdatedSpeciesField] = useState(null);
  const [updatedSpeciesValue, setUpdatedSpeciesValue] = useState(null);
  const [pendingSpecies, setPendingSpecies] = useState(null);

  //initialize keys for controlled inputs
  const [commonNameKey, setCommonNameKey] = useState('commonName-0');
  const [scientificNameKey, setScientificNameKey] = useState('scientificName-0');
  const [dbhKey, setDbhKey] = useState('dbh-0');
  const [gardenKey, setGardenKey] = useState('garden-0');

  //set up mutations
  const [addTree] = useMutation(ADD_TREE);
  const [updateTree] = useMutation(UPDATE_TREE);
  const [addSpecies] = useMutation(ADD_SPECIES);

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
    setFormColor({ backgroundColor: updatedTree?.invasive ? '#FFDEDE' : 'white' });
  }, [updatedTree?.invasive]);

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
      setUpdatedTree((prev) => ({
        ...prev,
        commonName: value,
        scientificName: scientific,
      }));
    } else if (field === 'scientificName') {
      const common =
        Object.entries(commonToScientific || {}).find(([, sci]) => sci === value)?.[0] || '';
      setUpdatedTree((prev) => ({
        ...prev,
        scientificName: value,
        commonName: common,
      }));
    } else {
      setUpdatedTree((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  //checkbox handler
  const handleCheckboxChange = (field, checked) => {
    setUpdatedTree((prev) => handleFieldChange(prev, field, checked));
  };

  //default input handler
  const handleDefaultInputChange = (field, event) => {
    const value = event.target.value;

    // Update the main updatedTree state
    setUpdatedTree((prev) => handleFieldChange(prev, field, value));
  };

  //handle photo uploads
  const handlePhotoUpload = (url, photoType) => {
    setUpdatedTree((prevValues) => ({
      ...prevValues,
      photos: {
        ...prevValues.photos,
        [photoType]: url,
      },
    }));
  };

  //handle adding a new species
  const handleNewSpeciesSubmit = (newSpecies) => {
    console.log('handleNewSpeciesSubmit called with:', newSpecies);

    setPendingSpecies(newSpecies);

    setUpdatedTree((prev) => {
      const newTree = {
        ...prev,
        commonName: newSpecies.commonName,
        scientificName: newSpecies.scientificName,
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
        await addSpecies({ variables: pendingSpecies });
        await refetchSpecies();
        console.log('Species added:', pendingSpecies);
        setPendingSpecies(null);
      }

      const treePayload = {
        commonName: updatedTree.commonName,
        variety: updatedTree.variety,
        dbh: updatedTree.dbh,
        photos: updatedTree.photos
          ? {
              bark: updatedTree.photos.bark,
              summerLeaf: updatedTree.photos.summerLeaf,
              autumnLeaf: updatedTree.photos.autumnLeaf,
              fruit: updatedTree.photos.fruit,
              flower: updatedTree.photos.flower,
              environs: updatedTree.photos.environs,
            }
          : null,
        notes: updatedTree.notes,
        location: updatedTree.location
          ? {
              easting: updatedTree.location.easting,
              northing: updatedTree.location.northing,
            }
          : null,
        garden: updatedTree.garden,
        siteInfo: updatedTree.siteInfo
          ? {
              slope: updatedTree.siteInfo.slope,
              overheadLines: updatedTree.siteInfo.overheadLines,
              treeCluster: updatedTree.siteInfo.treeCluster,
              proximateStructure: updatedTree.siteInfo.proximateStructure,
              proximateFence: updatedTree.siteInfo.proximateFence,
              propertyLine: updatedTree.siteInfo.propertyLine,
            }
          : null,
        lastUpdated: new Date().toLocaleDateString('en-US'),
        installedDate: updatedTree.installedDate,
        installedBy: updatedTree.installedBy,
        felledDate: updatedTree.felledDate,
        felledBy: updatedTree.felledBy,
        careNeeds: updatedTree.careNeeds
          ? {
              multistem: updatedTree.careNeeds.multistem,
              raiseCrown: updatedTree.careNeeds.raiseCrown,
              routinePrune: updatedTree.careNeeds.routinePrune,
              trainingPrune: updatedTree.careNeeds.trainingPrune,
              priorityPrune: updatedTree.careNeeds.priorityPrune,
              pestTreatment: updatedTree.careNeeds.pestTreatment,
              installGrate: updatedTree.careNeeds.installGrate,
              removeGrate: updatedTree.careNeeds.removeGrate,
              fell: updatedTree.careNeeds.fell,
              removeStump: updatedTree.careNeeds.removeStump,
            }
          : null,
        hidden: updatedTree.hidden,
      };

      if (!updatedTree?.id) {
        const { data } = await addTree({ variables: treePayload });
        await refetchTrees();
        console.log('Tree added:', data.addTree);
      } else {
        const { data } = await updateTree({
          variables: { id: updatedTree.id, ...treePayload },
        });
        await refetchTrees();
        console.log('Tree updated:', data.updateTree);
      }

      setUpdatedTree(null);
      // setSelectedTree(null);
      navigate('/');
    } catch (err) {
      console.error('Error saving tree or species:', err);
    }
  };

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
          setUpdatedTree((prev) => ({
            ...prev,
            commonName: '',
            scientificName: '',
          }));
        }}
        onHide={() => setModalVisible(false)}
        onSubmitNewSpecies={handleNewSpeciesSubmit}
        show={modalVisible}
      />

      <div className={styles.dangerFlagsContainer}>
        <DangerFlags updatedTree={updatedTree} />
      </div>

      <Container
        className='pt-3'
        style={{ paddingLeft: '5rem' }}
      >
        <Form style={formColor}>
          <Row>
            <Col md={6}>
              <fieldset id='taxonomy'>
                <legend>Taxonomy</legend>
                <Typeahead
                  allowNew
                  className='mt-1'
                  filterBy={() => true}
                  id='commonName'
                  isSearchable={true}
                  key={commonNameKey}
                  labelKey='label'
                  multiple={false}
                  onBlur={() => {
                    if (updatedTree.commonName.trim()) {
                      handleInputChange('commonName', [
                        {
                          label: updatedTree.commonName.trim(),
                          value: updatedTree.commonName.trim(),
                        },
                      ]);
                      setUpdatedSpeciesField('commonName');
                      setUpdatedSpeciesValue(updatedTree.commonName.trim());
                    }
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
                      setUpdatedTree((prev) => ({ ...prev, commonName: '' }));
                      return;
                    }
                    setUpdatedTree((prev) => ({ ...prev, commonName: text }));
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
                  selected={
                    updatedTree.commonName
                      ? [
                          {
                            label: updatedTree.commonName,
                            value: updatedTree.commonName,
                          },
                        ]
                      : []
                  }
                />

                <Typeahead
                  allowNew
                  className='mt-1'
                  filterBy={() => true}
                  id='scientificName'
                  key={scientificNameKey}
                  labelKey='label'
                  multiple={false}
                  onBlur={() => {
                    if (updatedTree.scientificName.trim()) {
                      handleInputChange('scientificName', [
                        {
                          label: updatedTree.scientificName.trim(),
                          value: updatedTree.scientificName.trim(),
                        },
                      ]);
                      setUpdatedSpeciesField('scientificName');
                      setUpdatedSpeciesValue(updatedTree.scientificName.trim());
                    }
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
                      setUpdatedTree((prev) => ({ ...prev, scientificName: '' }));
                      return;
                    }
                    setUpdatedTree((prev) => ({ ...prev, scientificName: text }));
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
                    updatedTree.scientificName
                      ? [
                          {
                            label: updatedTree.scientificName,
                            value: updatedTree.scientificName,
                          },
                        ]
                      : []
                  }
                />
                <Form.Control
                  className='mt-1'
                  id='variety'
                  onChange={(event) => {
                    const text = event.target.value;
                    // if (text.trim() === '') {
                    //   setUpdatedTree((prev) => ({ ...prev, variety: '' }));
                    //   return;
                    // }
                    setUpdatedTree((prev) => ({ ...prev, variety: text }));
                  }}
                  placeholder={'Provide the variety name'}
                  type='text'
                  value={updatedTree.variety}
                />
              </fieldset>

              <fieldset
                className='mt-2'
                id='physicalData'
              >
                <legend>Physical Data</legend>
                <Typeahead
                  className='mt-1'
                  filterBy={() => true}
                  id='dbh'
                  inputProps={{
                    //this suppresses the keyboard on mobile devices
                    readOnly: true,
                    inputMode: 'none',
                  }}
                  key={dbhKey}
                  labelKey='label'
                  multiple={false}
                  onChange={(selected) => {
                    const value = selected?.[0]?.value || '';
                    setUpdatedTree((prev) => ({ ...prev, dbh: value }));
                  }}
                  onInputChange={(text) => {
                    if (text.trim() === '') {
                      setUpdatedTree((prev) => ({ ...prev, dbh: '' }));
                      return;
                    }
                    setUpdatedTree((prev) => ({ ...prev, dbh: text }));
                  }}
                  options={dbhList.map((dbh) => ({
                    label: dbh,
                    value: dbh,
                  }))}
                  placeholder='Select a diameter at breast height (DBH)'
                  renderMenuItemChildren={(option) => <>{option.label}</>}
                  selected={
                    updatedTree.dbh ? [{ label: updatedTree.dbh, value: updatedTree.dbh }] : []
                  }
                />

                <PhotoUploadForm
                  updatedTree={updatedTree}
                  onPhotoUpload={handlePhotoUpload}
                />
              </fieldset>

              <fieldset className='mt-2'>
                <legend>Notes</legend>
                <Form.Control
                  as='textarea'
                  id='notes'
                  placeholder={'YYYY: Note'}
                  onChange={(event) => handleInputChange('notes', event)}
                  rows={2}
                  value={updatedTree.notes}
                />
              </fieldset>
            </Col>

            <Col md={6}>
              <fieldset id='care'>
                <legend>Care</legend>
                {/*add tool tips to these four fields or add labels to the left */}
                <Form.Group
                  as={Row}
                  className='g-0'
                >
                  <Form.Label
                    column
                    xs={4} // small phones
                    sm={3} // tablets in portrait
                    md={3} // tablets in landscape or small desktops
                    lg={3} // larger screens
                    className='text-start'
                  >
                    Installed on:
                  </Form.Label>
                  <Col
                    xs={8} // small phones
                    sm={9} // tablets in portrait
                    md={9} // tablets in landscape or small desktops
                    lg={9} // larger screens
                  >
                    <Form.Control
                      id='installedDate'
                      onBlur={(event) => {
                        const text = formatDateforDisplay(event.target.value);
                        setUpdatedTree((prev) => ({ ...prev, installedDate: text }));
                      }}
                      onChange={(event) => {
                        const text = event.target.value;
                        // if (text.trim() === '') {
                        //   setUpdatedTree((prev) => ({ ...prev, installedDate: '' }));
                        //   return;
                        // }
                        setUpdatedTree((prev) => ({ ...prev, installedDate: text }));
                      }}
                      placeholder={`Record installation date ('MM/DD/YYYY' or '<YYYY')`}
                      type='text'
                      value={updatedTree.installedDate}
                    />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className='mt-1 g-0'
                >
                  <Form.Label
                    column
                    xs={4} // small phones
                    sm={3} // tablets in portrait
                    md={3} // tablets in landscape or small desktops
                    lg={3} // larger screens
                    className='text-start'
                  >
                    Installed by:
                  </Form.Label>
                  <Col
                    xs={8} // small phones
                    sm={9} // tablets in portrait
                    md={9} // tablets in landscape or small desktops
                    lg={9} // larger screens
                  >
                    <Form.Control
                      id='installedBy'
                      onChange={(event) => {
                        const text = event.target.value;
                        // if (text.trim() === '') {
                        //   setUpdatedTree((prev) => ({ ...prev, installedBy: '' }));
                        //   return;
                        // }
                        setUpdatedTree((prev) => ({ ...prev, installedBy: text }));
                      }}
                      placeholder={`Provide the installer's name`}
                      type='text'
                      value={updatedTree.installedBy}
                    />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className='mt-1 g-0'
                >
                  <Form.Label
                    column
                    xs={4} // small phones
                    sm={3} // tablets in portrait
                    md={3} // tablets in landscape or small desktops
                    lg={3} // larger screens
                    className='text-start'
                  >
                    Felled on:
                  </Form.Label>
                  <Col
                    xs={8} // small phones
                    sm={9} // tablets in portrait
                    md={9} // tablets in landscape or small desktops
                    lg={9} // larger screens
                  >
                    <Form.Control
                      id='felledDate'
                      onBlur={(event) => {
                        const text = formatDateforDisplay(event.target.value);
                        setUpdatedTree((prev) => ({ ...prev, felledDate: text }));
                      }}
                      onChange={(event) => {
                        const text = event.target.value;
                        // if (text.trim() === '') {
                        //   setUpdatedTree((prev) => ({ ...prev, felledDate: '' }));
                        //   return;
                        // }
                        setUpdatedTree((prev) => ({ ...prev, felledDate: text }));
                      }}
                      placeholder={`Record fell date ('MM/DD/YYYY' or '<YYYY')`}
                      type='text'
                      value={updatedTree.felledDate}
                    />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className='mt-1 g-0'
                >
                  <Form.Label
                    column
                    xs={4} // small phones
                    sm={3} // tablets in portrait
                    md={3} // tablets in landscape or small desktops
                    lg={3} // larger screens
                    className='text-start'
                  >
                    Felled by:
                  </Form.Label>
                  <Col
                    xs={8} // small phones
                    sm={9} // tablets in portrait
                    md={9} // tablets in landscape or small desktops
                    lg={9} // larger screens
                  >
                    <Form.Control
                      id='felledBy'
                      onChange={(event) => {
                        const text = event.target.value;
                        // if (text.trim() === '') {
                        //   setUpdatedTree((prev) => ({ ...prev, felledBy: '' }));
                        //   return;
                        // }
                        setUpdatedTree((prev) => ({ ...prev, felledBy: text }));
                      }}
                      placeholder={`Provide the feller's name`}
                      type='text'
                      value={updatedTree.felledBy ? updatedTree.felledBy : ''}
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
                          checked={updatedTree.careNeeds[need] || false}
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
                  inputProps={{
                    //this suppresses the keyboard on mobile devices
                    readOnly: true,
                    inputMode: 'none',
                  }}
                  filterBy={() => true}
                  labelKey='label'
                  multiple={false}
                  onChange={(selected) => {
                    const value = selected?.[0]?.value || '';
                    setUpdatedTree((prev) => ({ ...prev, garden: value }));
                  }}
                  onInputChange={(text) => {
                    if (text.trim() === '') {
                      setUpdatedTree((prev) => ({ ...prev, garden: '' }));
                      return;
                    }
                    setUpdatedTree((prev) => ({ ...prev, garden: text }));
                  }}
                  options={gardenList.map((garden) => ({
                    label: garden,
                    value: garden,
                  }))}
                  placeholder='Select a garden'
                  selected={
                    updatedTree.garden
                      ? [{ label: updatedTree.garden, value: updatedTree.garden }]
                      : []
                  }
                />

                <Form.Group className='mt-2'>
                  <Row>
                    {siteInfoList.map((condition) => (
                      <Col
                        xs={12}
                        sm={6}
                        key={condition}
                      >
                        <Form.Check
                          checked={updatedTree.siteInfo[condition] || false}
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
                  {updatedTree.lastUpdated
                    ? new Date(parseInt(updatedTree.lastUpdated)).toLocaleDateString('en-US')
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
                type='cancel'
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
