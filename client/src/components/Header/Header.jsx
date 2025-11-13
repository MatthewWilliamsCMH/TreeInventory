//---------imports----------
//external libraries
import React from 'react';

//stylesheets
import styles from './header.module.css';

const Header = () => {
  //render component
  return (
    <header
      id='header'
      className={styles.header}
    >
      <header
        id='header'
        className={styles.header}
      >
        <h1 className='fs-2'>
          <span className={styles.longTitle}>Summit Chase Tree Inventory</span>
          <span className={styles.shortTitle}>Tree Inventory</span>
        </h1>
      </header>
    </header>
  );
};

export default Header;
