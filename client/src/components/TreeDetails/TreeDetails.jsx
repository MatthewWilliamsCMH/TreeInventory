//---------imports----------
//external libraries
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';

//local helpers, constants, queries, and mutations
import { formatDateForDisplay, handleDateFocus } from '../../utils/helpers.js';

//stylesheets
import '../../custom-bootstrap.scss';
import styles from './treeDetails.module.css';

const TreeDetails = () => {
  //-----------data reception and transmission----------
  //get current global states from parent
  const { selectedTree } = useOutletContext();

  //set local states to initial values
  const [commonToScientific, setCommonToScientific] = useState(null);
  const [updatedSpeciesField, setUpdatedSpeciesField] = useState(null);

  const commonNameRef = useRef(null);

  //set local variables to initial values
  let friendlyNonnative = 'No';
  let friendlyInvasive = 'No';
  const photoTypes = ['bark', 'summerLeaf', 'autumnLeaf', 'fruit', 'flower', 'environs'];

  if (selectedTree.nonnative === true) friendlyNonnative = 'Yes';
  if (selectedTree.invasive === true) friendlyInvasive = 'Yes';

  //initialize hooks
  const navigate = useNavigate();

  //----------called functions----------
  //handle done button
  const handleCancel = () => {
    setSelectedTree(null);
    navigate('/');
  };

  //----------render component----------
  //       <div>
  //         {/*for each photo whose value is not "" or null, display in 1 x 1 box. the boxes can be clicked to open a larger version.*/}
  //       </div>
  //       <div>
  //         {/*this shoudld be at the bottom of the form*/}
  //         <p>
  //           {' '}
  //           Last updated: {new Date(parseInt(selectedTree.lastUpdated)).toLocaleDateString(
  //             'en-US'
  //           )}{' '}
  //         </p>
  //       </div>
  //       <Button
  //         variant='primary'
  //         size='sm'
  //         type='button'
  //         onClick={handleCancel}
  //       >
  //         Done
  //       </Button>
  //     </>
  //   );
  // };
  return (
    <>
      <Container
        fluid
        className='pt-3 ps-5 card'
      >
        <legend>{selectedTree.commonName}</legend>
        <Row className='gx-2'>
          <Col
            xs={12}
            className={styles.detailsColumn}
          >
            <div className={styles.detailsGrid}>
              <div className={styles.detailsBlock}>
                <div className={styles.detailsRow}>
                  <div className={styles.label}>Scientific name:</div>{' '}
                  {/*cross reference species table using common name*/}
                  <div className={styles.value}>{selectedTree.scientificName}</div>
                </div>
                <div className={styles.detailsRow}>
                  <div className={styles.label}>Family:</div>
                  {/*cross reference species table using common name*/}
                  <div className={styles.value}>{selectedTree.family || 'Unknown'}</div>
                </div>

                <div className={styles.detailsRow}>
                  <div className={styles.label}>Variety:</div>
                  <div className={styles.value}>{selectedTree.variety || 'Unknown'}</div>
                </div>
                <div className={styles.detailsRow}>
                  <div className={styles.label}>Diameter:</div>
                  <div className={styles.value}>
                    {selectedTree.dbh ? `${selectedTree.dbh} inches` : 'Unknown'}
                  </div>
                </div>
              </div>

              <div className={styles.detailsBlock}>
                <div className={styles.detailsRow}>
                  <div className={styles.label}>Garden:</div>
                  <div className={styles.value}>{selectedTree.garden}</div>
                </div>
                <div className={styles.detailsRow}>
                  <div className={styles.label}>Nonnative:</div>{' '}
                  {/*cross reference species table using common name*/}
                  <div className={styles.value}>{friendlyNonnative}</div>
                </div>
                <div className={styles.detailsRow}>
                  <div className={styles.label}>Invasive:</div>{' '}
                  {/*cross reference species table using common name*/}
                  <div className={styles.value}>{friendlyInvasive}</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className='mt-3 g-2'>
          {photoTypes.map((type) => {
            const src = selectedTree.photos[type];
            if (!src) return null;
            return (
              <Col
                key={type}
                xs={6}
                lg={4}
                className={styles.photoItem}
              >
                <img
                  src={src}
                  alt={type}
                />
              </Col>
            );
          })}
        </Row>
        <div>
          <p>
            {' '}
            Last updated: {new Date(parseInt(selectedTree.lastUpdated)).toLocaleDateString(
              'en-US'
            )}{' '}
          </p>
        </div>
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
