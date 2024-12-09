export function formatDateForDisplay(dateStr) {
  if (dateStr === "" || !dateStr) return "";

  if (dateStr.startsWith("< ") || dateStr.toLowerCase().startsWith("before")) { //e.g. "< 2018" or "Before 2018" or "before 2018"
    const year = dateStr.split(" ")[1];
    return `< ${year}`;
  }

  const date = new Date(Number(dateStr));
  if (dateStr.startsWith("<")) { //e.g. "<2018"
    const year = dateStr.slice(0);
    return `< ${year}`;
  }

  return date.toLocaleDateString("en-US");
}