//---------imports----------
//external libraries
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

//stylesheets
import './Navbar.css';

const Navbar = ({ selectedTree }) => {
  //set up hooks
  const navigate = useNavigate();
  const location = useLocation();

  //set local states to initial values
  const [selectedOption, setSelectedOption] = useState(() => {
    switch (location.pathname) {
      case '/': return 'map';
      case '/TreeData': return 'TreeData';
      case '/inventory': return 'inventory';
      default: return 'map';
    }
  });

  //----------called functions----------
  //handle control changes
  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    if ((selectedValue === 'map' && 'location.pathname' !== '/') ||
      (selectedValue === 'TreeData' && 'location.pathname' !== '/TreeData') ||
      (selectedValue === 'inventory' && 'location.pathname' !== '/inventory')) {
      switch (selectedValue) {
        case 'map':
          navigate('/');
          break;
        case 'TreeData':
          navigate('/TreeData');
          break;
        case 'inventory':
          navigate('/inventory');
          break;
        default:
          navigate('/');
          break;
      }
    }
  };

  //----------useEffects----------
  //update selectedOption based on the current path
  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setSelectedOption('map');
        break;
      case '/TreeData':
        setSelectedOption('TreeData');
        break;
      case '/inventory':
        setSelectedOption('inventory');
        break;
      default:
        setSelectedOption('map');
        break;
    }
  }, [location.pathname]);

  //disable TreeData option if no tree is selected
  const isDisabled = selectedTree === null;

  //----------render component----------
  return (
    <nav id='navbar'>
      <div className='radiobuttonlist'>
        <label className='radiooption'>
          <input
            type='radio'
            name='nav'
            value='map'
            checked={selectedOption === 'map'}
            onChange={handleRadioChange}
          />
          <span className='tooltip'>Map</span>
        </label>
        <label className='radiooption'>
          <input
            type='radio'
            name='nav'
            value='TreeData'
            checked={selectedOption === 'TreeData'}
            onChange={handleRadioChange}
            disabled={isDisabled}
          />
          <span className='tooltip'>Physical data</span>
        </label>
        <label className='radiooption'>
          <input
            type='radio'
            name='nav'
            value='inventory'
            checked={selectedOption === 'inventory'}
            onChange={handleRadioChange}
          />
          <span className='tooltip'>Inventory</span>
        </label>
      </div>
    </nav>
  );
};

export default Navbar;