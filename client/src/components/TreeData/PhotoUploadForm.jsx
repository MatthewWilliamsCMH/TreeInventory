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

  useEffect(() => {
    const uppyInstance = new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
      autoProceed: false,
    })
      .use(Webcam, {
        modes: ['picture'],
        mirror: false,
        showVideoSourceDropdown: true,
        mobileNativeCamera: false,
      })
      .use(XHRUpload, {
        endpoint: `${import.meta.env.VITE_API_URL || 'https://localhost:3001'}/uploads`,
        fieldName: 'photo',
        formData: true,
      });

    // Log Uppy initialization
    console.log('Uppy initialized');

    // Check if Webcam plugin is properly loaded
    const webcamPlugin = uppyInstance.getPlugin('Webcam');
    if (!webcamPlugin) {
      console.error('Webcam plugin is not loaded!');
    } else {
      console.log('Webcam plugin loaded successfully!');
    }

    // Explicitly request permissions and check for camera devices
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
          console.warn('No video devices found.');
        } else {
          console.log('Devices found:', videoDevices);
          setCameraDevices(videoDevices);
        }

        const preferredCameraId = localStorage.getItem('preferredCameraId');
        console.log('Preferred Camera ID from localStorage:', preferredCameraId);

        const preferredDevice = videoDevices.find(device => device.deviceId === preferredCameraId);
        const backCamera = videoDevices.find(device =>
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('dual')
        );

        const selectedDevice = preferredDevice || backCamera;

        if (selectedDevice) {
          console.log('Selected Camera Device:', selectedDevice);
          // Use setTimeout to delay selection slightly and ensure video sources are ready
          setTimeout(() => {
            webcamPlugin.selectCamera(selectedDevice.deviceId);
          }, 1000);
        } else {
          console.log('No preferred camera found, defaulting...');
        }
      } catch (err) {
        console.error('Failed to enumerate devices:', err);
      }
    };

    // Ensure webcam is initialized and permission is requested
    uppyInstance.on('webcam:ready', async () => {
      console.log('Webcam is ready! Requesting camera devices...');
      await getDevices();
    });

    // Log when the camera is selected
    uppyInstance.on('camera:select', (deviceId) => {
      console.log('Camera selected:', deviceId);
      localStorage.setItem('preferredCameraId', deviceId);
      console.log('Preferred Camera saved to localStorage:', deviceId);
    });

    // Handle upload success
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
      uppyInstance.off('camera:select');
      uppyInstance.destroy();
    };
  }, [activePhotoType, onPhotoUpload]);

  const handlePhotoClick = (photoType) => {
    const photoUrl = updatedTree.photos[photoType];

    if (photoUrl) {
      // Open a new browser window
      const newWindow = window.open('', '_blank', 'width=1024,height=768');
      
      // Write custom HTML for new window
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
              onclick='window.opener.postMessage("openUppy", "*")'
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
      
      // Cleanup
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    } else {
      setActivePhotoType(photoType);
      uppy?.cancelAll();
    }
  };

  return (
    <>
      <div className="photogroup">
        {['bark', 'summerLeaf', 'autumnLeaf', 'fruit', 'flower', 'bud', 'environs'].map((photoType) => (
          <div
            key={photoType}
            className="photo"
            onClick={() => handlePhotoClick(photoType)}
          >
            {updatedTree.photos?.[photoType] ? (
              <div className="photo-preview">
                <img
                  src={updatedTree.photos[photoType]}
                  alt={photoType}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="photo-placeholder">
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
          uppy={uppy}
          open={activePhotoType !== null}
          onRequestClose={() => setActivePhotoType(null)}
          plugins={['Webcam']}
          proudlyDisplayPoweredByUppy={false}
          showProgressDetails={true}
          note={`Upload or take a photo of the tree's ${activePhotoType}`}
        />
      )}

      {showFullSize && (
        <FullSizePhoto
         

          photoUrl={selectedPhotoUrl}
          onClose={() => setShowFullSize(false)}
          onEdit={() => {
            setShowFullSize(false);
            setActivePhotoType(activePhotoType);
          }}
        />
      )}
    </>
  );
};

export default PhotoUploadForm;
