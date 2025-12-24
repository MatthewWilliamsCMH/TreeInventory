//---------imports----------
//external libraries
import React from 'react';
import { Button } from 'react-bootstrap';

//stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PhotoModal = (photoUrl) => {
  //-----------data reception and transmission----------
  //set local states to initial values

  //----------useEffects----------
  //

  //----------called functions----------
  //

  //render component
  return (
    <div>
      <div
        class='btn-group'
        role='group'
        aria-label='Basic example'
      >
        <button
          type='button'
          class='btn btn-danger'
        >
          <i className='bi-trash3'></i>
        </button>
        <button
          type='button'
          class='btn btn-primary'
        >
          &#x2715; {/*unicode for heavy multiplication sign*/}
        </button>
      </div>
      <img
        src='https://treeinventory.clickps.synology.me/uploads/1753988466016.jpg'
        // src={photoUrl}
        alt='Full size view'
      />
    </div>
  );
};

export default PhotoModal;
