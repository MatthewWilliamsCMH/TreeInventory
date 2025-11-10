//---------imports----------
//external libraries
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

//stylesheets

//functions and constants

const LoginModal = () => {
  //----------data reception and transmission----------
  //get current global states using context

  //set local states to initial values
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  //set local references to initial values

  //----------useEffects----------

  //----------called functions----------
  //handle OK button
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userLoginName.trim() || !userPassword.trim()) {
      alert('Username and password are required to log in.');
      return;
    }

    //check username and password in mongoDB, users collection
    //if verified
    //set userLoggedIn to true
    //(at a future date, allow new users, so hash passwords here)
    //send token
    //change locked lock icon in navbar to unlocked
    //make fields and okay button active on treeData page
    //close modal
    //if not
    //set userName to ''
    //set userPassword to ''
    //set userLoggedIn to false
    //alert user that only registered users can modify the data
    //close modal
  };

  //handle Cancel button
  const handleCancel = () => {
    setUserName('');
    setUserPassword('');
    setUserLoggedIn(false);
    //close modal
  };

  //----------render component----------
  return (
    <Modal
      backdrop='static'
      centered
      keyboard={false}
      onHide={handleCancel}
      show={show}
    >
      <Modal.Header className='pt-1 pb-1'>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          id='username'
          onBlur={(event) => {
            //see if user is even in db before allowing user to proceed
            //if not, alert user that only registered users can log in
            //clear control (if necessary)
            //close modal
          }}
          placeholder='Username'
          required
          type='text'
          value={userName}
        />
        <Form.Control
          className='mt-1'
          id='userpassword'
          placeholder='Password'
          ref={modalScientificName}
          required
          type='password'
          value={userPassword}
        />
      </Modal.Body>
      <Modal.Footer className='pt-1 pb-1'>
        <Button
          variant='primary'
          size='sm'
          onClick={(event) => handleSubmit(event)}
        >
          OK
        </Button>
        <Button
          variant='secondary'
          size='sm'
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default userLoginModal;
