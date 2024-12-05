import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { formatDateForDisplay } from "../../utils/dateHandler";
import Footer from "../footer/footer";

//set up an object with values from selectedTree and set their values to ""
const CareDataForm = () => {
  const { selectedTree, updatedTree, setUpdatedTree, formStyle } = useOutletContext();
  
  const [formValues, setFormValues] = useState(() => {
    return updatedTree || {
      species: {
        commonName: selectedTree?.species?.commonName || "",
        scientificName: selectedTree?.species?.scientificName || ""
      },
      variety: selectedTree?.variety || "",
      dbh: selectedTree?.dbh || "",
      photos: selectedTree?.photos || null,
      notes: selectedTree?.notes || "",
      nonnative: selectedTree?.nonnative || false,
      invasive: selectedTree?.invasive || false,
      hidden: selectedTree?.hidden || false,
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
      hidden: selectedTree?.hidden || false,
      lastVisited: selectedTree?.lastVisited || "",
      installedDate: selectedTree?.installedDate || "",
      installedBy: selectedTree?.installedBy || "",
      felledDate: selectedTree?.felledDate || "",
      felledBy: selectedTree?.felledBy || "",
      maintenanceNeeds: {
        install: selectedTree?.maintenanceNeeds?.install || false,
        raiseCrown: selectedTree?.maintenanceNeeds?.raiseCrown || false,
        routinePrune: selectedTree?.maintenanceNeeds?.routinePrune || false,
        trainingPrune: selectedTree?.maintenanceNeeds?.trainingPrune || false,
        priorityPrune: selectedTree?.maintenanceNeeds?.priorityPrune || false,
        pestTreatment: selectedTree?.maintenanceNeeds?.pestTreatment || false,
        installGrate: selectedTree?.maintenanceNeeds?.installGrate || false,
        removeGrate: selectedTree?.maintenanceNeeds?.removeGrate || false,
        fell: selectedTree?.maintenanceNeeds?.fell || false,
        removeStump: selectedTree?.maintenanceNeeds?.removeStump || false
      }
    };
  });

  //sync form state with selectedTree when it changes
  useEffect(() => {
    if (!updatedTree && selectedTree) {
      setFormValues({
        species: {
          commonName: selectedTree.species?.commonName || "",
          scientificName: selectedTree.species?.scientificName || ""
        },
        variety: selectedTree.variety || "",
        dbh: selectedTree.dbh || "",
        photos: selectedTree.photos || "",
        notes: selectedTree.notes || "",
        nonnative: selectedTree.nonnative || false,
        invasive: selectedTree.invasive || false,
        hidden: selectedTree.hidden || false,
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
        hidden: selectedTree.hidden || false,
        lastVisited: selectedTree.lastVisited || "",
        installedDate: selectedTree.installedDate || "",
        installedBy: selectedTree.installedBy || "",
        felledDate: selectedTree.felledDate || "",
        felledBy: selectedTree.felledBy || "",
        maintenanceNeeds: {
          install: selectedTree.maintenanceNeeds?.install || false,
          raiseCrown: selectedTree.maintenanceNeeds?.raiseCrown || false,
          routinePrune: selectedTree.maintenanceNeeds?.routinePrune || false,
          trainingPrune: selectedTree.maintenanceNeeds?.trainingPrune || false,
          priorityPrune: selectedTree.maintenanceNeeds?.priorityPrune || false,
          pestTreatment: selectedTree.maintenanceNeeds?.pestTreatment || false,
          installGrate: selectedTree.maintenanceNeeds?.installGrate || false,
          removeGrate: selectedTree.maintenanceNeeds?.removeGrate || false,
          fell: selectedTree.maintenanceNeeds?.fell || false,
          removeStump: selectedTree.maintenanceNeeds?.removeStump || false
        }
      });
    }
  }, [selectedTree, updatedTree]);

 useEffect(() => {
    setUpdatedTree(formValues);
  }, [formValues, setUpdatedTree]);

//-------------------- handlers --------------------
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
      <div className="control">
        <label htmlFor = "lastVisited">Last visited:</label>
        <input
          id = "lastVisited"
          type = "text"
          defaultValue = {formatDateForDisplay(formValues.lastVisited)}
        />
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
          value = {formatDateForDisplay(formValues.felledDate)}
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
                type = "checkbox"
                name = {need}
                checked = {formValues.maintenanceNeeds[need] || false}
                onChange = {(event) => handleFieldChange("maintenanceNeeds", event)} 
              />
              {need.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
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
      {/* <Footer updatedTree = {updatedTree} setUpdatedTree = {setUpdatedTree} /> */}
      <Footer />
    </form>
  );
};

const maintenanceNeedsList = [
  "Install",
  "RaiseCrown",
  "RoutinePrune",
  "TrainingPrune",
  "PriorityPrune",
  "PestTreatment",
  "InstallGrate",
  "RemoveGrate",
  "Fell",
  "RemoveStump"
];

export default CareDataForm;