//----------Import----------
//external libraries
import React, { useContext, useState } from 'react';

//local components
import AppContext from '../../appContext';
import DangerFlags from './DangerFlags.jsx';
import LoginModal from './LoginModal.jsx';

//styles (load order is important)
import styles from './header.module.css';

//----------Create Component----------
const Header = () => {
  //access global states from parent (using Context)
  const { isLoggedIn, setIsLoggedIn, selectedTree } = useContext(AppContext);

  //define local states and set initial values
  const [showLoginModal, setShowLoginModal] = useState(false);

  //handlers and callback functions
  //handle click on the lock icon
  const handleLoginClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      localStorage.removeItem('treeInventoryUserToken');
    } else {
      setShowLoginModal(true);
    }
  };
  const showDangerFlags = selectedTree?.nonnative || selectedTree?.invasive;

  //----------Render Component----------
  return (
    <>
      <LoginModal
        onClose={() => setShowLoginModal(false)}
        show={showLoginModal}
      />
      <header className={styles.header}>
        <h1 className='fs-2'>
          <span className={styles.longTitle}>Summit Chase Tree Inventory</span>
          <span className={styles.shortTitle}>Tree Inventory</span>
        </h1>

        <div className={styles.flushRightContainer}>
          {showDangerFlags && <DangerFlags selectedTree={selectedTree} />}
          <img
            className={styles.login}
            src={`/${isLoggedIn ? 'loggedin.svg' : 'loggedout.svg'}`}
            alt='Login'
            onClick={handleLoginClick}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
