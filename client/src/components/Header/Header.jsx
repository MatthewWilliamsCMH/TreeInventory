//---------imports----------
//external libraries
import React, { useContext } from 'react';

//components
import AppContext from '../../AppContext';
import DangerFlags from './DangerFlags.jsx';
import LoginModal from './LoginModal.jsx';

//stylesheets
import styles from './header.module.css';

//get current global states using context
const Header = () => {
  const { isLoggedIn, updatedTree } = useContext(AppContext);

  //----------called functions----------
  //handle click on the lock icon
  const handleLogin = () => {
    //if user is not logged in, open modal
    //else, log them out
    //ternary example '{updatedTree.dbh ? `${updatedTree.dbh} inches` : 'Unknown'}
  };
  // const showDangerFlags = updatedTree && (updatedTree.nonnative || updatedTree.invasive);
  const showDangerFlags = updatedTree?.nonnative || updatedTree?.invasive;

  //render component
  return (
    <header className={styles.header}>
      <h1 className='fs-2'>
        <span className={styles.longTitle}>Summit Chase Tree Inventory</span>
        <span className={styles.shortTitle}>Tree Inventory</span>
      </h1>

      <div className={styles.flushRightContainer}>
        {showDangerFlags && <DangerFlags updatedTree={updatedTree} />}
        <img
          className={styles.login}
          src={`/${isLoggedIn ? 'loggedin.svg' : 'loggedout.svg'}`}
          alt='Login'
          onClick={handleLogin}
        />
      </div>
    </header>
  );
};

export default Header;
