import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

//set up an object with values from selectedTree and set their values to ""
const SiteDataForm = () => {
  const { selectedTree, setSelectedTree, formStyle } = useOutletContext();

  const [formValues, setFormValues] = useState(() => ({
    location: {
      northing: selectedTree?.location?.northing || "",
      easting: selectedTree?.location?.easting || ""
    },
    garden: selectedTree?.garden || "",
    siteData: {
      slope: selectedTree?.sitedata?.slope || false,
      overheadLines: selectedTree?.sitedata?.overhadeLines || false,
      treeCluster: selectedTree?.sitedata?.treeCluster || false,
      proximateStructure: selectedTree?.sitedata?.proximateStructure || false,
      proximateFence: selectedTree?.sitedata?.proximateFence || false
    },
    nonnative: selectedTree?.nonnative || false,
    invasive: selectedTree?.invasive || false,
    hidden: selectedTree?.hidden || false
  }));

  //sync form state with selectedTree when it changes
  useEffect(() => {
    if (selectedTree) {
      setFormValues({
        location: {
          northing: selectedTree.location?.northing || "",
          easting: selectedTree.location?.easting || ""
        },
        garden: selectedTree.garden || "",
        siteData: {
          slope: selectedTree?.siteData?.slope || false,
          overheadLines: selectedTree?.siteData?.overheadLines || false,
          treeCluster: selectedTree?.siteData?.treeCluster || false,
          proximateStructure: selectedTree?.siteData?.proximateStructure || false,
          proximateFence: selectedTree?.siteData?.proximateFence || false
        },
        nonnative: selectedTree.nonnative || false,
        invasive: selectedTree.invasive || false,
        hidden: selectedTree.hidden || false
      });
    };
  }, [selectedTree]);

  // generic handler for controls
  const handleFieldChange = (field, value) => {
    setFormValues(prevValues => {
      if (field.includes(".")) {
        const [parentField, childField] = field.split(".");
        return {
          ...prevValues,
          [parentField]: {
            ...prevValues[parentField],
            [childField]: value.target ? value.target.value : value
          }
        };
      }
      
      //handle grouped checkboxes
      if (typeof prevValues[field] === "object" && prevValues[field] !== null) {
        const inputType = value.target ? value.target.type : null;
        
        if (inputType === "checkbox") {
          return {
            ...prevValues,
            [field]: {
              ...prevValues[field],
              [value.target.name]: value.target.checked
            }
          };
        }
      }

      //handle ungrouped checkboxes
      if (value.target && value.target.type === "checkbox") {
        return {
          ...prevValues,
          [field]: value.target.checked
        };
      }
      
      //handle standard inputs, selects, and direct value assignments
      return {
        ...prevValues,
        [field]: value.target ? value.target.value : value
      };
    });
  };

  //-------------------- render component--------------------//
  return (
    <form style={formStyle}>
      <div className = "controlgroup">
        <label>Location</label>
        <div className = "control">
          <label htmlFor = "northing">Northing:</label>
          <input
            id = "northing"
            type = "text"
            value = {formValues.location.northing || ""}
            onChange = {(event) => handleFieldChange("location.northing", event)}
          />
        </div>
        <div className = "control">
          <label htmlFor = "easting">Easting:</label>
          <input
            id = "easting"
            type = "text"
            value = {formValues.location.easting || ""}
            onChange = {(event) => handleFieldChange("location.easting", event)}
          />
        </div>
      </div>

      <div className="control">
        <label htmlFor = "garden">Garden:</label>
        <select
          id = "garden"
          value = {formValues.garden}
          onChange = {(event) => handleFieldChange("garden", event)}
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
                type = "checkbox"
                name = {condition}
                checked = {formValues.siteData[condition] || false}
                onChange = {(event) => handleFieldChange("siteData", event)}
              />
              {condition.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
          ))}
        </div>
      </div>
    </form>
  );
};

//-------------------- combo- and check-box lists --------------------//
const gardenList = [
  "Community garden and lawn",
  "Dog lawn",
  "Drainage rill",
  "Fire pit",
  "Glenn garden and lawn",
  "Goodale entrance beds",
  "Hosta bed",
  "Main sign bed",
  "Meditation garden",
  "Parking-lot beds and lawn",
  "Ravine",
  "Pool lawn",
  "South lawn",
  "Urlin driveway bed north",
  "Urlin driveway bed south",
  "Woodland garden"
]

const siteInfoList = [
  "Slope",
  "OverheadLines",
  "TreeCluster",
  "ProximateStructure",
  "ProximateFence"
];

export default SiteDataForm;