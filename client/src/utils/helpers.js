export const handleFieldChange = (updatedTree, field, value, commonToScientific) => {
  //if field nested (e.g., 'siteInfo.slope')
  if (field.includes('.')) {
    const [parentField, childField] = field.split('.'); //split field into parent & child
    updatedTree = {
      ...updatedTree,
      [parentField]: {
        ...updatedTree[parentField],
        [childField]: value,
      },
    };
  }

  //if field not nested
  if (field === 'commonName') {
    //common and scientific names sync'd here
    const scientificFromCommon = commonToScientific[value];
    updatedTree = {
      ...updatedTree,
      commonName: value,
      scientificName: scientificFromCommon || '',
    };
  }

  if (field === 'scientificName') {
    const commonFromScientific = Object.keys(commonToScientific).find(
      (common) => commonToScientific[common] === value
    );
    updatedTree = {
      ...updatedTree,
      scientificName: value,
      commonName: commonFromScientific || '',
    };
  }

  updatedTree = {
    ...updatedTree,
    [field]: value,
  };

  if (updatedTree.felledDate) {
    updatedTree.hidden = true;
  }

  return updatedTree;
};

//normalize a 2-digit year into 4-digit
const normalizeYear = (yy) => {
  const num = parseInt(yy, 10);
  if (yy.length === 2) {
    const currentYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100) * 100;
    return currentCentury + num;
  }
  return num;
};

//validate date input
export const validateDateField = (dateStr) => {
  if (!dateStr) return true;

  let cleaned = String(dateStr).trim();

  //standardize separators
  cleaned = cleaned.replace(/\./g, '/');

  //"<YY" or "< YYYY" or "before YYYY"
  const beforeMatch = cleaned.match(/^(?:<\s*|before\s+)(\d{2,4})$/i);
  if (beforeMatch) {
    const year = normalizeYear(beforeMatch[1]);
    return `< ${year}`;
  }

  //MM/DD/YYYY or MM/DD/YY
  const match = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (match) {
    const [, mm, dd, yy] = match;
    const year = normalizeYear(yy);
    const date = new Date(`${year}-${mm}-${dd}`);
    if (!isNaN(date.getTime())) {
      return `${String(mm).padStart(2, '0')}/${String(dd).padStart(2, '0')}/${year}`;
    }
  }

  return false; // invalid format
};

//convert unix timestamps to locale date strings for display on a form; ignore nonstandard date strings
export const formatDateForDisplay = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') dateStr = String(dateStr || '').trim();

  //'< yyyy'  or 'before yyyy'
  const beforeMatch = dateStr.match(/^(?:<\s*|before\s+)(\d{4})$/i);
  if (beforeMatch) {
    return `< ${beforeMatch[1]}`;
  }

  //'Unix timestamp'
  if (/^\d{13}$/.test(dateStr)) {
    const date = new Date(Number(dateStr));
    return `${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(
      2,
      '0'
    )}/${date.getUTCFullYear()}`;
  }

  //'mm/dd/yyyy' or ISO string
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return `${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(
      2,
      '0'
    )}/${date.getUTCFullYear()}`;
  }

  return dateStr;
};

//convert time strings to ISO strings for DB storage
export const formatDateForDb = (dateStr) => {
  if (!dateStr) return '';

  let cleaned = String(dateStr).trim();
  cleaned = cleaned.replace(/\./g, '/');

  //< YY, < YYYY, <YY, <YYYY, before YY, before YYYY
  const beforeMatch = cleaned.match(/^(?:<\s*|before\s+)(\d{2,4})$/i);
  if (beforeMatch) {
    const year = normalizeYear(beforeMatch[1]);
    return `< ${year}`;
  }

  //MM/DD/YYYY or MM/DD/YY
  const match = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (match) {
    const [, mm, dd, yy] = match;
    const year = normalizeYear(yy);
    return new Date(Date.UTC(year, mm - 1, dd)).toISOString();
  }

  // fallback: try native Date
  if (!isNaN(Date.parse(cleaned))) return new Date(cleaned).toISOString();

  return cleaned;
};

//validate input
// export const validateDateField = (dateStr) => {
//   if (!dateStr) return true;

//   //'before'
//   if (/^(?:<\s*|before\s+)\d{4}$/i.test(dateStr)) {
//     return true;
//   }

//   //'Unix timestamp'
//   if (/^\d{13}$/.test(String(dateStr))) {
//     return true;
//   }

//   //'mm/dd/yyy'
//   const date = new Date(dateStr);
//   return !isNaN(date.getTime());
// };

//combine tree and species data
export const combineTreeAndSpeciesData = (tree, speciesMap) => {
  const species = speciesMap.find((s) => s.commonName === tree.commonName) || {};
  return {
    ...tree,
    scientificName: species.scientificName || '',
    nonnative: species.nonnative || false,
    invasive: species.invasive || false,
    markerColor: species.markerColor || 'FFFFFF',
    family: species.family || '',
  };
};
