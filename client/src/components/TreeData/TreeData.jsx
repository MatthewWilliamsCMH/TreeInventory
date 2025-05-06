//---------imports----------
//external libraries
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

//components
import Footer from '../Footer/Footer';
import DangerFlags from '../Header/DangerFlags';
import PhotoUploadForm from './PhotoUploadForm';
import Overlay from './NewSpeciesOverlay';

//functions and constants
import { dbhList, gardenList, siteInfoList, careNeedsList } from '../../utils/constants';
import { handleFieldChange, formatDateForDisplay } from '../../utils/helpers';

//queries
import { GET_TREES } from '../../queries/get_trees';
import { GET_SPECIES } from '../../queries/get_species';

const TreeData = () => {
  //-----------data reception and transmission----------
  //get current global states using context
  const { updatedTree, setUpdatedTree, formStyle, setFormStyle } = useOutletContext();


  //set local states to initial values
  const [commonToScientificList, setCommonToScientificList] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [updatedSpeciesField, setUpdatedSpeciesField] = useState(null);
  const [updatedSpeciesValue, setUpdatedSpeciesValue] = useState(null);

  //set up queries
  const { loading: getTreesLoading, error: getTreesError, data: getTreesData } = useQuery(GET_TREES);
  const { loading: getSpeciesLoading, error: getSpeciesError, data: getSpeciesData } = useQuery(GET_SPECIES);

  //----------useEffects----------
  //compile list of species names for combo boxes
  useEffect(() => {
    if (getSpeciesData?.getSpecies && getTreesData?.getTrees) {
      const speciesMap = getSpeciesData.getSpecies.reduce((acc, species) => {
        acc[species.commonName] = species.scientificName;
        return acc;
      }, {});

      const commonToScientificList = getTreesData.getTrees.reduce((acc, tree) => {
        const commonName = tree.commonName;
        if (speciesMap[commonName]) {
          acc[commonName] = speciesMap[commonName];
        }
        return acc;
      }, {});
      setCommonToScientificList(commonToScientificList);
      setFormStyle({ backgroundColor: updatedTree.invasive ? '#FFDEDE' : 'white' });
    }
  }, [getSpeciesData, getTreesData]);

  //handle loading and error states
  if (getTreesLoading || getSpeciesLoading) {
    return <div>Loading species and tree data...</div>;
  }

  if (getTreesError || getSpeciesError) {
    return <div>Error loading data</div>;
  }

  //----------called functions----------
  //handle control changes
  const handleInputChange = (field, event) => {
    if (event.target && event.target.type === 'checkbox') {
      //checkboxes (return 'checked,' not a value)
      const value = event.target.checked;
      setUpdatedTree(prevValues => handleFieldChange(prevValues, field, value));
    } 
    else if (event.target && event.target.value !== undefined) {
      //text fields and other inputs
      const value = event.target.value;
      setUpdatedTree(prevValues => handleFieldChange(prevValues, field, value));
      
    }
    //react-select Selects and CreatableSelects (label and value are required)
    else if (event && event.value !== undefined) {
      const value = event.value;
      
      if (field === 'commonName' || field === 'scientificName') {
        setUpdatedSpeciesField(field);
        setUpdatedSpeciesValue(value);
        setUpdatedTree(prevValues => handleFieldChange(prevValues, field, value, commonToScientificList));
      } else {
        setUpdatedTree(prevValues => handleFieldChange(prevValues, field, value));
      }
    }
  };

  useEffect(() => {
    if (updatedSpeciesField && updatedSpeciesValue && updatedSpeciesValue.trim() !=='') {
      try {
        if (getSpeciesData && (getSpeciesData.getSpecies.some(species => species.commonName === updatedSpeciesValue) || getSpeciesData.getSpecies.some(species => species.scientificName === updatedSpeciesValue))) {
          console.log('Species $updatedSpeciesValue} exists.');
        }
        else {
          setOverlayVisible(true);
        }
        setUpdatedSpeciesField(null);
        setUpdatedSpeciesValue('');
      }
      catch (error) {
        console.error('Error checking species existence:', error);
      }
    }
  }, [updatedSpeciesField, updatedSpeciesValue, getSpeciesData]);

  //photo uploads
  const handlePhotoUpload = (url, photoType) => {
    setUpdatedTree(prevValues => ({
      ...prevValues,
      photos: {
        ...prevValues.photos,
        [photoType]: url
      }
    }));
  };
  
  return (
    <>
      {/* The combox boxes below have local styling applied to override the react-select styles; doing it in a CSS file failed */}
      <div className = 'danger-flags-container'>
        <DangerFlags updatedTree = {updatedTree}/>
      </div>
      <form style={formStyle}>
        <div className = 'columngroup'>
          <div className = 'column'>
            <div className = 'control'>
              <label>Species <br />name</label>
              <div className = 'controlgroup'>
                <div className = 'control'>
                  <label htmlFor='commonName'>Common</label>
                  <CreatableSelect
                    id='commonName'
                    value={{ label: updatedTree.commonName, value: updatedTree.commonName }}
                    onChange={(selectedOption) => handleInputChange('commonName', selectedOption)}
                    // onBlur={(event) => handleBlur('commonName', updatedTree.commonName, event)}
                    options={commonToScientificList ? Object.keys(commonToScientificList).map(common => ({
                      label: common,
                      value: common
                    })) : []}
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: '1px solid #888',
                        borderRadius: '0px',
                      })
                    }}
                  />
                </div>

                <div className = 'control'>
                  <label htmlFor='scientificName'>Scientific</label>
                  <CreatableSelect
                    id='scientificName'
                    value={{ label: updatedTree.scientificName, value: updatedTree.scientificName }}
                    onChange={(selectedOption) => handleInputChange('scientificName', selectedOption)}
                    // onBlur={(event) => handleBlur('scientificName', updatedTree.scientificName, event)}
                    options={commonToScientificList ? Object.entries(commonToScientificList)
                      .sort(([, a], [, b]) => a.localeCompare(b))
                      .map(([common, scientific]) => ({
                        label: scientific,
                        value: scientific
                      })) : []}
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: '1px solid #888',
                        borderRadius: '0px',
                      })
                    }}
                  />
                </div>
              </div>
            </div>

            <div className = 'control'>
              <label htmlFor = 'variety'>Variety</label>
              <input
                type = 'text' 
                className = 'standard'
                id = 'variety'
                value = {updatedTree.variety} 
                onChange = {(event) => handleInputChange('variety', event)}
              />
            </div>

            <div className = 'control'>
              <label htmlFor = 'dbh'>DBH</label>
              <Select 
                id = 'dbh' 
                value={{ label: updatedTree.dbh, value: updatedTree.dbh }}
                onChange = {event => handleInputChange('dbh', event)}
                options = {dbhList.map((dbh) => ({
                  label: dbh,
                  value: dbh
                }))}
                placeholder = ''
                styles={{
                  control: (base) => ({
                    ...base,
                    border: '1px solid #888',
                    borderRadius: '0px',
                  })
                }}              
              />
            </div>

            <div className='control'>
              <label htmlFor = 'garden'>Garden</label>
              <Select
                id = 'garden'
                value={{ label: updatedTree.garden, value: updatedTree.garden }}
                onChange = {(event) => handleInputChange('garden', event)}
                options = {gardenList.map((garden) => ({
                  label: garden,
                  value: garden
                }))}
                placeholder = ''
                styles={{
                  control: (base) => ({
                    ...base,
                    border: '1px solid #888',
                    borderRadius: '0px',
                  })
                }}
              />
            </div>

            <div className = 'control'>
              <label>Site data</label>
              <div className = 'column'>
                <div className = 'checkboxgroup'>
                  {siteInfoList.map((condition) => (
                    <label htmlFor = {condition} key = {condition}>
                      <input
                        id = {condition}
                        className = 'checkbox'
                        type = 'checkbox'
                        name = {condition}
                        checked = {updatedTree.siteInfo[condition] || false}
                        onChange = {(event) => handleInputChange(`siteInfo.${condition}`, event)}
                      />
                      {condition
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())
                      }
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className = 'column'>
            <div className = 'control'>
              <label htmlFor = 'installedDate'>Installed on</label>
              <input 
                className = 'standard'
                id = 'installedDate'
                type = 'text'
                onChange = {(event) => handleInputChange('installedDate', event)} 
                defaultValue = {formatDateForDisplay(updatedTree.installedDate)}
              />
            </div>

            <div className = 'control'>
              <label htmlFor = 'installedBy'>Installed by</label>
              <input
                className = 'standard'
                id = 'installedBy'
                type = 'text'
                defaultValue = {updatedTree.installedBy || ''} 
                onChange = {(event) => handleInputChange('installedBy', event)}
              />
            </div>

            <div className = 'control'>
              <label htmlFor = 'felledDate'>Felled on</label>
              <input 
                className = 'standard'
                id = 'felledDate'
                type = 'text'
                defaultValue = {formatDateForDisplay(updatedTree.felledDate)}
                onChange = {(event) => handleInputChange('felledDate', event)} 
              />
            </div>

            <div className = 'control'>
              <label htmlFor = 'felledBy'>Felled by</label>
              <input
                className = 'standard'
                id = 'felledBy'
                type = 'text'
                defaultValue = {updatedTree.felledBy || ''} 
                onChange = {(event) => handleInputChange('felledBy', event)}
              />
            </div>

            <div className = 'control'>
              <label>Care</label>
              <div className = 'column'>
                <div className = 'checkboxgroup'>
                  {careNeedsList.map((need) => (
                    <label htmlFor = {need} key = {need}>
                      <input
                        id = {need}
                        className = 'checkbox'
                        type = 'checkbox'
                        name = {need}
                        checked = {updatedTree.careNeeds[need] || false}
                        onChange = {(event) => handleInputChange(`careNeeds.${need}`, event)} 
                      />
                      {need
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())
                      }
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='control'>
          <label htmlFor='photos'>Photos</label>
          <PhotoUploadForm 
            updatedTree={updatedTree}
            onPhotoUpload={handlePhotoUpload}
          />
        </div>

        <div className = 'control'>
          <label htmlFor = 'notes'>Notes</label>
          <textarea
            id = 'notes'
            value = {updatedTree.notes}
            onChange = {(event) => handleInputChange('notes', event)}
          />
        </div>
        <Footer />
      </form>
    {overlayVisible && <Overlay setOverlayVisible={setOverlayVisible} />}
    </>
  );
};

export default TreeData;