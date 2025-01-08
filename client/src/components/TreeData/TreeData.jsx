import React from "react";
import { useOutletContext } from "react-router-dom";

import Footer from "../Footer/Footer";
import DangerFlags from "../Header/DangerFlags";
import { handleFieldChange, commonToScientificList, dbhList, gardenList, siteInfoList, maintenanceNeedsList } from "../../utils/fieldChangeHandler";
import { formatDateForDisplay } from "../../utils/dateHandler";

import PhotoUploadForm from "./PhotoUploadForm.jsx"

const TreeData = () => {
  const { formValues, setFormValues, treeLocation, setTreeLocation, formStyle } = useOutletContext();
 
  //-------------------- handle field changes --------------------
  const handleInputChange = (field, event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value; //handle checkboxes differently; they don't return a value
    setFormValues(prevValues => handleFieldChange(prevValues, field, value)); // Use imported handleFieldChange function
  };

   const handlePhotoUpload = (url, photoType) => {
    setFormValues(prevValues => ({
      ...prevValues,
      photos: {
        ...prevValues.photos,
        [photoType]: url
      }
    }));
  };

  //-------------------- render component--------------------//
  return (
    <>
      <div className = "danger-flags-container">
        <DangerFlags formValues = {formValues}/>
      </div>
      <form style={formStyle}>
        <div className = "columns">
          <div className = "column">
            <div className = "controlgroup">
              <label>Species name</label>
              <div className = "control">
                <label htmlFor = "commonName">Common</label>
                <select
                  id = "commonName"
                  value = {formValues.commonName}
                  onChange = {(event) => handleInputChange("commonName", event)}
                >
                  {Object.keys(commonToScientificList).map((common) => (
                    <option key={common} value={common}>
                      {common}
                    </option>
                  ))}
                </select>
              </div>

              <div className = "control">
                <label htmlFor = "scientificName">Scientific</label>
                <select
                  id = "scientificName"
                  placeholder = "Select a scientific name."
                  value = {formValues.scientificName}
                  onChange = {(event) => handleInputChange("scientificName", event)}
                >
                {Object.entries(commonToScientificList)
                  .sort(([, a], [, b]) => a.localeCompare(b))
                  .map(([common, scientific]) => (
                    <option key={scientific} value={scientific}>
                      {scientific}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className = "control">
              <label htmlFor = "variety">Variety</label>
              <input
                id = "variety"
                type = "text" 
                value = {formValues.variety} 
                onChange = {(event) => handleInputChange("variety", event)}
              />
            </div>

            <div className = "control">
              <label htmlFor = "dbh">DBH</label>
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
              <label htmlFor = "garden">Garden</label>
              <select
                id = "garden"
                value = {formValues.garden}
                onChange = {(event) => handleInputChange("garden", event)}
              >
                {gardenList.map((garden, index) => (
                  <option key = {index} value = {garden}>
                    {garden}
                  </option>
                ))}
              </select>
            </div>

            <div className = "control">
              <label>Site data</label>
              <div className = "column">
                <div className = "checkboxgroup">
                  {siteInfoList.map((condition) => (
                    <label htmlFor = {condition} key = {condition}>
                      <input
                        id = {condition}
                        className = "checkbox"
                        type = "checkbox"
                        name = {condition}
                        checked = {formValues.siteInfo[condition] || false}
                        onChange = {(event) => handleInputChange(`siteInfo.${condition}`, event)}
                      />
                      {condition
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())
                      }
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className = "column">
            <div className = "control">
              <label htmlFor = "installedDate">Installed on</label>
              <input 
                id = "installedDate"
                type = "text"
                onChange = {(event) => handleInputChange("installedDate", event)} 
                defaultValue = {formatDateForDisplay(formValues.installedDate)}
              />
            </div>

            <div className = "control">
              <label htmlFor = "installedBy">Installed by</label>
              <input
                id = "installedBy"
                type = "text"
                defaultValue = {formValues.installedBy || ""} 
                onChange = {(event) => handleInputChange("installedBy", event)}
              />
            </div>

            <div className = "control">
              <label htmlFor = "felledDate">Felled on</label>
              <input 
                id = "felledDate"
                type = "text"
                defaultValue = {formatDateForDisplay(formValues.felledDate)}
                onChange = {(event) => handleInputChange("felledDate", event)} 
              />
            </div>

            <div className = "control">
              <label htmlFor = "felledBy">Felled by</label>
              <input
                id = "felledBy"
                type = "text"
                defaultValue = {formValues.felledBy || ""} 
                onChange = {(event) => handleInputChange("felledBy", event)}
              />
            </div>

            <div className = "control">
              <label>Care needs</label>
              <div className = "column">
                <div className = "checkboxgroup">
                  {maintenanceNeedsList.map((need) => (
                    <label htmlFor = {need} key = {need}>
                      <input
                        id = {need}
                        className = "checkbox"
                        type = "checkbox"
                        name = {need}
                        checked = {formValues.maintenanceNeeds[need] || false}
                        onChange = {(event) => handleInputChange(`maintenanceNeeds.${need}`, event)} 
                      />
                      {need
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())
                      }
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="control">
          <label htmlFor="photos">Photos</label>
          <PhotoUploadForm 
            formValues={formValues}
            onPhotoUpload={handlePhotoUpload}
          />
        </div>

        <div className = "control">
          <label htmlFor = "notes">Notes</label>
          <textarea
            id = "notes"
            value = {formValues.notes}
            onChange = {(event) => handleInputChange("notes", event)}
          />
        </div>
        <Footer />
      </form>
    </>
  );
};

export default TreeData;