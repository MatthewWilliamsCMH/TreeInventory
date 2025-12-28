//---------Import----------
//external libraries
import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import FileInput from '@uppy/file-input';
import Compressor from '@uppy/compressor';

import AppContext from '../../appContext';

//project-specific helpers
import { handlePhotoClick } from '../../utils/helpers.js';

//styles
import 'bootstrap/dist/css/bootstrap.min.css';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/file-input/dist/style.css';

//----------Create Component----------
const PhotoUploadForm = ({ workingTree, onPhotoUpload }) => {
  //access global states from parent (using Context)
  const { setWorkingTree } = useContext(AppContext);

  //define local states and set initial values
  const [activePhotoType, setActivePhotoType] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(null);
  const [showFullSize, setShowFullSize] = useState(false);
  const [uppy, setUppy] = useState(null);

  //useEffects
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
      endpoint: import.meta.env.DEV ? 'http://localhost:3001/api/uploads' : '/api/uploads',
      fieldName: 'photo',
      formData: true,
    };
    console.log('Upload endpoint:', XHRUploadConfig.endpoint);

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
      const uploadedPhoto = {
        url: response.body.url,
        publicId: response.body.publicId,
      };
      console.log('Upload success:', uploadedPhoto);
      onPhotoUpload(uploadedPhoto, activePhotoType);
      setActivePhotoType(null);
    };

    uppyInstance.on('upload-success', handleUploadSuccess);

    setUppy(uppyInstance);

    return () => {
      uppyInstance.off('upload-success', handleUploadSuccess);
      uppyInstance.destroy();
    };
  }, [activePhotoType, onPhotoUpload]);

  //handlers and callback functions
  const handleDeletePhoto = (photoType) => {
    let confirmMessage = 'Are you sure you want to delete the photo?';
    if (photoType === 'environs') {
      confirmMessage =
        confirmMessage +
        '\n\nAn environs photo is required. It must be replaced to update the tree.';
    }

    const userConfirmed = window.confirm(confirmMessage);
    if (!userConfirmed) {
      return;
    }

    setWorkingTree((prev) => ({
      ...prev,
      photos: {
        ...prev.photos,
        [photoType]: null,
      },
    }));
  };

  //----------Render Component----------
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
                    if (src?.url) {
                      handlePhotoClick(src.url);
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
                  {src?.url ? (
                    <div style={{ position: 'relative' }}>
                      <Image
                        alt={photoType}
                        className='object-cover'
                        rounded
                        src={src.url}
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover',
                        }}
                      />
                      <Button
                        alt={`Delete ${photoType} Photo`}
                        className='trashButton'
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeletePhoto(photoType);
                        }}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                        }}
                        variant='danger'
                      >
                        <i className='bi-trash3'></i>
                      </Button>
                    </div>
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
