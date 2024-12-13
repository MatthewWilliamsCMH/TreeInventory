import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Footer from "../Footer/Footer";

//set up an object with values from updatedTree or set the values to ""
const SiteDataForm = () => {
  const { updatedTree, setUpdatedTree, formStyle } = useOutletContext();
  
  const [formValues, setFormValues] = useState(() => {

    return updatedTree || {
      species: {
        commonName: updatedTree?.species?.commonName || "",
        scientificName: updatedTree?.species?.scientificName || ""
      },
      variety: updatedTree?.variety || "",
      dbh: updatedTree?.dbh || "",
      photos: updatedTree?.photos || null,
      notes: updatedTree?.notes || "",
      nonnative: updatedTree?.nonnative || false,
      invasive: updatedTree?.invasive || false,
      location: {
        northing: updatedTree?.location?.northing || "",
        easting: updatedTree?.location?.easting || ""
      },
      garden: updatedTree?.garden || "",
      siteInfo: {
        slope: updatedTree?.siteInfo?.slope || false,
        overheadLines: updatedTree?.siteInfo?.overhadeLines || false,
        treeCluster: updatedTree?.siteInfo?.treeCluster || false,
        proximateStructure: updatedTree?.siteInfo?.proximateStructure || false,
        proximateFence: updatedTree?.siteInfo?.proximateFence || false
      },
      lastVisited: updatedTree?.lastVisited || "",
      installedDate: updatedTree?.installedDate || "",
      installedBy: updatedTree?.installedBy || "",
      felledDate: updatedTree?.felledDate || "",
      felledBy: updatedTree?.felledBy || "",
      maintenanceNeeds: {
        install: updatedTree?.maintenanceNeeds?.install || false,
        raiseCrown: updatedTree?.maintenanceNeeds?.raiseCrown || false,
        routinePrune: updatedTree?.maintenanceNeeds?.routinePrune || false,
        trainingPrune: updatedTree?.maintenanceNeeds?.trainingPrune || false,
        priorityPrune: updatedTree?.maintenanceNeeds?.priorityPrune || false,
        pestTreatment: updatedTree?.maintenanceNeeds?.pestTreatment || false,
        installGrate: updatedTree?.maintenanceNeeds?.installGrate || false,
        removeGrate: updatedTree?.maintenanceNeeds?.removeGrate || false,
        fell: updatedTree?.maintenanceNeeds?.fell || false,
        removeStump: updatedTree?.maintenanceNeeds?.removeStump || false
      },
      careHistory: updatedTree?.careHistory || "",
      hidden: updatedTree?.hidden || false
    };
  });

  //sync form state with updatedTree when it changes
  useEffect(() => {
    if (updatedTree) {
      setFormValues({
        species: {
          commonName: updatedTree.species?.commonName || "",
          scientificName: updatedTree.species?.scientificName || ""
        },
        variety: updatedTree.variety || "",
        dbh: updatedTree.dbh || "",
        photos: updatedTree.photos || "",
        notes: updatedTree.notes || "",
        nonnative: updatedTree.nonnative || false,
        invasive: updatedTree.invasive || false,
        location: {
          northing: updatedTree.location?.northing || "",
          easting: updatedTree.location?.easting || ""
        },
        garden: updatedTree.garden || "",
        siteInfo: {
          slope: updatedTree?.siteInfo?.slope || false,
          overheadLines: updatedTree?.siteInfo?.overheadLines || false,
          treeCluster: updatedTree?.siteInfo?.treeCluster || false,
          proximateStructure: updatedTree?.siteInfo?.proximateStructure || false,
          proximateFence: updatedTree?.siteInfo?.proximateFence || false
        },
        lastVisited: updatedTree.lastVisited || "",
        installedDate: updatedTree.installedDate || "",
        installedBy: updatedTree.installedBy || "",
        felledDate: updatedTree.felledDate || "",
        felledBy: updatedTree.felledBy || "",
        maintenanceNeeds: {
          install: updatedTree.maintenanceNeeds?.install || false,
          raiseCrown: updatedTree.maintenanceNeeds?.raiseCrown || false,
          routinePrune: updatedTree.maintenanceNeeds?.routinePrune || false,
          trainingPrune: updatedTree.maintenanceNeeds?.trainingPrune || false,
          priorityPrune: updatedTree.maintenanceNeeds?.priorityPrune || false,
          pestTreatment: updatedTree.maintenanceNeeds?.pestTreatment || false,
          installGrate: updatedTree.maintenanceNeeds?.installGrate || false,
          removeGrate: updatedTree.maintenanceNeeds?.removeGrate || false,
          fell: updatedTree.maintenanceNeeds?.fell || false,
          removeStump: updatedTree.maintenanceNeeds?.removeStump || false
        },
        careHistory: updatedTree.careHistory || "",
        hidden: updatedTree.hidden || false
      })
    }
  }, [updatedTree]); 

//-------------------- handlers --------------------
  // generic handler for controls
  const getEffectiveValue = (val) => {
    if (val && val.target) {
      const target = val.target;
      switch (target.type) {
        case 'checkbox':
          return target.checked;
        case 'select-multiple':
          return Array.from(target.selectedOptions).map(option => option.value);
        default:
          return target.value;
      }
    }
    return val;
  };

  const handleFieldChange = (field, value) => {
    setFormValues(prevValues => {
      const effectiveValue = getEffectiveValue(value);
      let updatedValues = { ...prevValues };

      // Handle nested fields (like species.commonName)
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        updatedValues = {
          ...updatedValues,
          [parentField]: {
            ...updatedValues[parentField],
            [childField]: effectiveValue
          }
        };
      }

      // Handle grouped checkboxes
      else if (typeof prevValues[field] === 'object' && prevValues[field] !== null) {
        if (value.target && value.target.type === 'checkbox') {
          updatedValues = {
            ...updatedValues,
            [field]: {
              ...updatedValues[field],
              [value.target.name]: value.target.checked
            }
          };
        }
      }
      
      // Standard field update
      else {
        updatedValues = {
          ...updatedValues,
          [field]: effectiveValue
        };
      }
      return updatedValues;
    });

    // Update updatedTree
    setUpdatedTree(prevTree => {
      const effectiveValue = getEffectiveValue(value);

      // Handle nested updates
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        return {
          ...prevTree,
          [parentField]: {
            ...prevTree[parentField],
            [childField]: effectiveValue
          }
        };
      }

      // Standard field update
      return {
        ...prevTree,
        [field]: effectiveValue
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
                className = "nestedcheckbox"
                type = "checkbox"
                name = {condition}
                checked = {formValues.siteInfo[condition] || false}
                onChange = {(event) => handleFieldChange(`siteInfo.${condition}`, event)}
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

//-------------------- combo- and check-box lists --------------------//
const gardenList = [
  "",
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
  "slope",
  "overheadLines",
  "treeCluster",
  "proximateStructure",
  "proximateFence"
];

export default SiteDataForm;