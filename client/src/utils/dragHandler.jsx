export const dragHandler = (id, northing, eastingvalue) => {

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
