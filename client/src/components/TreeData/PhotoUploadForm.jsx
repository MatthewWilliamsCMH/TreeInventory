//---------imports----------
//external libraries
import React, { useState, useEffect } from 'react';
import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
// import Webcam from '@uppy/webcam';
import FileInput from '@uppy/file-input';
import Compressor from '@uppy/compressor';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
// import '@uppy/webcam/dist/style.css';
import '@uppy/file-input/dist/style.css';

//components
//import FullSizePhoto from './FullSizePhoto.jsx';
import { handlePhotoClick } from '../../utils/helpers.js';

const PhotoUploadForm = ({ workingTree, onPhotoUpload }) => {
  //set local states to initial values
  const [activePhotoType, setActivePhotoType] = useState(null);
  const [uppy, setUppy] = useState(null);
  const [showFullSize, setShowFullSize] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);

  //----------useEffects----------
  //create prop variables for Uppy.use below
  useEffect(() => {
    const uppyConfig = {
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
      autoProceed: false,
    };

    const fileInputConfig = {
      id: 'Add a Photo',
      pretty: true,
      locale: {
        strings: {
          chooseFiles: 'Load a Photo',
        },
      },
      multiple: false,
      inputName: 'photo',
      attributes: {
        accept: 'image/*',
        capture: 'environment',
      },
      title: 'Load a Photo',
    };

    const XHRUploadConfig = {
      endpoint: `${
        import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'https://localhost:3001'
      }/uploads`,
      fieldName: 'photo',
      formData: true,
    };

    const compressorConfig = {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
      resize: true,
      mimeType: 'image/jpeg',
      convertToWebp: true,
    };

    const uppyInstance = new Uppy(uppyConfig)
      .use(FileInput, fileInputConfig)
      .use(XHRUpload, XHRUploadConfig)
      .use(Compressor, compressorConfig);

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
  }, [activePhotoType, onPhotoUpload]);

  //----------called functions----------
  //handle camera click
  // const handlePhotoClick = (photoType) => {
  //   const photoUrl = workingTree.photos[photoType];

  //   if (photoUrl) {
  //     //open a new browser window
  //     const newWindow = window.open('', '_blank', 'width=1024,height=768');

  //     //write custom html for new window
  //     newWindow.document.write(`
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <title>Tree Photo</title>
  //         <style>
  //           body {
  //             margin: 0;
  //             background: black;
  //             display: flex;
  //             justify-content: center;
  //             align-items: center;
  //             min-height: 100vh;
  //           }
  //           img {
  //             max-width: 100%;
  //             max-height: 100vh;
  //             object-fit: contain;
  //             cursor: pointer;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <img
  //           alt='Full size view'
  //           onclick='window.opener.postMessage('openUppy', '*')'
  //           src='${photoUrl}'
  //         />
  //       </body>
  //     </html>
  //   `);

  //     //handle message from the new window
  //     const handleMessage = (event) => {
  //       if (event.data === 'openUppy') {
  //         newWindow.close();
  //         setActivePhotoType(photoType);
  //         uppy?.cancelAll();
  //       }
  //     };

  //     window.addEventListener('message', handleMessage);

  //     //cleanup
  //     return () => {
  //       window.removeEventListener('message', handleMessage);
  //     };
  //   } else {
  //     setActivePhotoType(photoType);
  //     uppy?.cancelAll();
  //   }
  // };

  //----------render component----------
  return (
    <>
      <Container
        fluid
        className='p-0 mt-1'
      >
        <Row className='g-1'>
          {['bark', 'summerLeaf', 'autumnLeaf', 'fruit', 'flower', 'environs'].map((photoType) => {
            const src = workingTree.photos?.[photoType];
            return (
              <Col
                xs={4}
                sm={4}
                md={6}
                lg={4}
                className='text-center'
                style={{ color: '#BBB' }}
                key={photoType}
              >
                <div
                  onClick={() => {
                    if (src) {
                      handlePhotoClick(src);
                    } else {
                      setActivePhotoType(photoType);
                      uppy?.cancelAll();
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  {src ? (
                    <Image
                      alt={photoType}
                      className='object-cover'
                      rounded
                      src={src}
                      style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      className='photo-placeholder border rounded d-flex align-items-center justify-content-center'
                      style={{
                        height: '100px',
                        background: '#fff',
                        width: '100%',
                      }}
                    >
                      <span>
                        {photoType
                          .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
                          .replace(/^([a-z])/g, (match) => match.toUpperCase())}
                      </span>
                    </div>
                  )}
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>

      {uppy && (
        <DashboardModal
          uppy={uppy}
          open={activePhotoType !== null}
          onRequestClose={() => setActivePhotoType(null)}
          // plugins={['Webcam']}
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
