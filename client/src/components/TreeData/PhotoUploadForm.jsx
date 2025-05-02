import React, { useState, useEffect } from 'react';
import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import Webcam from '@uppy/webcam';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/webcam/dist/style.css';
import FullSizePhoto from './FullSizePhoto.jsx';

const PhotoUploadForm = ({ updatedTree, onPhotoUpload }) => {
  const [activePhotoType, setActivePhotoType] = useState(null);
  const [uppy, setUppy] = useState(null);
  const [showFullSize, setShowFullSize] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [preferredCameraId, setPreferredCameraId] = useState(null);
  
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        // Request access to the user's camera
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        
        // Now that we have permission, enumerate devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('video devices:', videoDevices);
        
        // Find the back camera or default to the first camera
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back')
        );
        
        if (backCamera) {
          setPreferredCameraId(backCamera.deviceId);
        } else if (videoDevices.length > 0) {
          setPreferredCameraId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Camera permission denied or failed:', error);
        setHasPermission(false);
      }
    };

    requestCameraPermission();
  }, []);


  //initialize Uppy
useEffect(() => {
  if (!hasPermission || preferredCameraId === null) return;
  
  const uppyConfig = {
    restrictions: {
      maxNumberOfFiles: 1,
      allowedFileTypes: ['image/*']
    },
    autoProceed: false,
  };
  
  const webcamConfig = {
    modes: ['picture'],
    mirror: false,
    showVideoSourceDropdown: true,
    mobileNativeCamera: false
  };

  const XHRUploadConfig = {
    endpoint: `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'https://localhost:3001'}/uploads`,
    fieldName: 'photo',
    formData: true
  };

  const uppyInstance = new Uppy(uppyConfig)
    .use(Webcam, webcamConfig)
    .use(XHRUpload, XHRUploadConfig);
  
  // Listen for webcam initialization
  uppyInstance.on('webcam:init', () => {
    console.log('Webcam initialized, preferred camera ID:', preferredCameraId);
    
    // Get the webcam plugin
    const webcamPlugin = uppyInstance.getPlugin('Webcam');
    
    // Log available methods for debugging
    console.log('Webcam plugin methods:', 
      Object.getOwnPropertyNames(Object.getPrototypeOf(webcamPlugin))
        .filter(prop => typeof webcamPlugin[prop] === 'function')
    );
    
    // Try to select the device, if the method exists
    if (typeof webcamPlugin.selectDevice === 'function') {
      console.log('Using selectDevice method');
      webcamPlugin.selectDevice(preferredCameraId);
    } else if (typeof webcamPlugin.selectDeviceById === 'function') {
      console.log('Using selectDeviceById method');
      webcamPlugin.selectDeviceById(preferredCameraId);
    } else {
      console.log('No method available to select device');
    }
  });
  
  const handleUploadSuccess = (file, response) => {
    const uploadedUrl = response.body.url;
    console.log('Upload success:', uploadedUrl);
    onPhotoUpload(uploadedUrl, activePhotoType);
    setActivePhotoType(null);
  };

  uppyInstance.on('upload-success', handleUploadSuccess);

  setUppy(uppyInstance);

  return () => {
    uppyInstance.off('upload-success', handleUploadSuccess);
    uppyInstance.off('webcam:init');
    uppyInstance.destroy();
  };
}, [hasPermission, preferredCameraId, activePhotoType, onPhotoUpload]);
  const handlePhotoClick = (photoType) => {
    const photoUrl = updatedTree.photos[photoType];

  if (photoUrl) {
    //open a new browser window
    const newWindow = window.open('', '_blank', 'width=1024,height=768');
    
    //write custom html for new window
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tree Photo</title>
          <style>
            body {
              margin: 0;
              background: black;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <img 
            src='${photoUrl}' 
            alt='Full size view' 
            onclick='window.opener.postMessage('openUppy', '*')'
          />
        </body>
      </html>
    `);
    
    // Handle message from the new window
    const handleMessage = (event) => {
      if (event.data === 'openUppy') {
        newWindow.close();
        setActivePhotoType(photoType);
        uppy?.cancelAll();
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    //cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
    } 
    else {
      setActivePhotoType(photoType);
      uppy?.cancelAll();
    }
  };

  return (
    <>
      <div className='photogroup'>
        {['bark', 'summerLeaf', 'autumnLeaf', 'fruit', 'flower', 'bud', 'environs'].map((photoType) => (
          <div
            key={photoType}
            className='photo'
            onClick={() => handlePhotoClick(photoType)}
          >
            {updatedTree.photos?.[photoType] ? (
              <div className='photo-preview'>
                <img
                  src = {updatedTree.photos[photoType]}
                  alt = {photoType}
                  className = 'object-cover'
                />
              </div>
            ) : (
              <div className='photo-placeholder'>
                <p>
                  {photoType
                    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
                    .replace(/^([a-z])/g, (match) => match.toUpperCase())}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {uppy && (
        <DashboardModal
          uppy = {uppy}
          open = {activePhotoType !== null}
          onRequestClose = {() => setActivePhotoType(null)}
          plugins = {['Webcam']}
          proudlyDisplayPoweredByUppy={false}
          showProgressDetails={true}
          note = {`Upload or take a photo of the tree's ${activePhotoType}`}
        />
      )}

      {showFullSize && (
        <FullSizePhoto
          photoUrl = {selectedPhotoUrl}
          onClose = {() => setShowFullSize(false)}
          onEdit = {() => {
            setShowFullSize(false)
            setActivePhotoType(activePhotoType)
          }}
        />
      )}
    </>
  );
};

export default PhotoUploadForm;