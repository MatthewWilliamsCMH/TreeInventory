export const handleFieldChange = (updatedTree, field, value) => {
  //if field nested (e.g., 'siteData.slope')
  if (field.includes('.')) {
    const [parentField, childField] = field.split('.'); //split field into parent & child
    updatedTree = {
      ...updatedTree,
      [parentField]: {
        ...updatedTree[parentField],
        [childField]: value
      }
    };
  }

  //if field not nested
  if (field === 'commonName') {  //common and scientific names sync'd here
    const scientificFromCommon = commonToScientificList[value]; 
    updatedTree = {
      ...updatedTree,
      commonName: value,
      scientificName: scientificFromCommon || ''
    };
  };

  if (field === 'scientificName') {
    const commonFromScientific =  Object.keys(commonToScientificList).find(common => commonToScientificList[common] === value);
    updatedTree = {
      ...updatedTree,
      scientificName: value,
      commonName: commonFromScientific || ''
    }
  }

  updatedTree = {
    ...updatedTree,
    [field]: value
  };

  return updatedTree;
};

//-------------------- select lists --------------------//
//code to compile commonToScientificList from db entries and populate dropdowns
// export const commonToScientificList = {
// }

export const commonToScientificList = {
  '': '',
  'American basswood': 'Tilia americana',
  'American beech': 'Fagus grandifolia',
  'American chestnut': 'Castanea dentata',
  'American elm': 'Ulmus americana',
  'American sycamore': 'Platanus occidentalis',
  'Austrian pine': 'Pinus nigra',
  'Bigtooth aspen': 'Populus grandidentata',
  'Bitternut hickory': 'Carya cordiformis',
  'Black birch': 'Betula lenta',
  'Black cherry': 'Prunus serotina',
  'Black locust': 'Robinia pseudoacacia',
  'Black maple': 'Acer nigrum',
  'Black oak': 'Quercus velutina',
  'Black walnut': 'Juglans nigra',
  'Black willow': 'Salix nigra',
  'Blackgum': 'Nyssa sylvatica',
  'Blackhaw': 'Viburnum prunifolium',
  'Blue spruce': 'Picea pungens',
  'Boxelder': 'Acer negundo',
  'Bur oak': 'Quercus macrocarpa',
  'Butternut': 'Juglans cinerea',
  'Callery pear': 'Pyrus calleryana',
  'Chestnut oak': 'Quercus montana',
  'Chinese magnolia': 'Magnolia x soulangeana',
  'Chinquapin oak': 'Quercus muehlenbergii',
  'Common hackberry': 'Celtis occidentalis',
  'Common linden': 'Tilia x europaea',
  'Cucumbertree': 'Magnolia acuminata',
  'Eastern cottonwood': 'Populus deltoides',
  'Eastern hemlock': 'Tsuga canadensis',
  'Eastern red cedar': 'Juniperus virginiana',
  'Eastern redbud': 'Cercis canadensis',
  'Eastern white pine': 'Pinus strobus',
  'European beech': 'Fagus sylvatica',
  'Flowering dogwood': 'Cornus florida',
  'Ginkgo': 'Ginkgo biloba',
  'Green ash': 'Fraxinus pennsylvanica',
  'Hawthorn': 'Crataegus phaenopyrum',
  'Honey locust': 'Gleditsia triacanthos',
  'Japanese tree lilac': 'Syringa reticulata',
  'Japanese maple': 'Acer palmatum',
  'Kentucky coffeetree': 'Gymnocladus dioicus',
  'Littleleaf linden': 'Tilia cordata',
  'Loblolly pine': 'Pinus taeda',
  'Mockernut hickory': 'Carya tomentosa',
  'Northern catalpa': 'Catalpa speciosa',
  'Northern pecan': 'Carya illinoiensis',
  'Northern red oak': 'Quercus rubra',
  'Norway maple': 'Acer platanoides',
  'Norway spruce': 'Picea abies',
  'Ohio buckeye': 'Aesculus glabra',
  'Osage-orange': 'Maclura pomifera',
  'Persimmon': 'Diospyros virginiana',
  'Pignut hickory': 'Carya glabra',
  'Pin oak': 'Quercus palustris',
  'Pitch pine': 'Pinus rigida',
  'Prairie crab apple': 'Malus ioensis',
  'Red horse-chestnut': 'Aesculus x carnea',
  'Red maple': 'Acer rubrum',
  'Red mulberry': 'Morus rubra',
  'Red pine': 'Pinus resinosa',
  'River birch': 'Betula nigra',
  'Sassafras': 'Sassafras albidum',
  'Sawtooth oak': 'Quercus acutissima',
  'Scarlet oak': 'Quercus coccinea',
  'Scotch pine': 'Pinus sylvetris',
  'Scrub hickory': 'Carya floridana',
  'Shagbark hickory': 'Carya ovata',
  'Shellbark hickory': 'Carya laciniosa',
  'Shingle oak': 'Quercus imbricaria',
  'Shortleaf pine': 'Pinus echinata',
  'Shumard oak': 'Quercus shumardii',
  'Siberian elm': 'Ulmus pumila',
  'Silver maple': 'Acer saccharinum',
  'Slippery elm': 'Ulmus rubra',
  'Sugar maple': 'Acer saccharum',
  'Swamp white oak': 'Quercus bicolor',
  'Sweetbay': 'Magnolia virginiana',
  'Sweetgum': 'Liquidambar styraciflua',
  'Tree of heaven': 'Ailanthus altissima',
  'Unknown species': 'Unknown species',
  'Virginia pine': 'Pinus virginiana',
  'Weeping cherry': 'Prunus pendula',
  'White ash': 'Fraxinus americana',
  'White mulberry': 'Morus alba',
  'White oak': 'Quercus alba',
  'Yellow birch': 'Betula alleghaniensis',
  'Yellow buckeye': 'Aesculus flava',
  'Yellow poplar': 'Liriodendron tulipifera'
}

//move the below into a file of constants?
export const dbhList = [
  '',
  '< 3', 
  '3-6', 
  '7-12', 
  '13-18', 
  '19-24', 
  '25-30', 
  '31-36', 
  '37-42', 
  '> 42'
];

export const gardenList = [
  '',
  'Community garden and lawn',
  'Dog lawn',
  'Drainage rill',
  'Fire pit',
  'Glenn garden and lawn',
  'Goodale entrance beds',
  'Hosta bed',
  'Main sign bed',
  'Meditation garden',
  'Parking-lot beds and lawn',
  'Ravine',
  'Pool lawn',
  'South lawn',
  'Urlin driveway bed north',
  'Urlin driveway bed south',
  'Woodland garden'
]

export const siteInfoList = [
  'slope',
  'overheadLines',
  'treeCluster',
  'proximateStructure',
  'proximateFence'
]

export const careNeedsList = [
  'install',
  'raiseCrown',
  'routinePrune',
  'trainingPrune',
  'priorityPrune',
  'pestTreatment',
  'installGrate',
  'removeGrate',
  'fell',
  'removeStump'
];
