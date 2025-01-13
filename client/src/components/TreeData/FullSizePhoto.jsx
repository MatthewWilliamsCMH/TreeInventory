const FullSizePhoto = ({ photoUrl, onClose, onEdit }) => {
  return (
    <div>
      <div>
        <div>
          <button onClick={onEdit}>
            Replace Photo
          </button>
          <button onClick={onClose}>
            Close
          </button>
        </div>
        <img 
          src={photoUrl} 
          alt="Full size view"
        />
      </div>
    </div>
  );
};

export default FullSizePhoto;