//---------imports----------
//external libraries
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';

//local helpers, constants, queries, and mutations
import { formatDateForDisplay, handleDateFocus } from '../../utils/helpers.js';

//stylesheets
import '../../custom-bootstrap.scss';
import styles from './treeDetails.module.css';

const TreeDetails = () => {
  //-----------data reception and transmission----------
  //get current global states from parent
  const { formColor, selectedTree, setFormColor, setSelectedTree } = useOutletContext();

  //set local states to initial values
  const [commonToScientific, setCommonToScientific] = useState(null);
  const [updatedSpeciesField, setUpdatedSpeciesField] = useState(null);

  const commonNameRef = useRef(null);

  //set local variables to initial values
  let friendlyNonnative = 'No';
  let friendlyInvasive = 'No';

  if (selectedTree.nonnative === true) friendlyNonnative = 'Yes';
  if (selectedTree.invasive === true) friendlyInvasive = 'Yes';

  //initialize hooks
  const navigate = useNavigate();

  //----------useEffects----------
  useEffect(() => {
    setFormColor({ backgroundColor: selectedTree?.invasive ? '#FFDEDE' : 'white' });
  }, [selectedTree?.invasive]);

  //----------called functions----------
  //handle done button
  const handleCancel = () => {
    setSelectedTree(null);
    navigate('/');
  };

  //----------render component----------
  return (
    <>
      <Container
        fluid
        className='pt-3 ps-5 card'
        style={formColor}
      >
        <legend className={styles.legend}>{selectedTree.commonName}</legend>
        <Row className='gx-2'>
          <Col md={6}>
            <div className='d-flex align-items-left'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Scientific name:</b>
              </div>
              {/*cross reference species table using common name*/}
              <div className='border border-black rounded p-1 text-nowrap text-truncate flex-grow-1'>
                {selectedTree.scientificName}
              </div>
            </div>
            <div className='d-flex align-items-left'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Family:</b>
              </div>
              {/*cross reference species table using common name*/}
              <div className='border border-black rounded p-1 text-nowrap text-truncate flex-grow-1'>
                {selectedTree.family || 'Unknown'}
              </div>
            </div>

            <div className='d-flex align-items-left'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Variety:</b>
              </div>
              {/*cross reference species table using common name*/}
              <div className='border border-black rounded p-1 text-nowrap text-truncate flex-grow-1'>
                {selectedTree.variety || 'Unknown'}
              </div>
            </div>
            <div className='d-flex align-items-left'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Diameter:</b>
              </div>
              <div className='border border-black rounded p-1 text-nowrap text-truncate flex-grow-1'>
                {selectedTree.dbh ? `${selectedTree.dbh} inches` : 'Unknown'}
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className='d-flex align-items-left'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Garden:</b>
              </div>
              <div className='border border-black rounded p-1 text-nowrap text-truncate flex-grow-1'>
                {selectedTree.garden}
              </div>
            </div>
            <div className='d-flex align-items-left'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Nonnative:</b>
                {/*cross reference species table using common name*/}
              </div>
              <div className='border border-black rounded p-1 text-nowrap text-truncate flex-grow-1'>
                {friendlyNonnative}
              </div>
            </div>
            <div className='d-flex align-items-left'>
              <div className={`text-nowrap ${styles.label}`}>
                <b>Invasive:</b>
                {/*cross reference species table using common name*/}
              </div>
              <div className='border border-black rounded p-1 text-nowrap text-truncate flex-grow-1'>
                {friendlyInvasive}
              </div>
            </div>
          </Col>
        </Row>
        <Row className='mt-2 g-1'>
          {['bark', 'summerLeaf', 'autumnLeaf', 'fruit', 'flower', 'environs'].map((photoType) => {
            const src = selectedTree.photos?.[photoType];
            if (!src) return null; // skip empty photos
            return (
              <Col
                xs={6}
                sm={6}
                md={4}
                lg={2}
                style={{ color: '#BBB' }}
                // key={photoType}
              >
                <Image
                  alt={photoType}
                  className='object-cover'
                  rounded
                  src={selectedTree.photos[photoType]}
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
        <Row className='mt-2'>
          <p>
            Last updated: {new Date(parseInt(selectedTree.lastUpdated)).toLocaleDateString('en-US')}
          </p>
        </Row>
        <Button
          variant='primary'
          size='sm'
          type='button'
          onClick={handleCancel}
        >
          Done
        </Button>
      </Container>
    </>
  );
};

export default TreeDetails;
