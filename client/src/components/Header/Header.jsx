//---------imports----------
//external libraries
import React from 'react';

//stylesheets
import styles from './header.module.css';

const Header = () => {
  //render component
  return (
    <header id='header' className={styles.header} >
      <h1 className = 'fs-5 fs-sm-4 fs-md-3 fs-lg-2 fs-xl-1'>Summit Chase Tree Inventory</h1>
    </header>
  );
}

export default Header;
