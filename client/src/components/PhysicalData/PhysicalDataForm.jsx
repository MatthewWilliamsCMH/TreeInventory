import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Footer from "../Footer/Footer";

//set up an object with values from updatedTree or set the values to ""
const PhysicalDataForm = () => {
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
      careHistory: updatedTree?.careHistory || false,
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
        careHistory: updatedTree.careHistory,
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

      // Special handling for species names
        if (field.startsWith('species.') && Object.keys(commonToScientificList).length > 0) {
          if (field === 'species.commonName') {
            const scientificFromCommon = commonToScientificList[effectiveValue];
            updatedValues = {
              ...updatedValues,
              species: {
                ...updatedValues.species,
                commonName: effectiveValue,
                scientificName: scientificFromCommon || ""
              }
            };
          } else if (field === 'species.scientificName') {
            const commonFromScientific = Object.keys(commonToScientificList)
              .find(common => commonToScientificList[common] === effectiveValue);
            updatedValues = {
              ...updatedValues,
              species: {
                ...updatedValues.species,
                scientificName: effectiveValue,
                commonName: commonFromScientific || ""
              }
            };
          }
        }

      // Handle nested fields (like species.commonName)
      else if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        updatedValues = {
          ...updatedValues,
          [parentField]: {
            ...updatedValues[parentField],
            [childField]: effectiveValue
          }
        };
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

      // Handle species name updates
      if (field.startsWith('species.') && Object.keys(commonToScientificList).length > 0) {
        if (field === 'species.commonName') {
          const scientificFromCommon = commonToScientificList[effectiveValue];
          return {
            ...prevTree,
            species: {
              ...prevTree.species,
              commonName: effectiveValue,
              scientificName: scientificFromCommon || ""
            }
          };
        }

        if (field === 'species.scientificName') {
          const commonFromScientific = Object.keys(commonToScientificList)
            .find(common => commonToScientificList[common] === effectiveValue);
          return {
            ...prevTree,
            species: {
              ...prevTree.species,
              scientificName: effectiveValue,
              commonName: commonFromScientific || ""
            }
          };
        }
      }

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

  //create species list of commonName and scientificName controls
  const speciesOptions = Object.keys(commonToScientificList).map(common => ({
    common,
    scientific: commonToScientificList[common]
  }));

  //-------------------- render component--------------------//
  return (
    <form style={formStyle}>
      <div className = "controlgroup">
        <label>Species</label>
        <div className = "control">
          <label htmlFor = "commonName">Common name:</label>
          <select
            id = "commonName"
            placeholder = "Select a common name."
            value = {formValues.species.commonName}
            onChange = {(event) => handleFieldChange("species.commonName", event)}
          >
            {speciesOptions.map((option) => (
              <option key = {option.common} value = {option.common}>
                {option.common}
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
            onChange = {(event) => handleFieldChange("species.scientificName", event)}
          >
            {speciesOptions.map((option) => (
              <option key = {option.scientific} value = {option.scientific}>
                {option.scientific}
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
          onChange = {(event) => handleFieldChange("variety", event)}
        />
      </div>

      <div className = "control">
        <label htmlFor = "dbh">DBH:</label>
        <select 
          id = "dbh" 
          placeholder = "Select a diameter."
          value = {formValues.dbh} 
          onChange = {event => handleFieldChange("dbh", event)} 
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
          <div className = "photo">
          </div>
          <div className = "photo">
          </div>
          <div className = "photo">
          </div>
          <div className = "photo">
          </div>
          <div className = "photo">
          </div>
        </div>
      </div>

      <div className = "control">
        <label htmlFor = "notes">Notes:</label>
        <textarea
          id = "notes"
          value = {formValues.notes}
          onChange = {(event) => handleFieldChange("notes", event)}
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
              onChange = {(event) => handleFieldChange("nonnative", event)}
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
              onChange = {(event) => handleFieldChange("invasive", event)}
            />Invasive
          </label>
        </div>
      </div>
      <Footer />
    </form>
  );
};

//-------------------- list- and combo-box lists --------------------//
//species should be pulled from db but allow user to create new
const commonToScientificList = {
  "": "",
  "American basswood": "Tilia americana",
  "American beech": "Fagus grandifolia",
  "American chestnut": "Castanea dentata",
  "American elm": "Ulmus americana",
  "American sycamore": "Platanus occidentalis",
  "Austrian pine": "Pinus nigra",
  "Bigtooth aspen": "Populus grandidentata",
  "Bitternut hickory": "Carya cordiformis",
  "Black birch": "Betula lenta",
  "Black cherry": "Prunus serotina",
  "Black locust": "Robinia pseudoacacia",
  "Black maple": "Acer nigrum",
  "Black oak": "Quercus velutina",
  "Black walnut": "Juglans nigra",
  "Black willow": "Salix nigra",
  "Blackgum": "Nyssa sylvatica",
  "Blackhaw": "Viburnum prunifolium", //nonnative
  "Blue spruce": "Picea pungens",
  "Boxelder": "Acer negundo",
  "Bur oak": "Quercus macrocarpa",
  "Butternut": "Juglans cinerea",
  "Callery pear": "Pyrus calleryana", //invasive, nonnative
  "Chestnut oak": "Quercus montana",
  "Chinkapin oak": "Quercus muehlenbergii",
  "Crabapple": "Malus", //nonnative
  "Cucumbertree": "Magnolia acuminata",
  "Eastern cottonwood": "Populus deltoides",
  "Eastern hemlock": "Tsuga canadensis",
  "Eastern red cedar": "Juniperus virginiana",
  "Eastern redbud": "Cercis canadensis",
  "Eastern white pine": "Pinus strobus",
  "Ginkgo": "Gingko biloba", //nonnative
  "Green ash": "Fraxinus pennsylvanica",
  "Hackberry": "Celtis occidentalis",
  "Hawthorn": "Crataegus", //nonnative
  "Honey locust": "Gleditsia triacanthos",
  "Horse chestnut": "Aesculus hippocastanum",
  "Japanese lilac tree": "Syringa reticulata", //nonnative
  "Japanese maple": "Acer palmatum var. atropurpureum",
  "Kentucky coffeetree": "Gymnocladus dioicus",
  "Little leaf linden": "Tilia cordata", //nonnative
  "Loblolly pine": "Pinus taeda",
  "Mockernut hickory": "Carya tomentosa",
  "Northern catalpa": "Catalpa speciose",
  "Northern pecan": "Carya illinoiensis", //nonnative
  "Northern red oak": "Quercus rubra",
  "Norway maple": "Acer platanoides",
  "Norway spruce": "Picea abies",
  "Ohio buckeye": "Aesculus glabra",
  "Osage orange": "Maclura pomifera",
  "Persimmon": "Diospyros virginiana",
  "Pignut hickory": "Carya glabra",
  "Pin oak": "Quercus palustris",
  "Pink dogwood": "Cornus florida", //nonnative
  "Pitch pine": "Pinus rigida",
  "Red horse-chestnut": "Aesculus carnea", //nonnative
  "Red maple": "Acer rubrum",
  "Red mulberry": "Morus rubra",
  "Red pine": "Pinus resinosa",
  "River birch": "Betula nigra",
  "Sassafrass": "Sassafras albidum",
  "Saucer Magnolia": "Magnolia x soulangeana",
  "Sawtooth oak": "Quercus acutissima", //invasive, nonnative
  "Scarlet oak": "Quercus coccinea",
  "Scotch pine": "Pinus sylvetris",
  "Scrub hickory": "Carya floridana",
  "Shagbark hickory": "Carya ovata",
  "Shellbark hickory": "Carya laciniosa",
  "Shingle oak": "Quercus imbricaria",
  "Shortleaf pine": "Pinus echinata",
  "Shumard oak": "Quercus shumardii",
  "Siberian elm": "Ulmus pumila", //invasive, nonnative
  "Silver maple": "Acer saccharinum",
  "Slippery elm": "Ulmus rubra",
  "Sugar maple": "Acer saccharum",
  "Swamp white oak": "Quercus bicolor",
  "Sweetbay magnolia": "Magnolia virginiana",
  "Sweetgum": "Liquidambar styraciflua",
  "Tree of heaven": "Ailanthus altissima", //invasive, nonnative
  "Unknown species": "Unknown species",
  "Virginia pine": "Pinus virginiana",
  "Weeping cherry": "Prunus pendula",
  "White ash": "Fraxinus americana",
  "White mulberry": "Morus alba", //invasive, nonnative
  "White oak": "Quercus alba",
  "Yellow birch": "Betula alleghaniensis",
  "Yellow buckeye": "Aesculus flava",
  "Yellow poplar": "Liriodendron tulipifera"
}

const dbhList = [
  "",
  "< 3", 
  "3-6", 
  "7-12", 
  "13-18", 
  "19-24", 
  "25-30", 
  "31-36", 
  "37-42", 
  "> 42"
];

export default PhysicalDataForm;