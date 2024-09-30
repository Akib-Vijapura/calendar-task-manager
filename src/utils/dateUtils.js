// src/utils/dateUtils.js
export const isSameDay = (date1, date2) => {
  return date1.toISOString().split('T')[0] === date2.toISOString().split('T')[0];
};
