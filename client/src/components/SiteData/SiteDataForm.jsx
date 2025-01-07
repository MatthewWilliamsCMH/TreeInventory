import React from "react";
import { useOutletContext } from "react-router-dom";

import Footer from "../Footer/Footer";
import { handleFieldChange, siteInfoList, gardenList } from "../../utils/fieldChangeHandler";

//set up an object with values from updatedTree or set the values to ""
const SiteDataForm = () => {
  const { formValues, setFormValues, formStyle } = useOutletContext();

//-------------------- handle field changes --------------------
  const handleInputChange = (field, event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value; //handle checkboxes differently; they don't return a value
    setFormValues(prevValues => handleFieldChange(prevValues, field, value)); // Use imported updateFormField function
  };

//-------------------- render component--------------------//
  return (
    <form style={formStyle}>
      <div className="control">
        <label htmlFor = "garden">Garden:</label>
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

      <div className = "controlgroup">
        <label>Site data</label>
        <div className = "control checkboxgroup">
          {siteInfoList.map((condition) => (
            <label htmlFor = {condition} key = {condition}>
              <input
                id = {condition}
                className = "nestedcheckbox"
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
      <Footer />
    </form>
  );
};

export default SiteDataForm;