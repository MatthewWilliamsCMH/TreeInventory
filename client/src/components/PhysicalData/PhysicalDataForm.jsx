import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Footer from "../Footer/Footer";
import { handleFieldChange, commonToScientificList, dbhList } from "../../utils/fieldChangeHandler";

//set up an object with values from formValues or set the values to ""
const PhysicalDataForm = () => {
  const { formValues, setFormValues, formStyle } = useOutletContext();
 
//-------------------- handle field changes --------------------
  const handleInputChange = (field, event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value; //handle checkboxes differently; they don't return a value
    setFormValues(prevValues => handleFieldChange(prevValues, field, value)); // Use imported updateFormField function
  };

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

      <div className = "control">
        <label htmlFor = "photos">Photos</label>
        <div className = "photogroup">
          <div className = "photo" id = "bark">
          </div>
          <div className = "photo" id = "summerLeaf">
          </div>
          <div className = "photo" id = "autumnLeaf">
          </div>
          <div className = "photo" id = "fruit">
          </div>
          <div className = "photo" id = "flower">
          </div>
          <div className = "photo" id = "environs">
          </div>
        </div>
      </div>

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
      <Footer />
    </form>
  );
};

export default PhysicalDataForm;