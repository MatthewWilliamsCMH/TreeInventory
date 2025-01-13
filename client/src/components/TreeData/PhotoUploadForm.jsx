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

  useEffect(() => {
    const uppyInstance = new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*']
      },
      autoProceed: false,
    })
    .use(Webcam, {
      mirror: true,
      facingMode: 'environment',
      showVideoSourceDropdown: true,
    })
    .use(XHRUpload, {
      endpoint: `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'http://localhost:3001'}/uploads`,
      fieldName: 'photo',
      formData: true,
    });

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
  }, [activePhotoType, onPhotoUpload]); // Add dependencies

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
            src="${photoUrl}" 
            alt="Full size view" 
            onclick="window.opener.postMessage('openUppy', '*')"
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
        {['bark', 'summerLeaf', 'autumnLeaf', 'fruit', 'flower', 'environs'].map((photoType) => (
          <div
            key={photoType}
            className='photo'
            onClick={() => handlePhotoClick(photoType)}
          >
            {updatedTree.photos?.[photoType] ? (
              <div className='photo-preview'>
                <img
                  src={updatedTree.photos[photoType]}
                  alt={photoType}
                  className='object-cover'
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
          photoUrl = {selectedPhotoUrl}
          onClose = {() => setShowFullSize(false)}
          onEdit={() => {
            setShowFullSize(false)
            setActivePhotoType(activePhotoType)
          }}
        />
      )}
    </>
  );
};

export default PhotoUploadForm;