import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Footer from "../Footer/Footer";
import { handleFieldChange, commonToScientificList, dbhList } from "../../utils/fieldChangeHandler";
import UppyUploader from "./UppyUploader"

//set up an object with values from formValues or set the values to ""
const PhysicalDataForm = () => {
  const { formValues, setFormValues, formStyle } = useOutletContext();
  const [activePhotoType, setActivePhotoType] = useState(null);
 
//-------------------- handle field changes --------------------
  const handleInputChange = (field, event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value; //handle checkboxes differently; they don't return a value
    setFormValues(prevValues => handleFieldChange(prevValues, field, value)); // Use imported updateFormField function
  };

  const handlePhotoClick = (photoType) => {
    setActivePhotoType((prev) => (prev === photoType ? null : photoType));
  };

  const handlePhotoUpload = (url, photoType) => {
    setFormValues(prevValues => ({
      ...prevValues,
      photos: {
        ...prevValues.photos,
        [photoType]: url
      }
    }));
    setActivePhotoType(null); // Close the uploader after successful upload
  };

  const PhotoThumbnail = ({ url }) => (
    url ? (
      <div className="w-full h-full overflow-hidden">
        <img 
          src={url} 
          alt="thumbnail" 
          className="w-full h-full object-cover"
        />
      </div>
    ) : null
  );

  //-------------------- render component--------------------//
  return (
    <form style={formStyle}>
      <div className = "controlgroup">
        <label>Species</label>
        <div className = "control">
          <label htmlFor = "commonName">Common name:</label>
          <select
            id = "commonName"
            value = {formValues.species.commonName}
            onChange = {(event) => handleInputChange("species.commonName", event)}
          >
            {Object.keys(commonToScientificList).map((common) => (
              <option key={common} value={common}>
                {common}
              </option>
            ))}
          </select>
        </div>
        <div className = "control">
          <label htmlFor = "scientificName">Scientific name:</label>
          <select
            id = "scientificName"
            placeholder = "Select a scientific name."
            value = {formValues.species.scientificName}
            onChange = {(event) => handleInputChange("species.scientificName", event)}
          >
            {Object.entries(commonToScientificList).map(([common, scientific]) => (
              <option key={scientific} value={scientific}>
                {scientific}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className = "control">
        <label htmlFor = "variety">Variety or cultivar:</label>
        <input
          id = "variety"
          type = "text" 
          value = {formValues.variety} 
          onChange = {(event) => handleInputChange("variety", event)}
        />
      </div>

      <div className = "control">
        <label htmlFor = "dbh">DBH:</label>
        <select 
          id = "dbh" 
          placeholder = "Select a diameter."
          value = {formValues.dbh} 
          onChange = {event => handleInputChange("dbh", event)} 
        >
          {dbhList.map((dbh, index) => (
            <option key = {index} value = {dbh}>
              {dbh}
            </option>
          ))}
        </select>
      </div>

      <div className="control">
        <label htmlFor="photos">Photos</label>
        <div className="photogroup">
          {["bark", "summerLeaf", "autumnLeaf", "fruit", "flower", "environs"].map((photoType) => (
            <div
              key={photoType} 
              className="photo"
              onClick={() => handlePhotoClick(photoType)}
            >
              {/* Show existing photo if available */}
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
                  <p>{photoType
                    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                    .replace(/^([a-z])/g, (match) => match.toUpperCase())
                  }</p>
                </div>
              )}

              {/* Uppy modal overlay */}
              {activePhotoType === photoType && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="relative bg-white p-4 rounded-lg max-w-xl w-full mx-4">
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoType(null);
                      }}
                    >
                      ✕
                    </button>
                    <UppyUploader
                      photoType={photoType}
                      onUploadComplete={(url) => {
                        handlePhotoUpload(url, photoType);
                        setActivePhotoType(null);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* <div className="control">
        <label htmlFor="photos">Photos</label>
        <div className="photogroup">
          <div className="photo" onClick={() => handlePhotoClick("bark")}>
            <p>Bark</p>
          </div>
          <div className="photo" onClick={() => handlePhotoClick("summerLeaf")}>
            <p>Summer leaf</p>
          </div>
          <div className="photo" onClick={() => handlePhotoClick("autumnLeaf")}>
            <p>Autumn leaf</p>
          </div>
          <div className="photo" onClick={() => handlePhotoClick("fruit")}>
            <p>Fruit</p>
          </div>
          <div className="photo" onClick={() => handlePhotoClick("flower")}>
            <p>Flower</p>
          </div>
          <div className="photo" onClick={() => handlePhotoClick("environs")}>
            <p>Environs</p>
          </div>
        </div>
      </div> */}

      <div className = "control">
        <label htmlFor = "notes">Notes:</label>
        <textarea
          id = "notes"
          value = {formValues.notes}
          onChange = {(event) => handleInputChange("notes", event)}
        />
      </div>

      <div className = "danger">
        <div className = "control">
          <label htmlFor = "nonnative">
            <input
              id = "nonnative"
              className = "nestedcheckbox"
              type = "checkbox"
              name = "nonnative"
              checked = {formValues.nonnative || false}
              onChange = {(event) => handleInputChange("nonnative", event)}
            />Nonnative
          </label>
        </div>

        <div className = "control">
          <label htmlFor = "invasive">
            <input
              id = "invasive"
              className = "nestedcheckbox"
              type = "checkbox"
              name = "invasive"
              checked = {formValues.invasive || false}
              onChange = {(event) => handleInputChange("invasive", event)}
            />Invasive
          </label>
        </div>
      </div>

      {/* <PhotoUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (event) => handlePhotoUpload(event.target.files[0], false);
          input.click();
        }}
        onCapture={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.capture = 'environment';
          input.onchange = (event) => handlePhotoUpload(event.target.files[0], true);
          input.click();
        }}
      /> */}
      <Footer />
    </form>
  );
};

export default PhysicalDataForm;