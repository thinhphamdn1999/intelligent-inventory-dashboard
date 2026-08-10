import dayjs from 'dayjs';

/**
 * get the diff time to now
 *
 * @param {string} startedTime
 * @param {string} unit
 * @returns {number} - the estimate transfer day
 */
export const getDiffTime = (
  startedTime: string,
  unit: dayjs.OpUnitType = 'd',
) => {
  const from = dayjs(startedTime);
  const isValidTime = startedTime && from.isValid();

  return isValidTime ? dayjs().diff(from, unit) : 0;
};

/**
 * Format a date string into a specified format using dayjs.
 * @param date - The date string to format.
 * @param format - The desired format string (e.g., 'YYYY-MM-DD').
 * @returns - The formatted date string, or an empty string if the input date is invalid.
 */
export const formatDate = (date: string, format: string) => {
  const parsedDate = dayjs(date);
  return parsedDate.isValid() ? parsedDate.format(format) : '';
};
