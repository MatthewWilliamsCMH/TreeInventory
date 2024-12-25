import React from 'react';
import "./PhysicalDataForm.css";

const PhotoUploadModal = ({ isOpen, onUpload, onCapture }) => {
  if (!isOpen) return null;

  return (
    <div className = "modaloverlay control">
      <div className = "modalcontent">
        <p>Would you like to upload an existing photo or capture a new one?</p>
        <div>
          <button onClick={onCapture}>Capture</button>
          <button onClick={onUpload}>Upload</button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadModal;