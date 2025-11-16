//---------imports----------
//external libraries
import React from 'react';

//components
import LoginModal from './LoginModal.jsx';

//stylesheets
import styles from './header.module.css';

const Header = () => {
  //render component
  return (
    <>
      <LoginModal
      //set loggedin to false?
      //on submit, verify credentials
      //if verified, go to treedata
      //if not verified, warn user: Username not found
      //on cancel, return to map
      />

      {/*    <header
      id='header'
      className={styles.header}
    >
*/}
      <header
        id='header'
        className={styles.header}
      >
        <h1 className='fs-2'>
          <span className={styles.longTitle}>Summit Chase Tree Inventory</span>
          <span className={styles.shortTitle}>Tree Inventory</span>
        </h1>
      </header>
      {/*      </header> */}
    </>
  );
};

export default Header;
