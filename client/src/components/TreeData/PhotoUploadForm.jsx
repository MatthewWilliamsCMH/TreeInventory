import React, { useState, useEffect } from 'react';
import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
import Webcam from '@uppy/webcam';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/webcam/dist/style.css';

const PhotoUploadForm = () => {
  const [activePhotoType, setActivePhotoType] = useState(null);
  const [uppy, setUppy] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [error, setError] = useState(null);

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
      });

    // Log Uppy initialization
    console.log('Uppy initialized');

    const webcamPlugin = uppyInstance.getPlugin('Webcam');

    if (!webcamPlugin) {
      console.error('Webcam plugin is not loaded!');
    } else {
      console.log('Webcam plugin loaded successfully!');
    }

    // Explicitly request webcam permission
    const getPermissions = async () => {
      try {
        // Test the permission flow by calling getUserMedia
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('Webcam permission granted');
        stream.getTracks().forEach(track => track.stop()); // Stop the stream to release the camera
      } catch (err) {
        setError('Error: Webcam permission denied or blocked.');
        console.error('Webcam permission error:', err);
      }
    };

    getPermissions();  // Request permission on mount

    // Check for devices after permission is granted
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('Devices found:', videoDevices);
        setCameraDevices(videoDevices);
      } catch (err) {
        setError('Error: Failed to enumerate devices');
        console.error('Failed to enumerate devices:', err);
      }
    };

    // Call after permission
    getDevices();

    // Log when the webcam is ready
    uppyInstance.on('webcam:ready', () => {
      console.log('Webcam is ready!');
    });

    // Log when the camera is selected
    uppyInstance.on('camera:select', (deviceId) => {
      console.log('Camera selected:', deviceId);
      localStorage.setItem('preferredCameraId', deviceId);
      console.log('Preferred Camera saved to localStorage:', deviceId);
    });

    setUppy(uppyInstance);

    return () => {
      uppyInstance.destroy();
    };
  }, []);

  return (
    <>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {uppy && (
        <DashboardModal
          uppy={uppy}
          open={activePhotoType !== null}
          onRequestClose={() => setActivePhotoType(null)}
          plugins={['Webcam']}
          proudlyDisplayPoweredByUppy={false}
          showProgressDetails={true}
        />
      )}
    </>
  );
};

export default PhotoUploadForm;
