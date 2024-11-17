import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
// import { useForm } from "react-hook-form";

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
        <p>Id: {id}</p>
        <p>Last visited: {new Date(Number(lastVisited) || lastVisited).toLocaleString("en-US")}</p>
        <p>Species</p>
        <ul>
          <li>Common name: 
            <select id="commonName" value={commonNameValue} onChange={handleCommonChange}>
              {speciesOptions.map((option) => (
                <option key={option.common} value={option.common}>
                  {option.common}
                </option>
              ))}
            </select>
          </li>
          <li>Scientific name: 
            <select id="scientificName" value={scientificNameValue} onChange={handleScientificChange}>
              {speciesOptions.map((option) => (
                <option key={option.scientific} value={option.scientific}>
                  {option.scientific}
                </option>
              ))}
            </select>
          </li>
        </ul>
        <p>Variety or cultivar: {variety}</p>
        <p>DBH:
          <select id="dbh" defaultValue={dbhValue}>
            {dbhList.map((dbh, index) => (
              <option key={index} value={dbh}>
                {dbh}
              </option>
            ))}
          </select>
        </p>
        <p>Garden:
          <select id="garden" defaultValue={gardenValue}>
            {gardenList.map((garden, index) => (
              <option key={index} value={garden}>
                {garden}
              </option>
            ))}
          </select>
        </p>
        <p>Location</p>
        <ul>
          <li>Northing: {northing}</li>
          <li>Easting: {easting}</li>
        </ul>
        {/* <p>DBH: {dbh}</p> this needs to be an option list */}
        <p>Installed on: {new Date(Number(installedDate) || installedDate).toLocaleString("en-US")}</p>
        <p>Installed by: {installedBy}</p>
        <p>Felled on: {new Date(Number(felledDate) || felledDate).toLocaleString("en-US")}</p>
        <p>Felled by: {felledBy}</p>
        <p>Care hitory: {careHistory}</p>
        <p>Notes: {notes}</p>
      </form>
    </div>
  );
};

export default TreeForm;

//ChatGPT provided this. Adapt
// import React, { useState, useEffect } from "react";

// // Destructure props directly to get the individual tree fields
// const TreeForm = ({ selectedTree, setSelectedTree }) => {
//   // Destructure selectedTree into individual variables
//   const {
//     id,
//     lastVisited,
//     species,
//     variety,
//     garden,
//     location,
//     dbh,
//     installedDate,
//     installedBy,
//     felledDate,
//     felledBy,
//     maintenanceNeeds,
//     siteInfo,
//     careHistory,
//     notes,
//     photos
//   } = selectedTree;

//   // Default state for the form values
//   const [commonName, setCommonName] = useState(species?.commonName || "");
//   const [scientificName, setScientificName] = useState(species?.scientificName || "");
//   const [lastVisitedDate, setLastVisitedDate] = useState(lastVisited || "");
//   const [dbhValue, setDbhValue] = useState(dbh || "");
//   const [gardenValue, setGardenValue] = useState(garden || "");
//   const [varietyValue, setVarietyValue] = useState(variety || "");
//   const [careHistoryValue, setCareHistoryValue] = useState(careHistory || "");
//   const [notesValue, setNotesValue] = useState(notes || "");

//   // More states for maintenance needs and site info can be handled similarly
//   const [maintenance, setMaintenance] = useState(maintenanceNeeds || {});
//   const [site, setSite] = useState(siteInfo || {});


//++++++++++++++++++++++++++++++++I've adapted through here+++++++++++++++++++++++++++++++++++++


//   useEffect(() => {
//     if (selectedTree) {
//       setCommonName(species?.commonName || "");
//       setScientificName(species?.scientificName || "");
//       setLastVisitedDate(lastVisited || "");
//       setDbhValue(dbh || "");
//       setGardenValue(garden || "");
//       setVarietyValue(variety || "");
//       setCareHistoryValue(careHistory || "");
//       setNotesValue(notes || "");
//       setMaintenance(maintenanceNeeds || {});
//       setSite(siteInfo || {});
//     }
//   }, [selectedTree]);

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     // You can call a function to update the tree, such as handleUpdateTree
//     // Example: handleUpdateTree(id, { lastVisited: lastVisitedDate, maintenanceNeeds: maintenance });
//   };

//   const handleMaintenanceChange = (field) => {
//     setMaintenance(prev => ({
//       ...prev,
//       [field]: !prev[field]  // Toggle the value (true/false)
//     }));
//   };

//   return (
//     <div id="treeForm">
//       <form onSubmit={handleSubmit}>
//         <p>Tree ID: {id}</p>
        
//         <div>
//           <label>Common Name</label>
//           <input type="text" value={commonName} onChange={(e) => setCommonName(e.target.value)} />
//         </div>

//         <div>
//           <label>Scientific Name</label>
//           <input type="text" value={scientificName} onChange={(e) => setScientificName(e.target.value)} />
//         </div>

//         <div>
//           <label>Last Visited</label>
//           <input
//             type="date"
//             value={lastVisitedDate}
//             onChange={(e) => setLastVisitedDate(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>DBH (Diameter at Breast Height)</label>
//           <input
//             type="text"
//             value={dbhValue}
//             onChange={(e) => setDbhValue(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>Variety</label>
//           <input
//             type="text"
//             value={varietyValue}
//             onChange={(e) => setVarietyValue(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>Garden</label>
//           <input
//             type="text"
//             value={gardenValue}
//             onChange={(e) => setGardenValue(e.target.value)}
//           />
//         </div>

//         {/* Maintenance Needs */}
//         <div>
//           <label>Maintenance Needs</label>
//           {["install", "fell", "priorityPrune", "routinePrune", "pestTreatment"].map((need) => (
//             <div key={need}>
//               <input
//                 type="checkbox"
//                 checked={maintenance[need] || false}
//                 onChange={() => handleMaintenanceChange(need)}
//               />
//               <label>{need}</label>
//             </div>
//           ))}
//         </div>

//         {/* Site Info */}
//         <div>
//           <label>Site Info</label>
//           <div>
//             <input
//               type="checkbox"
//               checked={site?.slope || false}
//               onChange={() => setSite({ ...site, slope: !site.slope })}
//             />
//             <label>Slope</label>
//           </div>
//           <div>
//             <input
//               type="checkbox"
//               checked={site?.overheadLines || false}
//               onChange={() => setSite({ ...site, overheadLines: !site.overheadLines })}
//             />
//             <label>Overhead Lines</label>
//           </div>
//         </div>

//         {/* Care History */}
//         <div>
//           <label>Care History</label>
//           <textarea
//             value={careHistoryValue}
//             onChange={(e) => setCareHistoryValue(e.target.value)}
//           />
//         </div>

//         {/* Notes */}
//         <div>
//           <label>Notes</label>
//           <textarea
//             value={notesValue}
//             onChange={(e) => setNotesValue(e.target.value)}
//           />
//         </div>

//         <button type="submit">Save</button>
//       </form>
//     </div>
//   );
// };

// export default TreeForm;
