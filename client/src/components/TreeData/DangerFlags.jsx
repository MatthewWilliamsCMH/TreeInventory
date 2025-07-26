//---------imports----------
//external libraries
import React, { useEffect, useState } from 'react';

//stylesheets
import styles from './treeData.module.css';

const DangerFlags = ({ updatedTree }) => {
  //establish nonnative and invasive status
  const [nonnativeStatus, setNonnativeStatus] = useState(false);
  const [invasiveStatus, setInvasiveStatus] = useState(false);

  //----------useEffects----------
  //get nonnative and invasvie statuses from updatedTree
  useEffect(() => {
    if (updatedTree) {
      setNonnativeStatus(updatedTree.nonnative || false);
      setInvasiveStatus(updatedTree.invasive || false);
    }
  }, [updatedTree]);

  //----------render component----------
  return (
    <div
      id='danger-flags-container'
      className={styles.dangerFlagsContainer}
    >
      {nonnativeStatus && <p className='danger'>Nonnative</p>}
      {invasiveStatus && <p className='danger'>Invasive</p>}
    </div>
  );
};

export default DangerFlags;
