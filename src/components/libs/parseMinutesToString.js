const parseMinutesToString = (totalMinutes) => {
  if (!totalMinutes) return '';

  const minutes = totalMinutes % 60;
  const hours = (totalMinutes - minutes) / 60;

  if (!hours) return `${minutes}m`;
  if (!minutes) return `${hours}h`;

  return `${hours}h ${minutes}m`;
};

export default parseMinutesToString;
