export function formatDateForDisplay(dateStr) {
  if (dateStr === "" || !dateStr) return "";

  //"before"
  const beforeMatch = dateStr.match(/^(?:<\s*|before\s+)(\d{4})$/i);
  if (beforeMatch) {
    return `< ${beforeMatch[1]}`;
  }
  
  //Unix timestamp
  if (/^\d{13}$/.test(String(dateStr))) {
    const date = new Date(Number(dateStr));
    return date.toLocaleDateString("en-US");
  }
  
  //regular date
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString("en-US");
  }
  return dateStr;
}

//validate dates
export function validateDateField(dateStr) {
  if (!dateStr) return true; // Allow empty for optional fields
  
  //"before"
  if (/^(?:<\s*|before\s+)\d{4}$/i.test(dateStr)) {
    return true;
  }
  
  //Unix timestamp
  if (/^\d{13}$/.test(String(dateStr))) {
    return true;
  }
  
  //valid date
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}