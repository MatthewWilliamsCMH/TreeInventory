//---------imports----------
//external libraries
import React from 'react';
import { useOutletContext } from 'react-router-dom';

//components
import LoginModal from './LoginModal.jsx';

//stylesheets
import styles from './header.module.css';

const Header = () => {
  //get current global states using context
  // const { isLoggedIn, setIsLoggedIn } = useOutletContext();

  //----------called functions----------
  //handle click on the lock icon

  //render component
  return (
    <>
      <header
        id='header'
        className={styles.header}
      >
        <h1 className='fs-2'>
          <span className={styles.longTitle}>Summit Chase Tree Inventory</span>
          <span className={styles.shortTitle}>Tree Inventory</span>
        </h1>
        <img
          className={styles.login}
          src='../../../public/loggedout.svg'
          alt='Login'
        />
      </header>
    </>
  );
};

export default Header;
