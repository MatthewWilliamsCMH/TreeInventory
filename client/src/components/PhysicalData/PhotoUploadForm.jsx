import React, { useState, useEffect } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";
import Webcam from "@uppy/webcam";
import "@uppy/core/dist/style.css"
import "@uppy/dashboard/dist/style.css"
import "@uppy/webcam/dist/style.css"

const PhotoUploadForm = ({ formValues, onPhotoUpload }) => {
  const [activePhotoType, setActivePhotoType] = useState(null);
  const [uppy, setUppy] = useState(null);

  useEffect(() => {
    const uppyInstance = new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ["image/*"]
      },
      autoProceed: false,
    })
    .use(Webcam, {
      mirror: true,
      facingMode: "environment",
      showVideoSourceDropdown: true,
    })
    .use(XHRUpload, {
      endpoint: "http://localhost:3001/uploads",
      fieldName: "photo",
      formData: true,
    });

    // Add cleanup for upload events
    const handleUploadSuccess = (file, response) => {
      const uploadedUrl = response.body.url;
      console.log('Upload success:', uploadedUrl);
      onPhotoUpload(uploadedUrl, activePhotoType);
      setActivePhotoType(null);
    };

    uppyInstance.on("upload-success", handleUploadSuccess);

    setUppy(uppyInstance);

    return () => {
      uppyInstance.off("upload-success", handleUploadSuccess);
      uppyInstance.destroy();
    };
  }, [activePhotoType, onPhotoUpload]); // Add dependencies

  const handlePhotoClick = (photoType) => {
    setActivePhotoType(photoType);
    uppy?.cancelAll();
  };

  return (
    <>
      <div className="photogroup">
        {["bark", "summerLeaf", "autumnLeaf", "fruit", "flower", "environs"].map((photoType) => (
          <div
            key={photoType}
            className="photo"
            onClick={() => handlePhotoClick(photoType)}
          >
            {formValues.photos?.[photoType] ? (
              <div className="photo-preview">
                <img
                  src={formValues.photos[photoType]}
                  alt={photoType}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="photo-placeholder">
                <p>
                  {photoType
                    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
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
          plugins={["Webcam"]}
          proudlyDisplayPoweredByUppy={false}
          showProgressDetails={true}
          note={`Upload or take a photo of the tree's ${activePhotoType}`}
        />
      )}
    </>
  );
};

export default PhotoUploadForm;