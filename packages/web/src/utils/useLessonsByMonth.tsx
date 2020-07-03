import { useLessonsQuery, LessonsQuery } from 'types/graphql';
import { startOfMonth } from 'date-fns';
import { dateInHKTime } from './dateInHKTime';
import { groupBy } from 'lodash-es';
import { format, utcToZonedTime } from 'date-fns-tz';
import { ApolloQueryResult } from 'apollo-client';
import { addMonths } from 'date-fns/esm';
import { useState, useEffect, useRef, useMemo } from 'react';

const timeZone = 'Asia/Hong_Kong';
const initialMonthInterval: Interval = {
  start: dateInHKTime(startOfMonth(new Date())),
  end: dateInHKTime(addMonths(startOfMonth(new Date()), 1))
};
// console.log(initialMonthInterval);
export const useLessonsByMonth = () => {
  const [start, setStart] = useState(initialMonthInterval.start);
  const end = dateInHKTime(addMonths(start, 1));

  const { data, loading, refetch, called } = useLessonsQuery({
    variables: { start, end },
    fetchPolicy: 'cache-and-network'
  });
  const firstCalled = useRef(false);

  useEffect(() => {
    if (called) {
      firstCalled.current = true;
    }
  }, [called]);

  useEffect(() => {
    if (firstCalled.current)
      refetch({
        start: dateInHKTime(startOfMonth(start)),
        end: dateInHKTime(addMonths(startOfMonth(start), 1))
      });
  }, [start, refetch]);

  const lessons = data?.lessons || [];

  const groupedLessons = useMemo(
    () =>
      groupBy(lessons, lesson =>
        format(utcToZonedTime(lesson.start, timeZone), 'yyyy-MM-dd', {
          timeZone
        })
      ),
    [lessons]
  );
  const refetchLessons = async (
    start: Date
  ): Promise<ApolloQueryResult<LessonsQuery>> => {
    return await refetch({
      start: dateInHKTime(startOfMonth(start)),
      end: dateInHKTime(addMonths(startOfMonth(start), 1))
    });
  };
  return { start, setStart, lessons, loading, groupedLessons, refetchLessons };
};
