import React, { useState } from 'react';
import { Grid, Typography, Button, CircularProgress } from '@material-ui/core';
import {
  useSwapLessonMutation,
  BookedLessonsDocument,
  MeDocument
} from 'types/graphql';
import { usePickerState, Calendar } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { isValid, isPast, subDays } from 'date-fns';
import { format } from 'date-fns-tz';
import { ArrowForward } from '@material-ui/icons';
import { useCheckoutDialogContext } from 'context/checkoutDialog';
import { useLessonsByMonth } from 'utils/useLessonsByMonth';
import useStyles from './useStyles';
import LessonButton from 'components/LessonButton';

type Props = {
  onClose: () => void;
  selectedId: string;
};

const SwapLesson: React.FC<Props> = ({ onClose, selectedId }) => {
  const classes = useStyles();

  const { openCheckoutDialog } = useCheckoutDialogContext();

  const [targetLessonId, setTargetLessonId] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const selectedDateString = selectedDate
    ? format(selectedDate, 'yyyy-MM-dd')
    : '';

  // Apollo hooks - Lesson data
  const { groupedLessons, lessons, loading } = useLessonsByMonth();

  const [swapLesson] = useSwapLessonMutation({
    refetchQueries: [
      { query: BookedLessonsDocument, variables: { type: 'upcoming' } },
      { query: MeDocument }
    ]
  });

  const action = async (args: { source: string; ccLast4: string }) => {
    const { ccLast4, source } = args;
    try {
      if (targetLessonId) {
        await swapLesson({
          variables: {
            fromId: selectedId,
            toId: targetLessonId,
            source,
            ccLast4
          }
        });
        onClose();
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  const onMonthChange = async (date: MaterialUiPickersDate) => {
    setTargetLessonId(null);
    if (date) {
      // const newLesssons = newData.data.lessons;
      // if (newLesssons.length > 0)
      //   setSelectedDate(dateInHKTime(newLesssons[0].start));
    }
  };

  const shouldDisableDate = (date: MaterialUiPickersDate) => {
    if (!date) return false;
    if (isPast(subDays(date, 1))) return true;
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      return !!!groupedLessons[dateString];
    } catch (e) {
      return false;
    }
  };

  const onChange = (date: MaterialUiPickersDate) => {
    if (isValid(date)) setSelectedDate(date);
  };

  const { pickerProps } = usePickerState(
    {
      value: selectedDate,
      onChange,
      initialFocusedDate: null
    },
    {
      getDefaultFormat: () => 'yyyy-MM-dd'
    }
  );

  return (
    <Grid item container direction="row">
      <Grid item style={{ overflow: 'hidden', minWidth: 315 }}>
        <Calendar
          {...pickerProps}
          disablePast
          shouldDisableDate={shouldDisableDate}
          onChange={onChange}
          onMonthChange={onMonthChange}
        />
      </Grid>
      <Grid item xs container direction="column" className={classes.lessonList}>
        <Typography variant="overline" component="h6">
          Timeslots
        </Typography>
        <Grid container>
          {loading ? (
            <CircularProgress size="1rem" />
          ) : lessons.length === 0 ? (
            <Typography variant="h6" color="textSecondary">
              No lessons available...
            </Typography>
          ) : selectedDate ? (
            groupedLessons[selectedDateString] ? (
              groupedLessons[selectedDateString].map(lesson => {
                const selected = targetLessonId === lesson.id;
                return (
                  <LessonButton
                    key={lesson.id}
                    className={classes.button}
                    lesson={lesson}
                    selected={selected}
                    onClick={() => setTargetLessonId(lesson.id)}
                  />
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
        <Button
          variant="contained"
          disabled={!targetLessonId}
          className={classes.checkoutButton}
          onClick={() => {
            openCheckoutDialog({
              title: `Swap lesson: $50`,
              action
            });
          }}
        >
          Proceed to checkout <ArrowForward />
        </Button>
      </Grid>
    </Grid>
  );
};

export default SwapLesson;
