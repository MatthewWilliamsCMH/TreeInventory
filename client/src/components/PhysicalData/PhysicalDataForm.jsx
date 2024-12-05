import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Footer from "../footer/footer";

//set up an object with values from selectedTree and set their values to ""
const PhysicalDataForm = () => {
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
      })
    }
  }, [selectedTree, updatedTree]);

 useEffect(() => {
    setUpdatedTree(formValues);
  }, [formValues, setUpdatedTree]);

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
 
  //create species list of commonName and scientificName controls
  const speciesOptions = Object.keys(commonToScientificList).map(common => ({
    common,
    scientific: commonToScientificList[common]
  }));

  const handleCommonChange = (event) => {
    const selectedCommonName = event.target.value;
    const scientificFromCommon = commonToScientificList[selectedCommonName];

    setFormValues(prevValues => ({
      ...prevValues,
      species: {
        commonName: selectedCommonName,
        scientificName: scientificFromCommon || "",
      },
    }));
  };

  const handleScientificChange = (event) => {
    const selectedScientificName = event.target.value;
    const commonFromScientific = Object.keys(commonToScientificList).find(
      (common) => commonToScientificList[common] === selectedScientificName
    );

    setFormValues(prevValues => ({
      ...prevValues,
      species: {
        commonName: commonFromScientific || "",
        scientificName: selectedScientificName,
      }
    }));
  };

  // // Handle the form submission
  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   // Only update selectedTree after the user submits the form
  //   setSelectedTree(updatedTree);
  // };
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
            onChange = {handleCommonChange}
          >
            {speciesOptions.map((option) => (
              <option key = {option.common} value = {option.common}>
                {option.common}
              </option>
            ))}
          </select>
        </div>
        <div className = "control">
          <label htmlFor = "speciesName">Scientific name:</label>
          <select
            id = "scientificName"
            value = {formValues.species.scientificName}
            onChange = {handleScientificChange}
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
      {/* <Footer updatedTree = {updatedTree} setUpdatedTree = {setUpdatedTree} /> */}
      <Footer />
    </form>
  );
};

//-------------------- list- and combo-box lists --------------------//
//species should be pulled from db but allow user to create new
const commonToScientificList = {
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
  "Tree of Heaven": "Ailantus altissima", //invasive, nonnative
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