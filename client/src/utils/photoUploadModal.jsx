import React from 'react';

const PhotoUploadModal = ({ isOpen, onClose, onUpload, onCapture }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '400px'
      }}>
        <h2>Add Photo</h2>
        <div>
          <button onClick={onCapture}>Take New Photo</button>
          <button onClick={onUpload}>Choose Existing Photo</button>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PhotoUploadModal;