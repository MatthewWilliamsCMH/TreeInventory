import React from 'react';
import TreeDetails from './TreeDetails';
import { Button, Col, Container, Row } from 'react-bootstrap';

import '../../custom-bootstrap.scss';
import styles from './treeDetails.module.css';

// --- Mock data ---
const mockTree = {
  scientificName: 'Acer saccharum',
  commonName: 'Sugar Maple',
  variety: 'Unknown',
  dbh: '3-6',
  garden: 'Woodland garden and west lawn',
  native: 'True',
  invasive: 'False',
  lastUpdated: Date.now(),
  photos: {
    bark: 'https://treeinventory.clickps.synology.me/uploads/1753824091030.jpg',
    summerLeaf: 'https://treeinventory.clickps.synology.me/uploads/1753824135140.jpg',
    autumnLeaf: '',
    fruit: '',
    flower: '',
    environs: 'https://treeinventory.clickps.synology.me/uploads/1753824099821.jpg',
  },
};

// --- Mocked version of TreeDetails that ignores router context ---
const TreeDetailsMock = () => {
  const selectedTree = mockTree;
  let friendlyNonnative = 'No';
  let friendlyInvasive = 'No';
  const photoTypes = ['bark', 'summerLeaf', 'autumnLeaf', 'fruit', 'flower', 'environs'];

  if (selectedTree.nonnative === true) friendlyNonnative = 'Yes';
  if (selectedTree.invasive === true) friendlyInvasive = 'Yes';

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
                  <div className={styles.label}>Scientific name:</div>
                  <div className={styles.value}>{selectedTree.scientificName}</div>
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
                  <div className={styles.label}>Nonnative:</div>
                  <div className={styles.value}>{friendlyNonnative}</div>
                </div>
                <div className={styles.detailsRow}>
                  <div className={styles.label}>Invasive:</div>
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
      </Container>
    </>
  );
};

export default {
  title: 'Components/TreeDetails',
  component: TreeDetailsMock,
};

export const Default = {
  render: () => <TreeDetailsMock />,
};
