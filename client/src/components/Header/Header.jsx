//---------imports----------
//external libraries
import React from 'react';

//stylesheets
import styles from './header.module.css';

const Header = () => {
  //render component
  return (
    <header id='header' className={styles.header} >
      <h1>Summit Chase Tree Inventory</h1>
    </header>
  );
}

export default Header;
