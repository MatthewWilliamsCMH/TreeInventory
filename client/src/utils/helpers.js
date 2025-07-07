export const handleFieldChange = (updatedTree, field, value, commonToScientific) => {
  //if field nested (e.g., 'siteInfo.slope')
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
    const scientificFromCommon = commonToScientific[value]; 
    updatedTree = {
      ...updatedTree,
      commonName: value,
      scientificName: scientificFromCommon || ''
    };
  };

  if (field === 'scientificName') {
    const commonFromScientific =  Object.keys(commonToScientific).find(common => commonToScientific[common] === value);
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

  if (updatedTree.felledDate) {updatedTree.hidden = true};

  return updatedTree;
};

export const formatDateForDisplay = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') {
    dateStr = String(dateStr || '').trim();
  }

  //'before'
  const beforeMatch = dateStr.match(/^(?:<\s*|before\s+)(\d{4})$/i);
  if (beforeMatch) {
    return `< ${beforeMatch[1]}`;
  }

  //'Unix timestamp'
  if (/^\d{13}$/.test(dateStr)) {
    const date = new Date(Number(dateStr));
    return date.toLocaleDateString('en-US');
  }

  //'mm/dd/yyyy'
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('en-US');
  }

  return dateStr;
};

//validate input
export const validateDateField = (dateStr) => {
  if (!dateStr) return true;
  
  //'before'
  if (/^(?:<\s*|before\s+)\d{4}$/i.test(dateStr)) {
    return true;
  }
  
  //'Unix timestamp'
  if (/^\d{13}$/.test(String(dateStr))) {
    return true;
  }
  
  //'mm/dd/yyy'
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

//combine tree and species data
export const combineTreeAndSpeciesData = (tree, speciesMap) => {
  const species = speciesMap.find(s => s.commonName === tree.commonName) || {};
  return {
    ...tree,
    scientificName: species.scientificName || '',
    nonnative: species.nonnative || false,
    invasive: species.invasive || false,
    markerColor: species.markerColor || 'FFFFFF',
    family: species.family || ''
  };
};
