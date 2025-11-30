import leaflet from 'leaflet';

//handle changes to form fields
export const handleFieldChange = (workingTree, field, value, commonToScientific) => {
  //if field nested (e.g., 'siteInfo.slope')
  if (field.includes('.')) {
    const [parentField, childField] = field.split('.'); //split field into parent & child
    return {
      ...workingTree,
      [parentField]: {
        ...workingTree[parentField],
        [childField]: value,
      },
    };
  }

  //if field not nested
  if (field === 'commonName') {
    //common and scientific names sync'd here
    const scientificFromCommon = commonToScientific[value];
    return {
      ...workingTree,
      commonName: value,
      scientificName: scientificFromCommon || '',
    };
  }

  if (field === 'scientificName') {
    const commonFromScientific = Object.keys(commonToScientific).find(
      (common) => commonToScientific[common] === value
    );
    return {
      ...workingTree,
      scientificName: value,
      commonName: commonFromScientific || '',
    };
  }

  return {
    ...workingTree,
    [field]: value,
  };

  //should I move this into handleSubmit?
  // if (workingTree.felledDate) {
  //   workingTree.hidden = true;
  // } else {
  //   workingTree.hidden = false;
  // }

  // return workingTree;
};

//return today's date in MM/DD/YYYY format
export const getTodayFormatted = () => {
  const today = new Date();
  return `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(
    2,
    '0'
  )}/${today.getFullYear()}`;
};

//on focus, if field is empty, populate with today's date
export const handleDateFocus = (fieldValue, setFieldValue) => {
  if (!fieldValue?.trim()) {
    setFieldValue(getTodayFormatted());
  }
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

//generate marker icons
export const generateTreeMarkerIcon = ({
  tree,
  species,
  radius,
  opacity = 1,
  isSelected = false,
}) => {
  const markerStrokeWidth = isSelected ? 3 : 1; //if the marker is selected, use a thicker stroke; do not move this line below iconSize calculation
  const iconSize = radius * 2 + markerStrokeWidth;
  const markerColor = species.markerColor || 'FFFFFF';
  const svgIcon = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${iconSize} ${iconSize}'>
        <circle cx='${iconSize / 2}' cy='${iconSize / 2}' r='${radius}' 
          fill='${markerColor}' fill-opacity='${opacity}' 
          stroke='lightgray' stroke-width='${markerStrokeWidth}'/>
      </svg>
    `;
  return leaflet.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
    iconSize: [iconSize, iconSize],
    iconRetinaUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
  });
};

//confirm navigation away from the data form if there are unsaved changes
export const confirmDiscardChanges = (workingTree, selectedTree) => {
  const workingTreeString = JSON.stringify(workingTree);
  const selectedTreeString = JSON.stringify(selectedTree);

  if (workingTree && workingTreeString !== selectedTreeString) {
    return window.confirm('Are you sure you want to leave the form? Unsaved changes will be lost.');
  }

  return true; // no unsaved changes, so okay to proceed
};
