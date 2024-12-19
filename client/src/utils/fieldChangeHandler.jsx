export const handleFieldChange = (formValues, field, value) => {

  //is the field nested (e.g., "species.commonName")
  if (field.includes(".")) {
    const [parentField, childField] = field.split('.'); //split the field into parent and child

    if (parentField === "species") {  //species names interrelate; this "if" case syncs them
      switch (childField) {
        case "commonName":
        const scientificFromCommon = commonToScientificList[value]; 
        formValues = {
          ...formValues,
          species: {
            ...formValues.species,
            commonName: value,
            scientificName: scientificFromCommon || ""
          }
        };
        break;

        case "scientificName":
        const commonFromScientific = Object.keys(commonToScientificList)
        .find(common => commonToScientificList[common] === value); 
        formValues = {
          ...formValues,
          species: {
            ...formValues.species,
            scientificName: value,
            commonName: commonFromScientific || ""
          }
        };
          break;

        default:
        //default if neither of the above matches the species field structure (unlikely)
        formValues = {
          ...formValues,
          species: {
            ...formValues.species,
            commonName: "",
            scientificName: ""
          }
        };
        break;
      }
    } 

    else {
      //the field is nested, but it's not the special case of "species"
      formValues = {
        ...formValues,
        [parentField]: {
          ...formValues[parentField],
          [childField]: value
        }
      };
    }
  }
   
  else {
    //the field is not nested
    formValues = {
      ...formValues,
      [field]: value
    };
  }
return formValues;
};


//-------------------- select lists --------------------//
//species should be pulled from db but allow user to create new
export const commonToScientificList = {
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

export const dbhList = [
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

export const gardenList = [
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

export const siteInfoList = [
  "slope",
  "overheadLines",
  "treeCluster",
  "proximateStructure",
  "proximateFence"
]

export const maintenanceNeedsList = [
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
