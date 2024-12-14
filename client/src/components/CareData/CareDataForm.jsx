import { formatDateForDisplay } from "../../utils/dateHandler";
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Footer from "../Footer/Footer";

//set up an object with values from updatedTree or set the values to ""
const CareDataForm = () => {
  const { updatedTree, setUpdatedTree, formStyle } = useOutletContext();
  
  const [formValues, setFormValues] = useState(() => {

    return updatedTree || {
      species: {
        commonName: updatedTree?.species?.commonName || "",
        scientificName: updatedTree?.species?.scientificName || ""
      },
      variety: updatedTree?.variety || "",
      dbh: updatedTree?.dbh || "",
      photos: updatedTree?.photos || "",
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
      <div className="control">
        <label htmlFor = "lastVisited">Last visited:</label>
        <p>{formatDateForDisplay(formValues.lastVisited)}</p>
      </div>

      <div className = "control">
        <label htmlFor = "installedDate">Installed on:</label>
        <input 
          id = "installedDate"
          type = "text"
          defaultValue = {formatDateForDisplay(formValues.installedDate)}
          onChange = {(event) => handleFieldChange("installedDate", event)} 
        />
      </div>

      <div className = "control">
        <label htmlFor = "installedBy">Installed by:</label>
        <input
          id = "installedBy"
          type = "text"
          defaultValue = {formValues.installedBy || ""} 
          onChange = {(event) => handleFieldChange("installedBy", event)}
        />
      </div>

      <div className = "control">
        <label htmlFor = "felledDate">Felled on:</label>
        <input 
          id = "felledDate"
          type = "text"
          defaultValue = {formatDateForDisplay(formValues.felledDate)}
          onChange = {(event) => handleFieldChange("felledDate", event)} 
        />
      </div>

      <div className = "control">
        <label htmlFor = "felledBy">Felled by:</label>
        <input
          id = "felledBy"
          type = "text"
          defaultValue = {formValues.felledBy || ""} 
          onChange = {(event) => handleFieldChange("felledBy", event)}
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
                onChange = {(event) => handleFieldChange(`maintenanceNeeds.${need}`, event)} 
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
          onChange = {(event) => handleFieldChange("careHistory", event)} 
        />
      </div>
      <Footer />
    </form>
  );
};

const maintenanceNeedsList = [
  "install",
  "raiseCrown",
  "routinePrune",
  "trainingPrune",
  "priorityPrune",
  "pestTreatment",
  "installGrate",
  "removeGrate",
  "fell",
  "removeStump"
];

export default CareDataForm;