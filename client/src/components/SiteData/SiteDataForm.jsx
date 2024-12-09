import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Footer from "../footer/footer";

//set up an object with values from selectedTree and set their values to ""
const siteDataForm = () => {
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
      hidden: updatedTree?.hidden || false,
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
      // nonnative: updatedTree?.nonnative || false,
      // invasive: updatedTree?.invasive || false,
      // hidden: updatedTree?.hidden || false,
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
      }
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
        hidden: updatedTree.hidden || false,
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
        // nonnative: updatedTree.nonnative || false,
        // invasive: updatedTree.invasive || false,
        // hidden: updatedTree.hidden || false,
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
        }
      })
    }
  }, [updatedTree]);

//  useEffect(() => {
//     setUpdatedTree(formValues);
//   }, [formValues, setUpdatedTree]);

//-------------------- handlers --------------------
  // generic handler for controls
  const handleFieldChange = (field, value) => {
    setFormValues(prevValues => {
      let newValues;

      if (field.includes(".")) {
        const [parentField, childField] = field.split(".");
        newValues = {
          ...prevValues,
          [parentField]: {
            ...prevValues[parentField],
            [childField]: value.target ? value.target.value : value
          }
        };
      }
      //handle grouped checkboxes
      else if (typeof prevValues[field] === "object" && prevValues[field] !== null) {
        const inputType = value.target ? value.target.type : null;
        
        if (inputType === "checkbox") {
          newValues = {
            ...prevValues,
            [field]: {
              ...prevValues[field],
              [value.target.name]: value.target.checked
            }
          };
        }
      }
      //handle ungrouped checkboxes
      else if (value.target && value.target.type === "checkbox") {
        newValues = {
          ...prevValues,
          [field]: value.target.checked
        };
      }
      //handle standard inputs, selects, and direct value assignments
      else {
        newValues = {
          ...prevValues,
          [field]: value.target ? value.target.value : value
        };
      }

      // Update selectedTree
      // setSelectedTree(prevTree => ({
      //   ...prevTree,
      //   ...(field.includes(".") 
      //     ? { [field.split(".")[0]]: newValues[field.split(".")[0]] } 
      //     : { [field]: newValues[field] }
      //   )
      // }));
      // setUpdatedTree(newValues)

      return newValues;
    });
  };
  // // generic handler for controls
  // const handleFieldChange = (field, value) => {
  //   setFormValues(prevValues => {
  //     if (field.includes(".")) {
  //       const [parentField, childField] = field.split(".");
  //       return {
  //         ...prevValues,
  //         [parentField]: {
  //           ...prevValues[parentField],
  //           [childField]: value.target ? value.target.value : value
  //         }
  //       };
  //     }
      
  //     //handle grouped checkboxes
  //     if (typeof prevValues[field] === "object" && prevValues[field] !== null) {
  //       const inputType = value.target ? value.target.type : null;
        
  //       if (inputType === "checkbox") {
  //         return {
  //           ...prevValues,
  //           [field]: {
  //             ...prevValues[field],
  //             [value.target.name]: value.target.checked
  //           }
  //         };
  //       }
  //     }

  //     //handle ungrouped checkboxes
  //     if (value.target && value.target.type === "checkbox") {
  //       return {
  //         ...prevValues,
  //         [field]: value.target.checked
  //       };
  //     }
      
  //     //handle standard inputs, selects, and direct value assignments
  //     return {
  //       ...prevValues,
  //       [field]: value.target ? value.target.value : value
  //     };
  //   });
  // };

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
                checked = {formValues.siteInfo[condition] || false}
                onChange = {(event) => handleFieldChange("siteInfo", event)}
              />
              {condition.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
          ))}
        </div>
      </div>
      {/* <Footer updatedTree = {updatedTree} setUpdatedTree = {setUpdatedTree} /> */}
      <Footer />
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

export default siteDataForm;