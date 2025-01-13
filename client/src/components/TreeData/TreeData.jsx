import React from 'react';
import { useOutletContext } from 'react-router-dom';

import Footer from '../Footer/Footer.jsx';
import DangerFlags from '../Header/DangerFlags.jsx';
import { handleFieldChange, commonToScientificList, dbhList, gardenList, siteInfoList, careNeedsList } from '../../utils/fieldChangeHandler.jsx';
import { formatDateForDisplay } from '../../utils/dateHandler.jsx';

import PhotoUploadForm from './PhotoUploadForm.jsx'

const TreeData = () => {
  const { updatedTree, setUpdatedTree, treeLocation, setTreeLocation, formStyle } = useOutletContext();
 
  //-------------------- handle field changes --------------------//
  const handleInputChange = (field, event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value; //handle checkboxes differently; they don't return a value
    setUpdatedTree(prevValues => handleFieldChange(prevValues, field, value));
  };

   const handlePhotoUpload = (url, photoType) => {
    setUpdatedTree(prevValues => ({
      ...prevValues,
      photos: {
        ...prevValues.photos,
        [photoType]: url
      }
    }));
  };

  //-------------------- render component--------------------//
  return (
    <>
      <div className = 'danger-flags-container'>
        <DangerFlags updatedTree = {updatedTree}/>
      </div>
      <form style={formStyle}>
        <div className = 'columns'>
          <div className = 'column'>
            <div className = 'controlgroup'>
              <label>Species name</label>
              <div className = 'control'>
                <label htmlFor = 'commonName'>Common</label>
                <select
                  id = 'commonName'
                  value = {updatedTree.commonName}
                  onChange = {(event) => handleInputChange('commonName', event)}
                >
                  {Object.keys(commonToScientificList).map((common) => (
                    <option key={common} value={common}>
                      {common}
                    </option>
                  ))}
                </select>
              </div>

              <div className = 'control'>
                <label htmlFor = 'scientificName'>Scientific</label>
                <select
                  id = 'scientificName'
                  placeholder = 'Select a scientific name.'
                  value = {updatedTree.scientificName}
                  onChange = {(event) => handleInputChange('scientificName', event)}
                >
                {Object.entries(commonToScientificList)
                  .sort(([, a], [, b]) => a.localeCompare(b))
                  .map(([common, scientific]) => (
                    <option key={scientific} value={scientific}>
                      {scientific}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className = 'control'>
              <label htmlFor = 'variety'>Variety</label>
              <input
                id = 'variety'
                type = 'text' 
                value = {updatedTree.variety} 
                onChange = {(event) => handleInputChange('variety', event)}
              />
            </div>

            <div className = 'control'>
              <label htmlFor = 'dbh'>DBH</label>
              <select 
                id = 'dbh' 
                placeholder = 'Select a diameter.'
                value = {updatedTree.dbh} 
                onChange = {event => handleInputChange('dbh', event)} 
              >
                {dbhList.map((dbh, index) => (
                  <option key = {index} value = {dbh}>
                    {dbh}
                  </option>
                ))}
              </select>
            </div>

            <div className='control'>
              <label htmlFor = 'garden'>Garden</label>
              <select
                id = 'garden'
                value = {updatedTree.garden}
                onChange = {(event) => handleInputChange('garden', event)}
              >
                {gardenList.map((garden, index) => (
                  <option key = {index} value = {garden}>
                    {garden}
                  </option>
                ))}
              </select>
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
                id = 'installedDate'
                type = 'text'
                onChange = {(event) => handleInputChange('installedDate', event)} 
                defaultValue = {formatDateForDisplay(updatedTree.installedDate)}
              />
            </div>

            <div className = 'control'>
              <label htmlFor = 'installedBy'>Installed by</label>
              <input
                id = 'installedBy'
                type = 'text'
                defaultValue = {updatedTree.installedBy || ''} 
                onChange = {(event) => handleInputChange('installedBy', event)}
              />
            </div>

            <div className = 'control'>
              <label htmlFor = 'felledDate'>Felled on</label>
              <input 
                id = 'felledDate'
                type = 'text'
                defaultValue = {formatDateForDisplay(updatedTree.felledDate)}
                onChange = {(event) => handleInputChange('felledDate', event)} 
              />
            </div>

            <div className = 'control'>
              <label htmlFor = 'felledBy'>Felled by</label>
              <input
                id = 'felledBy'
                type = 'text'
                defaultValue = {updatedTree.felledBy || ''} 
                onChange = {(event) => handleInputChange('felledBy', event)}
              />
            </div>

            <div className = 'control'>
              <label>Care needs</label>
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
    </>
  );
};

export default TreeData;