// --------- imports ----------
//external libraries
import React, { useState } from 'react';
import { Col, Container, Form, Row, Stack } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useOutletContext } from 'react-router-dom';
import Select, { components } from 'react-select';
import Toggle from 'react-toggle'

//local helpers, constants, queries, and mutations
import { careNeedsList, dbhList, gardenList, siteInfoList } from '../../utils/constants.js';

//stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './treeMap.module.css';
import './react-toggle.css'

const FilterDrawer = ({filteredTrees}) => {
  // --------- initialize hooks ----------
  //get global states from parent component
  const {
    filterOpen, setFilterOpen,
    filterCriteria, setFilterCriteria,
    mergedTrees,
    allSpecies
  } = useOutletContext();

  const CustomValueContainer = ({ children, ...props }) => {
    const selectedOptions = props.getValue();
    //one selection
    if (selectedOptions.length === 1) {
      return (
        <components.ValueContainer {...props}>
        {selectedOptions[0].label}
        </components.ValueContainer>
      )
    }

    //more than one selection
    if (selectedOptions.length > 1) {
      return (
        <components.ValueContainer {...props}>
          Multiple selections
        </components.ValueContainer>
      );
    }

    //no selections
    return <components.ValueContainer {...props}>{children}</components.ValueContainer>;
  }

const columnCount = 2;

const siteInfoColumns = Array.from({ length: columnCount }, (_, colIndex) =>
  siteInfoList.filter((_, i) => i % columnCount === colIndex)
);

  //----------called functions----------
  //typeaheads
  const handleTypeaheadChange = (selectedOptions, fieldName) => {
    const selectedValues = selectedOptions.map(option => option.value);

    // Optionally handle 'All' case
    if (selectedValues.includes('All')) {
      setFilterCriteria(prev => ({
        ...prev,
        [fieldName]: [] //treat as "no filter"
      }));
    } else {
      setFilterCriteria(prev => ({
        ...prev,
        [fieldName]: selectedValues
      }));
    }
  };

  const handleFilterChange = (event, category = null) => {
    const { name, type, value, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFilterCriteria(prev => {
      if (category) {
        return {
          ...prev,
          [category]: {
            ...(prev[category] || {}),
            [name]: newValue
          }
        };
      } else {
        return {
          ...prev,
          [name]: newValue
        };
      }
    });
  };
  
  //----------render component----------
  {/*I locally styled this because I couldn't override the default styles of react-bootstrap*/}
  return (
    <Offcanvas
      backdrop = {false}
      id = 'filter-drawer'
      onHide = {() => {setFilterOpen(false)}}
      placement = 'end'
      scroll = {true}
      show = {filterOpen}
      style = {{ 
        backgroundColor: 'var(--brick-red)', 
        borderBottom: '2px solid white',
        borderLeft: '2px solid white',
        borderRadius: '10px 0px 0px 10px',
        borderTop: '2px solid white',
        boxShadow: '10px 10px 10px rgba(0, 0, 0, 1)',
        color: 'white', 
        marginBottom: '4.5rem',
        marginTop: '4.5rem',
        padding: '10px',
        width: '300px'
      }}
    >
      <Offcanvas.Title className = 'ms-3 mb-3'>Filter</Offcanvas.Title>
      <Offcanvas.Body>
        <Row>
          <Select 
            closeMenuOnSelect={false}
            components = {{
              ValueContainer: CustomValueContainer
            }}
            hideSelectedOptions={false}
            isMulti
            onChange={(selectedOptions) => handleTypeaheadChange(selectedOptions, 'commonName')}
            options={[
              ...[...allSpecies] //This creates a shallow copy of the array, which will be mutable where the origianl is not; similar to just writing the original array into another, new array, but idiomatic to ES6 and slightly faster.
              .sort((a, b) => a.commonName.localeCompare(b.commonName))
              .map(species => ({
                label: species.commonName,
                value: species.commonName
              }))
            ]}
            placeholder="All common names"
            styles={{
              menu: base => ({
                ...base,
                backgroundColor: 'white',
                color: 'black'
              }),
              control: base => ({
                ...base,
                backgroundColor: 'white',
                borderColor: '#ccc',
                color: 'black'
              }),
              option: (base, {isSelected}) => ({
                ...base,
                backgroundColor: isSelected ? '#cce5ff' : 'white',
                color: 'black'
              }),
              multiValueLabel: base => ({
                ...base,
                color: 'black'
              }),
              multiValue: () => ({}), //hides tokens
              multiValueLabel: () => ({}),
              multiValueRemove: () => ({})
            }}
          />
          <Select 
            className = 'mt-1'
            closeMenuOnSelect={false}
            components = {{
              ValueContainer: CustomValueContainer
            }}
            hideSelectedOptions={false}
            isMulti
                        onChange={(selectedOptions) => handleTypeaheadChange(selectedOptions, 'dbh')}
            options={[
              ...dbhList.map(dbh => ({
                label: dbh,
                value: dbh
              }))
            ]}
            placeholder="All diameters"
            styles={{
              menu: base => ({
                ...base,
                backgroundColor: 'white',
                color: 'black'
              }),
              control: base => ({
                ...base,
                backgroundColor: 'white',
                borderColor: '#ccc',
                color: 'black'
              }),
              option: (base, {isSelected}) => ({
                ...base,
                backgroundColor: isSelected ? '#cce5ff' : 'white',
                color: 'black'
              }),
              multiValueLabel: base => ({
                ...base,
                color: 'black'
              }),
              multiValue: () => ({}), //hides tokens
              multiValueLabel: () => ({}),
              multiValueRemove: () => ({})
            }}
          />
          <Select 
            className = 'mt-1'
            closeMenuOnSelect={false}
            components = {{
              ValueContainer: CustomValueContainer
            }}
            hideSelectedOptions={false}
            isMulti
            onChange={(selectedOptions) => handleTypeaheadChange(selectedOptions, 'garden')}
            options={[
              ...gardenList.map(garden => ({
                label: garden,
                value: garden
              }))
            ]}
            placeholder="All gardens"
            styles={{
              menu: base => ({
                ...base,
                backgroundColor: 'white',
                color: 'black'
              }),
              control: base => ({
                ...base,
                backgroundColor: 'white',
                borderColor: '#ccc',
                color: 'black'
              }),
              option: (base, {isSelected}) => ({
                ...base,
                backgroundColor: isSelected ? '#cce5ff' : 'white',
                color: 'black'
              }),
              multiValueLabel: base => ({
                ...base,
                color: 'black'
              }),
              multiValue: () => ({}), //hides tokens
              multiValueLabel: () => ({}),
              multiValueRemove: () => ({})
            }}
          />
        </Row>
        <Row className = 'mt-3'>
          <legend className = 'text-white h5'>Care Needs</legend>
          {careNeedsList.map((need) => (
            <label key = {need}>
              <Toggle
                checked = {!!filterCriteria.careNeeds?.[need]}
                icons = {false}
                onChange={(event) => handleFilterChange({
                  target: {
                    name: need,
                    type: 'checkbox',
                    checked: event.target.checked
                  }
                }, 'careNeeds')}
              />
              <span className = 'filterToggle'>{need
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())}
              </span>
            </label>
            ))}
        </Row>
        <Row className = 'mt-3'>
          <legend className = 'text-white h5'>Site Info</legend>
          {siteInfoList.map((condition) => (
            <label key = {condition}>
              <Toggle
                checked = {!!filterCriteria.siteInfo?.[condition]}
                icons = {false}
                onChange = {(event) => handleFilterChange({
                  target: {
                    name: condition,
                    type: 'checkbox',
                    checked: event.target.checked
                  }
                }, 'siteInfo')}
              />
              <span className = 'filterToggle'>{condition
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())}
              </span>
            </label>
          ))}
        </Row>
        <Row className = 'mt-3'>
          <label key = 'nonnative'>
            <Toggle
              checked = {!!filterCriteria.nonnative}
              icons = {false}
              onChange  = {(event) => {handleFilterChange({
                target: {
                  name: 'nonnative',
                  type: 'checkbox',
                  checked: event.target.checked
                }
              })}}
            />
            <span className = 'filterToggle'>Nonnative</span>
          </label>

          <label key = 'invasive'>
            <Toggle
              checked = {!!filterCriteria.invasive}
              icons = {false}
              onChange  = {(event) => {handleFilterChange({
                target: {
                  name: 'invasive',
                  type: 'checkbox',
                  checked: event.target.checked
                }
              })}}
            />
            <span className = 'filterToggle'>Invasive</span>
          </label>

          <label key = 'hidden'>
            <Toggle
              checked = {!!filterCriteria.hidden}
              icons = {false}
              onChange  = {(event) => {handleFilterChange({
                target: {
                  name: 'hidden',
                  type: 'checkbox',
                  checked: event.target.checked
                }
              })}}
            />
            <span className = 'filterToggle'>Hidden</span>
          </label>
        </Row>
              <div 
        style={{
          position: 'absolute',
          top: '15px',
          right: '10px',
          color: 'var(--pale-yellow)',
          fontSize: '15px'
        }}>
          {filteredTrees.length} trees
      </div>

      </Offcanvas.Body>
    </Offcanvas>
  )
};

export default FilterDrawer;