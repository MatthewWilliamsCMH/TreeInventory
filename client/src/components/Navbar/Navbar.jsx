//---------imports----------
//external libraries
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

//components
import AppContext from '../../appContext';

//local helpers, constants, queries, and mutations
import { confirmDiscardChanges } from '../../utils/helpers.js';

//stylesheets
import styles from './navbar.module.css';

const Navbar = () => {
  //set up hooks
  const navigate = useNavigate();
  const location = useLocation();

  //get current global states from parent
  const { isLoggedIn, selectedTree, updatedTree } = useContext(AppContext);

  //set local states to initial values
  const [selectedOption, setSelectedOption] = useState(() => {
    switch (location.pathname) {
      case '/':
        return 'TreeMap';
      case '/TreeData':
        return 'TreeData';
      case '/TreeDetails':
        return 'TreeData'; //is TreeData so middle dot on navbar will be filled when app showing either TreeData (logged-in user) or TreeDetails
      case '/TreeInventory':
        return 'TreeInventory';
      default:
        return 'TreeMap';
    }
  });

  //----------called functions----------
  //handle control changes
  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;

    if (!confirmDiscardChanges(updatedTree, selectedTree)) return;

    setSelectedOption(selectedValue);
    switch (selectedValue) {
      case 'TreeMap':
        navigate('/');
        break;
      case 'TreeData':
        navigate('/TreeData');
        break;
      case 'TreeDetails':
        navigate('/TreeDetails');
        break;
      case 'TreeInventory':
        navigate('/TreeInventory');
        break;
      default:
        navigate('/');
        break;
    }
  };

  //----------useEffects----------
  //update selectedOption based on the current path
  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setSelectedOption('TreeMap');
        break;
      case '/TreeData':
        setSelectedOption('TreeData');
        break;
      case '/TreeDetails':
        setSelectedOption('TreeData'); //is TreeData so middle dot on navbar will be filled when app showing either TreeData (logged-in user) or TreeDetails
        break;
      case '/TreeInventory':
        setSelectedOption('TreeInventory');
        break;
      default:
        setSelectedOption('TreeMap');
        break;
    }
  }, [location.pathname]);

  //don't allow manual navigation to TreeData/TreeDetails if no tree is selected
  const isDisabled = selectedTree === null;

  //----------render component----------
  return (
    <nav className={styles.navbar}>
      <div className={styles.radiobuttonlist}>
        <label className={styles.radiooption}>
          <input
            type='radio'
            name='nav'
            value='TreeMap'
            checked={selectedOption === 'TreeMap'}
            onChange={handleRadioChange}
          />
          <span className={styles.tooltip}>Map</span>
        </label>
        <label className={styles.radiooption}>
          <input
            type='radio'
            name='nav'
            value='TreeData'
            checked={selectedOption === 'TreeData'}
            onChange={handleRadioChange}
            disabled={isDisabled}
          />
          <span className={styles.tooltip}>Physical data</span>
        </label>
        <label className={styles.radiooption}>
          <input
            type='radio'
            name='nav'
            value='TreeInventory'
            checked={selectedOption === 'TreeInventory'}
            onChange={handleRadioChange}
          />
          <span className='tooltip'>Inventory</span>
        </label>
      </div>
    </nav>
  );
};

export default Navbar;
