import React, { useEffect, useState } from 'react';
import './Header.css';

function DangerFlags({ updatedTree }) {
  //track nonnative and invasive status
  const [nonnativeStatus, setNonnativeStatus] = useState(false);
  const [invasiveStatus, setInvasiveStatus] = useState(false);

  useEffect(() => {
    if (updatedTree) {
      setNonnativeStatus(updatedTree.nonnative || false);
      setInvasiveStatus(updatedTree.invasive || false);
    }
  }, [updatedTree]);

  return (
    <div id='reactcontainer'>
        {nonnativeStatus && <p className='danger'>Nonnative</p>}
        {invasiveStatus && <p className='danger'>Invasive</p>}
    </div>
  );
}

export default DangerFlags;
