import { format, utcToZonedTime } from 'date-fns-tz';
import { LessonFragmentFragment } from 'types/graphql';

const timeZone = 'Asia/Hong_Kong';

export const getLessonStrings = (lesson: LessonFragmentFragment) => {
  const start = format(utcToZonedTime(lesson.start, timeZone), 'HH:mm', {
    timeZone
  });
  const end = format(utcToZonedTime(lesson.end, timeZone), 'HH:mm', {
    timeZone
  });
  const date = format(
    utcToZonedTime(lesson.start, timeZone),
    'MMM dd, yyyy (E)',
    { timeZone }
  );
  // const price = centsToDollarString(lesson.price);
  return { start, end, date };
};
