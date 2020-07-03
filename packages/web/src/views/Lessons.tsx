import {
  Badge,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import Calendar from 'components/Calendar';

// import { DatePicker, Calendar, usePickerState } from '@material-ui/pickers';
// import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import MainContainer from 'components/MainContainer';
import { isPast, subDays } from 'date-fns';
import { format } from 'date-fns-tz';
import React, { useState } from 'react';
import {
  LessonFragmentFragment,
  MeDocument,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} from 'types/graphql';
import { useLessonsByMonth } from 'utils/useLessonsByMonth';
import Layout from 'views/Layout';
import LessonButton from 'components/LessonButton';

const useStyles = makeStyles(() => ({
  button: {
    // width: '250px'
  },
  lessonButtonWrapper: {
    margin: 15,
  },
  stepWrapper: {
    marginBottom: 15,
  },
}));

const Lessons: React.FC = () => {
  const classes = useStyles();

  // Local states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const selectedDateString = selectedDate
    ? format(selectedDate, 'yyyy-MM-dd')
    : '';

  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  // const [monthInterval, setMonthInterval] = useState(initialMonthInterval);

  const [addToCart] = useAddToCartMutation({
    refetchQueries: [{ query: MeDocument }],
    awaitRefetchQueries: true,
  });

  const [removeFromCart] = useRemoveFromCartMutation({
    refetchQueries: [{ query: MeDocument }],
    awaitRefetchQueries: true,
  });
  // Apollo hooks - Lesson data
  const {
    start,
    setStart,
    groupedLessons,
    lessons,
    loading,
  } = useLessonsByMonth();
  // Set to first lesson when month changed
  // Put lesson in cart
  const handleLessonClick = (lesson: LessonFragmentFragment) => async () => {
    try {
      setLoadingIds((ids) => [...ids, lesson.id]);
      if (!lesson.inCart) {
        await addToCart({
          variables: { id: lesson.id },
        });
      } else {
        await removeFromCart({
          variables: { id: lesson.id },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingIds((ids) => ids.filter((id) => id !== lesson.id));
    }
  };

  // Calendar

  // const onChange = (date: MaterialUiPickersDate) => {
  //   if (isValid(date)) setSelectedDate(date);
  // };

  // const shouldDisableDate = (date: MaterialUiPickersDate) => {
  //   if (!date) return false;
  //   if (isPast(subDays(date, 2))) return true;
  //   try {
  //     const dateString = format(date, 'yyyy-MM-dd');
  //     return !!!groupedLessons[dateString];
  //   } catch (e) {
  //     return false;
  //   }
  // };
  const modifiers: Record<string, (x: Date) => boolean> = {
    disabled: (date) => {
      if (isPast(subDays(date, 2))) return true;
      try {
        const dateString = format(date, 'yyyy-MM-dd');
        return !(dateString in groupedLessons);
      } catch (e) {
        console.error(e);
        return false;
      }
    },
  };
  return (
    <Layout view="lessons">
      <MainContainer>
        <Typography variant="h4">Book new lessons</Typography>
        <Grid item xs={12} sm className={classes.stepWrapper}>
          <Typography variant="overline" component="h6">
            Step 1: Pick a date
          </Typography>
          {/* <DatePicker
                variant="static"
                disableToolbar
                value={selectedDate}
                onChange={onChange}
                disablePast
                shouldDisableDate={shouldDisableDate}
                onMonthChange={onMonthChange}
                // renderDay={renderDay}
              /> */}
          <Calendar
            date={selectedDate}
            onDateChange={setSelectedDate}
            month={start}
            onMonthChange={setStart}
            modifiers={modifiers}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.stepWrapper}>
          <Typography variant="overline" component="h6">
            Step 2: Add timeslots to cart
          </Typography>
          <Typography>
            *{' '}
            <Typography variant="subtitle2" component="span" color="primary">
              Bookable Lesson
            </Typography>{' '}
            <Typography variant="subtitle2" component="span" color="secondary">
              Non-Bookable Lesson
            </Typography>
          </Typography>
          <Grid container direction="row" alignContent="flex-start">
            {loading ? (
              <CircularProgress size="1rem" variant="indeterminate" />
            ) : lessons?.length === 0 ? (
              <Typography variant="h6" color="textSecondary">
                No lessons available...
              </Typography>
            ) : selectedDate ? (
              groupedLessons[selectedDateString] ? (
                groupedLessons[selectedDateString].map((lesson) => {
                  const isLoading = loadingIds.includes(lesson.id);

                  return (
                    <div
                      className={classes.lessonButtonWrapper}
                      key={lesson.id}
                    >
                      <Badge
                        key={lesson.id}
                        color="default"
                        badgeContent={
                          isLoading && <CircularProgress size="1rem" />
                        }
                      >
                        <LessonButton
                          disabled={isLoading}
                          className={classes.button}
                          selected={lesson.inCart}
                          onClick={handleLessonClick(lesson)}
                          lesson={lesson}
                        />
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <Typography variant="h6" color="textSecondary">
                  Invalid date
                </Typography>
              )
            ) : (
              <Typography variant="h6" color="textSecondary">
                Choose a date...
              </Typography>
            )}
          </Grid>
        </Grid>
      </MainContainer>
    </Layout>
  );
};

export default Lessons;
