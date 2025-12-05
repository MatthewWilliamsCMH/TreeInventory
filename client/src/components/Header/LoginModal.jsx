//----------Import----------
//external libraries
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Modal, Button, Form } from 'react-bootstrap';

//local components
import AppContext from '../../appContext';

//project-specific mutations
import { LOGIN_USER } from '../../mutations/login_user';

//----------Create Component----------
const LoginModal = ({ show, onClose }) => {
  //initialize React hooks (e.g., useRef, useNavigate, custom hooks)
  const navigate = useNavigate();
  const { pathname } = useLocation();

  //access global states from parent (using Context)
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);

  //define local states and set initial values
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');

  //define queries (using Apollo Client)
  const [loginUser] = useMutation(LOGIN_USER);

  //useEffects
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

  //handlers and callback functions
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

      //if login successful
      setIsLoggedIn(true);
      //if currently displayed component is TreeDetails, change to TreeData
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

  //----------Render Component----------
  return (
    <Modal
      backdrop='static'
      centered
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
