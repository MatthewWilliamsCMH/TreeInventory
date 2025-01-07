import React from "react";
import { useOutletContext } from "react-router-dom";

import Footer from "../Footer/Footer";
import DangerFlags from "../Header/DangerFlags";
import { handleFieldChange, maintenanceNeedsList } from "../../utils/fieldChangeHandler";
import { formatDateForDisplay } from "../../utils/dateHandler";

//set up an object with values from updatedTree or set the values to ""
const CareDataForm = () => {
  const { formValues, setFormValues, formStyle } = useOutletContext();

 //-------------------- handle field changes --------------------
   const handleInputChange = (field, event) => {
     const value = event.target.type === "checkbox" ? event.target.checked : event.target.value; //handle checkboxes differently; they don't return a value
     setFormValues(prevValues => handleFieldChange(prevValues, field, value)); // Use imported updateFormField function
   };

  //-------------------- render component--------------------//
  return (
    <>
      <div className = "danger-flags-container">
        <DangerFlags formValues = {formValues}/>
      </div>    <form style={formStyle}>
      <div className="control">
        <label htmlFor = "lastVisited">Last visited:</label>
        <p id="lastVisited">{formatDateForDisplay(formValues.lastVisited)}</p>
      </div>

      <div className = "control">
        <label htmlFor = "installedDate">Installed on:</label>
        <input 
          id = "installedDate"
          type = "text"
          onChange = {(event) => handleInputChange("installedDate", event)} 
          defaultValue = {formatDateForDisplay(formValues.installedDate)}
        />
      </div>

      <div className = "control">
        <label htmlFor = "installedBy">Installed by:</label>
        <input
          id = "installedBy"
          type = "text"
          defaultValue = {formValues.installedBy || ""} 
          onChange = {(event) => handleInputChange("installedBy", event)}
        />
      </div>

      <div className = "control">
        <label htmlFor = "felledDate">Felled on:</label>
        <input 
          id = "felledDate"
          type = "text"
          defaultValue = {formatDateForDisplay(formValues.felledDate)}
          onChange = {(event) => handleInputChange("felledDate", event)} 
        />
      </div>

      <div className = "control">
        <label htmlFor = "felledBy">Felled by:</label>
        <input
          id = "felledBy"
          type = "text"
          defaultValue = {formValues.felledBy || ""} 
          onChange = {(event) => handleInputChange("felledBy", event)}
        />
      </div>

      <div className = "controlgroup">
        <label>Maintenance needs</label>
        <div className = "control checkboxgroup">
          {maintenanceNeedsList.map((need) => (
            <label htmlFor = {need} key = {need}>
              <input
                id = {need}
                className = "nestedcheckbox"
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

      <div className = "control">
        <label html = "careHistory">Care history:</label>
        <textarea
          id = "careHistory"
          value = {formValues.careHistory || ""}
          onChange = {(event) => handleInputChange("careHistory", event)} 
        />
      </div>
      <Footer />
    </form>
    </>
  );
};

export default CareDataForm;