export const dragHandler = (id, northing, eastingvalue) => {

//not sure why this exists. Needed?

  //if field nested (e.g., 'siteData.slope')
  if (field.includes('.')) {
    const [parentField, childField] = field.split('.'); //split field into parent & child

    if (parentField === 'species') { //common and scientific names sync'd here
      switch (childField) {
        case 'commonName':
        const scientificFromCommon = commonToScientificList[value]; 
        updatedTree = {
          ...updatedTree,
          species: {
            ...updatedTree.species,
            commonName: value,
            scientificName: scientificFromCommon || ''
          }
        };
        break;

        case 'scientificName':
        const commonFromScientific = Object.keys(commonToScientificList)
        .find(common => commonToScientificList[common] === value); 
        updatedTree = {
          ...updatedTree,
          species: {
            ...updatedTree.species,
            scientificName: value,
            commonName: commonFromScientific || ''
          }
        };
          break;

        default:
        //default if neither of the above matches the species field structure (unlikely)
        updatedTree = {
          ...updatedTree,
          species: {
            ...updatedTree.species,
            commonName: '',
            scientificName: ''
          }
        };
        break;
      }
    } 

    else {
      //the field is nested, but it's not the special case of 'species'
      updatedTree = {
        ...updatedTree,
        [parentField]: {
          ...updatedTree[parentField],
          [childField]: value
        }
      };
    }
  }
   
  else {
    //the field is not nested
    updatedTree = {
      ...updatedTree,
      [field]: value
    };
  }
return updatedTree;
};
