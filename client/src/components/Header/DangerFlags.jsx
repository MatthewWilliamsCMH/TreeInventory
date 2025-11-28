//---------imports----------
//external libraries
import React, { useEffect, useState } from 'react';

//stylesheets
import styles from './dangerFlags.module.css';

const DangerFlags = ({ workingTree }) => {
  //establish nonnative and invasive status
  const [nonnativeStatus, setNonnativeStatus] = useState(false);
  const [invasiveStatus, setInvasiveStatus] = useState(false);

  //----------useEffects----------
  //get nonnative and invasvie statuses from workingTree
  useEffect(() => {
    if (workingTree) {
      setNonnativeStatus(workingTree.nonnative || false);
      setInvasiveStatus(workingTree.invasive || false);
    }
  }, [workingTree]);

  //----------render component----------
  return (
    <div className={styles.dangerFlagsContainer}>
      {nonnativeStatus && <p>Nonnative</p>}
      {invasiveStatus && <p>Invasive</p>}
    </div>
  );
};

export default DangerFlags;
