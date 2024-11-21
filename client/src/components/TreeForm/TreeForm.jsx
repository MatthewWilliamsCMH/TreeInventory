import React, { useState, useEffect } from "react";
import "./TreeForm.css"

//This should be pulled from the database in the production app, and the object should indicate native or nonnative. These are all native except as marked.
const commonToScientificList = {
  "American beech": "Fagus grandifolia",
  "American chestnut": "Castanea dentata",
  "Black oak": "Quercus velutina", 
  "Bur oak": "Quercus macrocarpa",
  "Chestnut oak": "Quercus montana",
  "Chinkapin oak": "Quercus muehlenbergii",
  "Northern red oak": "Quercus rubra",
  "Pin oak": "Quercus palustris",
  "Scarlet oak": "Quercus coccinea",
  "Shingle oak": "Quercus imbricaria",
  "Shumard oak": "Quercus shumardii",
  "Swamp white oak": "Quercus bicolor",
  "White oak": "Quercus alba",
  "Black locust": "Robinia pseudoacacia",
  "Honeylocust": "Gleditsia triacanthos",
  "Kentucky coffeetree": "Gymnocladus dioicus",
  "Northern catalpa": "Catalpa speciose",
  "Black birch": "Betula lenta",
  "River birch": "Betula nigra",
  "Yellow birch": "Betula alleghaniensis",
  "American elm": "Ulmus americana",
  "Hackberry": "Celtis occidentalis",
  "Slippery elm": "Ulmus rubra",
  "Persimmon": "Diospyros virginiana",
  "Ohio buckeye": "Aesculus glabra",
  "Yellow buckeye": "Aesculus flava",
  "Sassafrass": "Sassafras albidum",
  "American basswood": "Tilia americana",
  "Cucumbertree": "Magnolia acuminata",
  "Yellow poplar": "Liriodendron tulipifera",
  "Surgar maple": "Acer saccharum",
  "Red maple": "Acer rubrum",
  "Silver maple": "Acer saccharinum",
  "Boxelder": "Acer negundo",
  "Osage orange": "Maclura pomifera",
  "Red mulberry": "Morus rubra",
  "Green ash": "Fraxinus pennsylvanica",
  "White ash": "Fraxinus americana",
  "American sycamore": "Platanus occidentalis",
  "Black cherry": "Prunus serotina",
  "Blackgum": "Nyssa sylvatica",
  "Butternut": "Juglans cinerea",
  "Black walnut": "Juglans nigra",
  "Bitternut hickory": "Carya cordiformis",
  "Mockernut hickory": "Carya tomentosa",
  "Pignut hickory": "Carya glabra",
  "Shagbark hickory": "Carya ovata",
  "Shellbark hickory": "Carya laciniosa",
  "Bigtooth aspen": "Populus grandidentata",
  "Black willow": "Salix nigra",
  "Eastern cottonwood": "Populus deltoides",
  "Sweetgum": "Liquidambar styraciflua",
  "Colorado blue spruce": "Picea pungens",
  "Norway spruce": "Picea abies",
  "Eastern hemlock": "Tsuga canadensis",
  "Austrian pine": "Pinus nigra",
  "Eastern white pine": "Pinus strobus",
  "Loblolly pine": "Pinus taeda",
  "Pitch pine": "Pinus rigida",
  "Red pine": "Pinus resinosa",
  "Scotch pine": "Pinus sylvetris",
  "Shortleaf pine": "Pinus echinata",
  "Virginia pine": "Pinus virginiana",
  "Eastern red cedar": "Juniperus virginiana",
  "Callery pear": "Pyrus calleryana", //invasive, nonnative
  "Sawtooth oak": "Quercus acutissima", //invasive, nonnative
  "Siberian elm": "Ulmus pumila", //invasive, nonnative
  "Tree-of-Heaven": "Ailantus altissima", //invasive, nonnative
  "White mulberry": "Morus alba", //invasive, nonnative
  "Northern pecan": "Carya illinoiensis", //nonnative
  "Ginkgo": "Gingko biloba", //nonnative
  "Hawthorn": "Crataegus", //nonnative
  "Crabapple": "Malus", //nonnative
  "Eastern Redbud": "Cercis canadensis", //nonnative
  "Little leaf linden": "Tilia cordata", //nonnative
  "Pink dogwood": "Cornus florida", //nonnative
  "Blackhaw": "Viburnum prunifolium", //nonnative
  "Red horse-chestnut": "Aesculus carnea", //nonnative
  "Japanese lilac tree": "Syringa reticulata", //nonnative
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
const gardenList = [
  "community garden and lawn", 
  "dog lawn", 
  "drainage rill", 
  "fire pit", 
  "Glenn garden and lawn", 
  "Goodale entrance beds", 
  "hosta bed", 
  "main sign bed", 
  "meditation garden", 
  "parking-lot beds and lawn", 
  "ravine",
  "pool lawn", 
  "south lawn", 
  "Urlin driveway bed north", 
  "Urlin driveway bed south", 
  "woodland garden"
]

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

const siteInfoList = [
  "slope",
  "overheadLines",
  "treeCluster",
  "proximateStructure",
  "proximateFence"
];


const TreeForm = ({ selectedTree, setSelectedTree }) => {
  //populate the drop-down combo boxes
  const speciesOptions = Object.keys(commonToScientificList).map(common => ({
    common,
    scientific: commonToScientificList[common]
  }));

  useEffect(() => {
    setCommonNameValue(selectedTree.species.commonName);
    setScientificNameValue(selectedTree.species.scientificName);
  }, [selectedTree]);

  const handleCommonChange = (event) => {
    const selectedCommonName = event.target.value;
    setCommonNameValue(selectedCommonName);

    const scientificFromCommon = commonToScientificList[selectedCommonName];
    console.log(scientificFromCommon)
    setScientificNameValue(scientificFromCommon || "");
  };

  const handleScientificChange = (event) => {
    const selectedScientificName = event.target.value;
    setScientificNameValue(selectedScientificName);

    const commonFromScientific = Object.keys(commonToScientificList).find(
      common => commonToScientificList[common] === selectedScientificName
    );
    setCommonNameValue(commonFromScientific || "");
  };

  const handleDbhChange = (event => {
    const selectedDbh = event.target.value;
    setDbhValue(selectedDbh)
  });

  const handleGardenChange = (event => {
    const selectedGarden = event.target.value;
    setGardenValue(selectedGarden)
  })

  const handleMaintenanceNeedChange = (event) => {
    const { name, checked } = event.target;
    setMaintenanceNeedsValue(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleSiteInfoChange = (event) => {
    const { name, checked } = event.target;
    setSiteInfoValue(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  //destructure selectedTree
  let  {
    id,
    lastVisited,
    species,
    variety,
    garden,
    location,
    dbh,
    installedDate,
    installedBy,
    felledDate,
    felledBy,
    nonnative,
    invasive,
    maintenanceNeeds,
    siteInfo,
    careHistory,
    notes,
    photos
  } = selectedTree;

  //destructure the complex fields from selectedTree
  const { commonName, scientificName } = species;
  const { northing, easting } = location || {};
  
  const [idValue, setIdValue] = useState(id);
  const [lastVisitedDate, setLastVisitedDate] = useState(lastVisited || "");
  const [commonNameValue, setCommonNameValue] = useState(commonName || "");
  const [scientificNameValue, setScientificNameValue] = useState(scientificName || "");
  const [varietyValue, setVarietyValue] = useState(variety || "");
  const [gardenValue, setGardenValue] = useState(garden || "");
  const [northingValue, setNorthingValue] = useState(northing || "");
  const [eastingValue, setEastingValue] = useState(easting || "");
  const [dbhValue, setDbhValue] = useState(dbh || "");
  const [installedDateDate, setInstalledDateDate] = useState(installedDate || "");
  const [installedByValue, setInstalledByValue] = useState(installedBy || "");
  const [felledDateDate, setFelledDateDate] = useState(felledDate || "");
  const [felledByValue, setFelledByValue] = useState(felledBy || "");
  const [nonnativeValue, setNonnativeValue] = useState(nonnative || false);
  const [invasiveValue, setInvasiveValue] = useState(invasive || false);
  const [maintenanceNeedsValue, setMaintenanceNeedsValue] = useState(maintenanceNeeds || {});
  const [siteInfoValue, setSiteInfoValue] = useState(siteInfo || {});
  const [careHistoryValue, setCareHistoryValue] = useState(careHistory || "");
  const [notesValue, setNotesValue] = useState(notes || "");
  const [photosValue, setPhotosValue] = useState(photos || "");

  useEffect(() => {
    if (selectedTree) {
      setIdValue(id);
      setLastVisitedDate(lastVisited || "");
      setCommonNameValue(commonName || "");
      setScientificNameValue(scientificName || "");
      setVarietyValue(variety || "");
      setGardenValue(garden || "");
      setNorthingValue(northing || "");
      setEastingValue(easting || "");
      setDbhValue(dbh || "");
      setInstalledDateDate(installedDate || "");
      setInstalledByValue(installedBy || "");
      setFelledDateDate(felledDate || "");
      setFelledByValue(felledBy || "");
      setNonnativeValue(nonnative || false);
      setInvasiveValue(invasive || false);
      setMaintenanceNeedsValue(maintenanceNeeds || "");
      setSiteInfoValue(siteInfo || "");
      setCareHistoryValue(careHistory || "");
      setNotesValue(notes || "");
      setPhotosValue(photos || "");
    }
  }, [selectedTree])

  return (
    <div id="treeForm">
      <form>
        <div className="columns">
          <div className="column">
            <div>
              <label>Id:</label>
              <input type="text" value={id || ""} className="textinput"/>
            </div>

            <div>
              <label>Last visited:</label>
              <input type="text" value = {new Date(Number(lastVisited) || lastVisited).toLocaleString("en-US") || ""} className="textinput"/>
            </div>

            <div className="controlgroup">
              <label>Species</label>
              <div className="subcategory">
                <label>Common name:</label> 
                <select id="commonName" value={commonNameValue} onChange={handleCommonChange}>
                  {speciesOptions.map((option) => (
                    <option key={option.common} value={option.common}>
                      {option.common}
                    </option>
                  ))}
                </select>
              </div>
              <div className="subcategory">
                <label>Scientific name:</label> 
                <select id="scientificName" value={scientificNameValue} onChange={handleScientificChange}>
                  {speciesOptions.map((option) => (
                    <option key={option.scientific} value={option.scientific}>
                      {option.scientific}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label>Variety or cultivar:</label>
              <input type="text" value={variety || ""} className="textinput"/>
            </div>
          
            <div>
              <label>DBH:</label>
              <select id="dbh" defaultValue={dbhValue}>
                {dbhList.map((dbh, index) => (
                  <option key={index} value={dbh}>
                    {dbh}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Garden:</label>
              <select id="garden" defaultValue={gardenValue}>
                {gardenList.map((garden, index) => (
                  <option key={index} value={garden}>
                    {garden}
                  </option>
                ))}
              </select>
            </div>

            <div className="controlgroup">
              <label>Location</label>
              <div className="subcategory">
                <label>Northing:</label>
                <input type="text" value={northing || ""} className="textinput"/>
              </div>
              <div className="subcategory">
                <label>Easting:</label>
                <input type="text" value={easting || ""} className="textinput"/>
              </div>
            </div>

            <div>
              <label>Installed on:</label>
              <input type="text" value={new Date(Number(installedDate) || installedDate).toLocaleString("en-US") || ""} className="textinput"/>
            </div>
          
            <div>
              <label>Installed by:</label>
              <input type="text" value={installedBy || ""} className="textinput"/>
            </div>

            <div>
              <label>Felled on:</label>
              <input type="text" value={new Date(Number(felledDate) || felledDate).toLocaleString("en-US") || ""} className="textinput"/>
            </div>
          
            <div>
              <label>Felled by:</label>
              <input type="text" value={felledBy || ""} className="textinput"/>
            </div>
          </div>

          <div className="column">
            <div className="danger">
              <label>
                <input type="checkbox" defaultChecked={nonnativeValue || false} />
                <b>Nonnative</b>
              </label>
              <label>
                <input type="checkbox" defaultChecked={invasiveValue || false} />
                <b>Invasive</b>
              </label>
            </div>

            <p><b>Photos:</b>
            </p>

            <div className="controlgroup">
              <label>Maintenance needs:</label>
              <div className="checkboxgroup">
                {maintenanceNeedsList.map((need) => (
                  <label key={need}>
                  <input type="checkbox" name={need} defaultChecked={maintenanceNeedsValue[need] || false} onChange={handleMaintenanceNeedChange} />
                    {need.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                ))}
              </div>
            </div>

            <div className="controlgroup">
              <label>Site info</label>
              <div className="checkboxgroup">
                {siteInfoList.map((condition) => (
                  <label key={condition}>
                  <input type="checkbox" condition={condition} defaultChecked={siteInfoValue[condition] || false} onChange={handleSiteInfoChange} />
                    {condition.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
            <div>
              <label>Care history:</label>
              <textarea>{careHistory || ""}</textarea>
            </div>

            <div>
              <label>Notes:</label>
              <textarea>{notes || ""}</textarea>
            </div>
        </div>

        <button>Ok</button>
        <button>Cancel</button>
      </form>
    </div>
  );
};

export default TreeForm;