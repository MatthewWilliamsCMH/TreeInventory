//---------imports----------
//external libraries
import React, {useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import OffCanvas from 'react-bootstrap/Offcanvas';

//functions and constants

//queries
import { GET_FILTERED } from '../../queries/get_filtered.js';

//stylesheets
import './filter.css';

const filter = ({ setfilterVisible }) => {
  //----------data reception and transmission----------
  //set up queries
  const { loading: getFiltered Loading, error: getFilteredError, data: getFilteredData } = useQuery(GET_FILTERED, {//filter parameters here
  });

  //get current global states using context

  //set local states to initial values
  const [, ] = useState();

  //----------useEffects----------
  useEffect(() => {
  //disable interaction with the background when modal is open
    const body = document.body;
    body.style.overflow = 'hidden'; //prevent scrolling on the background
    body.style.pointerEvents = 'none'; //prevent pointer events on the background

    const filter = document.getElementById('filter'); //make sure filter is active
    if (filter) {
      filter.style.pointerEvents = 'auto'; //allow pointer events on the modal
    }

    //cleanup; restore normal pointer events and scrolling behavior to background
    return () => {
      body.style.pointerEvents = 'auto';
      body.style.overflow = 'auto';
    };
  }, []);
  
  //----------called functions----------
  //handle control changes
  const handleInputChange = (field, value) => {
    //the trees that don't meet the filter criteria will be removed from the map
    //as new criteria are added, more trees will be removed from the map
  };

  //handle cancel
  const handleCancel = () => {
    //This trigger should happen when the user clicks outside of the filter or clicks a second time on the filter icon; there is no "Cancel" button
    setfilterVisible(false);
  };

  //----------rendering----------
  return (
    <div className='filter' id='filter'> {/*the whole screen is the filter*/}
      <div className='dialog'> {/*the dialog is only the dialog box*/}
        {/* The combox boxes below have local styling applied to override the react-select styles; doing it in a CSS file failed */}
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
            options={commonToScientificList ? Object.entries(commonToScientificList)
              .sort(([, a], [, b]) => a.localeCompare(b))
              .map(([common, scientific]) => ({
                label: scientific,
                value: scientific
              })) : []
            }
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
          <label>Site Info</label>
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
  );
};

export default filter;