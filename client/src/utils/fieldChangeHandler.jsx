export const handleFieldChange = (updatedTree, field, value, commonToScientificList) => {
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
