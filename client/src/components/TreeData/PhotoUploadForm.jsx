//---------Import----------
//external libraries
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
// import XHRUpload from '@uppy/xhr-upload';
import FileInput from '@uppy/file-input';
import Compressor from '@uppy/compressor';

//project-specific helpers
import { handlePhotoClick } from '../../utils/helpers.js';

//styles
import 'bootstrap/dist/css/bootstrap.min.css';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/file-input/dist/style.css';

//----------Create Component----------
const PhotoUploadForm = ({ workingTree, stagedPhotos, setStagedPhotos }) => {
  const [activePhotoType, setActivePhotoType] = useState(null);
  const [uppy, setUppy] = useState(null);

  //useEffects
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
      // .use(XHRUpload, XHRUploadConfig)
      .use(Compressor, compressorConfig);

    // add file to stagedPhotos and close dashboard immediately
    uppyInstance.on('file-added', (file) => {
      if (activePhotoType) {
        setStagedPhotos((prev) => ({ ...prev, [activePhotoType]: file.data }));
        setActivePhotoType(null);
      }
    });

    setUppy(uppyInstance);

    return () => {
      uppyInstance.destroy();
    };
  }, [activePhotoType, setStagedPhotos]);

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

    setStagedPhotos((prev) => ({ ...prev, [photoType]: null }));
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
            const saved = workingTree.photos?.[photoType];
            const staged = stagedPhotos[photoType];
            const src = staged ? URL.createObjectURL(staged) : saved?.url;

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
                    if (src) handlePhotoClick(src);
                    else setActivePhotoType(photoType);
                  }}
                  style={{
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  {src ? (
                    <div style={{ position: 'relative' }}>
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
          hideUploadButton={true}
          proudlyDisplayPoweredByUppy={false}
          showProgressDetails={true}
          note={`Select or take a photo of the tree's ${activePhotoType}`}
        />
      )}
    </>
  );
};

export default PhotoUploadForm;
