//---------imports----------
//external libraries
import React, { useEffect, useState } from 'react';

//stylesheets
import styles from './dangerFlags.module.css';

const DangerFlags = ({ selectedTree }) => {
  //establish nonnative and invasive status
  const [nonnativeStatus, setNonnativeStatus] = useState(false);
  const [invasiveStatus, setInvasiveStatus] = useState(false);

  //----------useEffects----------
  //get nonnative and invasvie statuses from selectedTree
  useEffect(() => {
    if (selectedTree) {
      setNonnativeStatus(selectedTree.nonnative || false);
      setInvasiveStatus(selectedTree.invasive || false);
    }
  }, [selectedTree]);

  //----------render component----------
  return (
    <div className={styles.dangerFlagsContainer}>
      {nonnativeStatus && <p>Nonnative</p>}
      {invasiveStatus && <p>Invasive</p>}
    </div>
  );
};

export default DangerFlags;
