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
  const [cameraDevices, setCameraDevices] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [preferredCameraId, setPreferredCameraId] = useState(null);

  //get permission to use camera before initializing Uppy
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true }); //request permission
        setHasPermission(true);

        const devices = await navigator.mediaDevices.enumerateDevices(); //get the list of devices
        const videoDevices = devices.filter(device => device.kind === 'videoinput'); //filter list to just video devices
        //why can't the line below be combined with the line above; why the second variable?
        setCameraDevices(videoDevices);

        const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back')); //find the first item with "back" in the label

        if (backCamera) {
          setPreferredCameraId(backCamera.deviceId);
        } else if (videoDevices.length > 0) {
          setPreferredCameraId(videoDevices[0].deviceId); //fallback if no back camera is found
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
      mobileNativeCamera: false,
      preferredVideoInput: preferredCameraId
    };

    //if I'm using this, do I need multer at all?
    const XHRUploadConfig = {
      endpoint: `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'https://localhost:3001'}/uploads`,
      fieldName: 'photo',
      formData: true
    };

    const uppyInstance = new Uppy(uppyConfig)
    uppyInstance
      .use(Webcam, webcamConfig)
      .use(XHRUpload, XHRUploadConfig);

    //cleanup for upload events
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