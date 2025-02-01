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

export function formatDateForDisplay(dateStr) {
  if (dateStr === '' || !dateStr) return '';

  //'before'
  const beforeMatch = dateStr.match(/^(?:<\s*|before\s+)(\d{4})$/i);
  if (beforeMatch) {
    return `< ${beforeMatch[1]}`;
  }
  
  //'Unix timestamp'
  if (/^\d{13}$/.test(String(dateStr))) {
    const date = new Date(Number(dateStr));
    return date.toLocaleDateString('en-US');
  }
  
  //'mm/dd/yyyy'
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('en-US');
  }
  return dateStr;
}

//validate input
export function validateDateField(dateStr) {
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
}