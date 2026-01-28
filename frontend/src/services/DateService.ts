export const formatDateToEuropean = (value?: string | number | Date): string => {
  if (value === undefined || value === null) return "";
  const d = typeof value === "string" || typeof value === "number" ? new Date(value) : value;
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default { formatDateToEuropean };