import React, { useEffect } from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import Webcam from "@uppy/webcam";
import { Dashboard, useUppyState } from "@uppy/react";

const UppyUploader = ({ photoType, onUploadComplete }) => {
  // Initialize Uppy with a unique ID for each photo type
  const [uppy] = React.useState(() => {
    return new Uppy({ 
      id: `uppy-${photoType}`,
      autoProceed: true,
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*']
      }
    })
    .use(Tus, { 
      endpoint: import.meta.env.VITE_API_URL || "http://localhost:3001/uploads",
      headers: {
        'Photo-Type': photoType
      }
    })
    .use(Webcam, {
      modes: ['picture'],
      mirror: false
    });
  });

  const fileCount = useUppyState(uppy, (state) => Object.keys(state.files).length);
  const totalProgress = useUppyState(uppy, (state) => state.totalProgress);

  useEffect(() => {
    // Listen for upload completion
    const handleComplete = (result) => {
      if (result.successful && result.successful.length > 0) {
        const uploadedFile = result.successful[0];
        if (onUploadComplete) {
          onUploadComplete(uploadedFile.uploadURL || uploadedFile.response.uploadURL);
        }
      }
    };

    uppy.on('complete', handleComplete);

    // Cleanup
    return () => {
      uppy.off('complete', handleComplete);
      // Remove event listeners and cleanup
      uppy.cancelAll();
    };
  }, [uppy, onUploadComplete]);

  return (
    <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-lg">
      <Dashboard
        uppy={uppy}
        plugins={['Webcam']}
        width="100%"
        height="400px"
        showProgressDetails={true}
        proudlyDisplayPoweredByUppy={false}
      />
      {fileCount > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          Upload progress: {Math.round(totalProgress)}%
        </div>
      )}
    </div>
  );
};

export default UppyUploader;