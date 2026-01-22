// ✅ Shorten long text (Netflix UI)
export const truncate = (text = "", maxLength = 120) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

// ✅ Convert minutes to 1h 30m
export const minutesToHours = (minutes = 0) => {
  const mins = Number(minutes);
  if (!mins || mins <= 0) return "0 min";

  const h = Math.floor(mins / 60);
  const m = mins % 60;

  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;

  return `${h}h ${m}m`;
};

// ✅ Format date for UI
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
