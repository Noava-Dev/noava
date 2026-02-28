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

export const formatResponseTime = (milliseconds: number): string => {
  if (milliseconds >= 1000) {
    const seconds = (milliseconds / 1000).toFixed(1);
    return `${seconds}s`;
  }
  return `${Math.round(milliseconds)}ms`;
};

export const formatTimeSpent = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  
  if (minutes > 50) {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  }
  
  return `${minutes}m`;
};

export const formatHoursToTime = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (wholeHours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${wholeHours}h`;
  } else {
    return `${wholeHours}h ${minutes}m`;
  }
};

export default { formatDateToEuropean, formatResponseTime, formatTimeSpent, formatHoursToTime };