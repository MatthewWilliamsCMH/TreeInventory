//---------imports----------
//external libraries
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Modal, Button, Form } from 'react-bootstrap';

//stylesheets

//mutations
import { LOGIN_USER } from '../../mutations/login_user';

//functions and constants

//compponents
import AppContext from '../../appContext';

const LoginModal = ({ show, onClose }) => {
  //----------data reception and transmission----------
  //get current global states using context
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);

  //set local states to initial values
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const [loginUser] = useMutation(LOGIN_USER);
  //initialze hooks
  const navigate = useNavigate();
  const { pathname } = useLocation();

  //----------useEffects----------
  useEffect(() => {
    if (isLoggedIn) {
      if (pathname === '/TreeDetails') {
        navigate('/TreeData');
      }
    } else {
      if (pathname === '/TreeData') {
        navigate('/TreeDetails');
      }
    }
  }, [isLoggedIn, location.pathname, navigate]);

  //----------handlers and callback functions----------
  //handle Submit button
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userName.trim() || !userPassword.trim()) {
      alert('Username and password are required to log in.');
      return;
    }

    try {
      const { data } = await loginUser({
        variables: { userName, userPassword },
      });

      if (!data?.loginUser) {
        alert('Invalid username or password. Only registered users can modify the data.');
        setIsLoggedIn(false);
        return;
      }

      // Login successful
      setIsLoggedIn(true);
      //if currently displayed component is details, change to data
    } catch (err) {
      console.error('Login error:', err);
      alert('Server error. Please try again later.');
      setIsLoggedIn(false);
    } finally {
      onClose();
      setUserName('');
      setUserPassword('');
    }
  };

  //handle Cancel button
  const handleCancel = () => {
    setUserName('');
    setUserPassword('');
    setIsLoggedIn(false);
    onClose();
  };

  //----------render component----------
  return (
    <Modal
      backdrop='static'
      centered
      // keyboard={false}
      onHide={handleCancel}
      show={show}
    >
      <Modal.Header className='pt-1 pb-1'>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          id='username'
          onChange={(event) => {
            setUserName(event.target.value);
          }}
          placeholder='Username'
          required
          type='text'
          value={userName}
        />
        <Form.Control
          className='mt-1'
          id='userpassword'
          onChange={(event) => {
            setUserPassword(event.target.value);
          }}
          placeholder='Password'
          required
          type='text'
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

export default LoginModal;
