import React, { useState } from "react";
// import ReactDOM from "react-dom";
// import { useForm } from "react-hook-form";

//This should be pulled from the database in the production app, and the object should indicate native or nonnative. These are all native except as marked.
const commonToscientificNames = {
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

const TreeForm = () => {
  const [commonName, setCommonName] = useState("");
  const [scientificName, setscientificName] = useState("");

  const speciesOptions = Object.keys(commonToscientificNames).map(common => ({
    common,
    scientific: commonToscientificNames[common]
  }));

  const handleCommonChange = (event) => {
    const selectedCommonName = event.target.value;
    setCommonName(selectedCommonName);

    const scientificNameFromCommon = commonToscientificNames[selectedCommonName];
    setscientificName(scientificNameFromCommon || "");
  };

  const handlescientificChange = (event) => {
    const selectedscientificName = event.target.value;
    setscientificName(selectedscientificName);

    const commonNameFromscientific = Object.keys(commonToscientificNames).find(
      common => commonToscientificNames[common] === selectedscientificName
    );
    setCommonName(commonNameFromscientific || "");
  };

  return (
    <div id="treeForm">
      <form>
        <p>Id: {}</p>
        <p>Last visited: </p>
        <select id="commonName" value={commonName} onChange={handleCommonChange}>
          <option value="">Select common name</option>
          {speciesOptions.map((option) => {
            <option key={option.common} value={option.common}>
              {option.common}
            </option>
          })}
        </select>
        <select id="commonName" value={commonName} onChange={handleCommonChange}>
          <option value="">Select common name</option>
          {speciesOptions.map((option) => {
            <option key={option.common} value={option.common}>
              {option.common}
            </option>
          })}
        </select>
      </form>
    </div>
  );
};

export default TreeForm;