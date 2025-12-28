//----------Import----------
//external libraries
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';

//local components
import AppContext from '../../appContext';

//project-specific helpers
import { formatDateForDisplay, handleDateFocus, handlePhotoClick } from '../../utils/helpers.js';

//styles (load order is important)
import '../../custom-bootstrap.scss';
import styles from './treeDetails.module.css';

//----------Create Component----------
const TreeDetails = () => {
  //initialize React hooks (e.g., useRef, useNavigate, custom hooks)
  const commonNameRef = useRef(null);
  const navigate = useNavigate();

  //access global states from parent (using Context)
  const { formColor, selectedTree, setFormColor, setSelectedTree } = useContext(AppContext);

  //define local states and set initial values
  const [commonToScientific, setCommonToScientific] = useState(null);
  const [updatedSpeciesField, setUpdatedSpeciesField] = useState(null);

  let friendlyNonnative = 'No';
  let friendlyInvasive = 'No';

  if (selectedTree.nonnative === true) friendlyNonnative = 'Yes';
  if (selectedTree.invasive === true) friendlyInvasive = 'Yes';

  //useEffects
  useEffect(() => {
    //determine form background color based on invasive status
    setFormColor({ backgroundColor: selectedTree?.invasive ? '#FFDEDE' : 'white' });
  }, [selectedTree?.invasive]);

  //handlers and callback functions
  //handle Done button
  const handleCancel = () => {
    setSelectedTree(null);
    navigate('/');
  };

  //----------Render Component----------
  return (
    <>
      <Container
        // fluid
        className='pt-3 ps-5 card'
        style={formColor}
      >
        <legend className={styles.legend}>{selectedTree.commonName}</legend>
        <Row>
          <Col md={6}>
            <div className='d-flex align-items-center mt-1'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Scientific name:</b>
              </div>
              {/*cross reference species table using common name*/}
              <div
                className={`border border-black-subtle bg-white rounded text-nowrap text-truncate flex-grow-1 ${styles.value}`}
              >
                {selectedTree.scientificName}
              </div>
            </div>
            <div className='d-flex align-items-center mt-1'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Family:</b>
              </div>
              {/*cross reference species table using common name*/}
              <div
                className={`border border-black-subtle bg-white rounded text-nowrap text-truncate flex-grow-1 ${styles.value}`}
              >
                {selectedTree.family || 'Unknown'}
              </div>
            </div>
            <div className='d-flex align-items-center mt-1'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Variety:</b>
              </div>
              <div
                className={`border border-black-subtle bg-white rounded text-nowrap text-truncate flex-grow-1 ${styles.value}`}
              >
                {selectedTree.variety || 'Unknown'}
              </div>
            </div>
            <div className='d-flex align-items-center mt-1'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Diameter:</b>
              </div>
              <div
                className={`border border-black-subtle bg-white rounded text-nowrap text-truncate flex-grow-1 ${styles.value}`}
              >
                {selectedTree.dbh ? `${selectedTree.dbh} inches` : 'Unknown'}
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className='d-flex align-items-center mt-1'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Garden:</b>
              </div>
              <div
                className={`border border-black-subtle bg-white rounded text-nowrap text-truncate flex-grow-1 ${styles.value}`}
              >
                {selectedTree.garden}
              </div>
            </div>
            <div className='d-flex align-items-center mt-1'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Nonnative:</b>
                {/*cross reference species table using common name*/}
              </div>
              <div
                className={`border border-black-subtle bg-white rounded text-nowrap text-truncate flex-grow-1 ${styles.value}`}
              >
                {friendlyNonnative}
              </div>
            </div>
            <div className='d-flex align-items-center mt-1'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Invasive:</b>
                {/*cross reference species table using common name*/}
              </div>
              <div
                className={`border border-black-subtle bg-white rounded text-nowrap text-truncate flex-grow-1 ${styles.value}`}
              >
                {friendlyInvasive}
              </div>
            </div>
            <div className='d-flex align-items-center mt-1'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Last updated:</b>
              </div>
              <div
                className={`border border-black-subtle bg-white rounded text-nowrap text-truncate flex-grow-1 ${styles.value}`}
              >
                {new Date(parseInt(selectedTree.lastUpdated)).toLocaleDateString('en-US')}
              </div>
            </div>
          </Col>
        </Row>
        <Row className='mt-2 g-1'>
          {['bark', 'summerLeaf', 'autumnLeaf', 'fruit', 'flower', 'environs'].map((photoType) => {
            const src = selectedTree.photos?.[photoType];
            if (!src) return null; //skip empty photos

            return (
              <Col
                key={photoType}
                xs={6}
                sm={6}
                md={4}
                lg={3}
                style={{ color: '#BBB' }}
              >
                <Image
                  alt={photoType}
                  className='object-cover'
                  rounded
                  onClick={() => handlePhotoClick(src)}
                  src={src.url}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                  }}
                />
              </Col>
            );
          })}
        </Row>
        <Col className='d-flex gap-1 pt-1 pb-1 justify-content-end'>
          <Button
            className='pull-right'
            variant='primary'
            size='sm'
            type='button'
            onClick={handleCancel}
          >
            Done
          </Button>
        </Col>
      </Container>
    </>
  );
};

export default TreeDetails;
