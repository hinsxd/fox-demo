import { zonedTimeToUtc } from 'date-fns-tz';
const timeZone = 'Asia/Hong_Kong';
export const dateInHKTime = (date: Date | string): Date => {
  return new Date(zonedTimeToUtc(new Date(date), timeZone));
};
