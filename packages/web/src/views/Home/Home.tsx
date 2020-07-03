import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
} from '@material-ui/core';
import Calendar from 'components/Calendar';
import { useLessonDialogContext } from 'context/lessonDialog';
import { isPast } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import React, { useState } from 'react';
import { useBookedLessonsQuery } from 'types/graphql';
import { getLessonStrings } from 'utils/getLessonStrings';
import MainContainer from '../../components/MainContainer';
import Layout from '../Layout';
import LessonDialogComponent from './LessonDialogComponent';
import useStyles from './useStyles';

const Home = () => {
  const classes = useStyles();
  const { openDialog } = useLessonDialogContext();

  const { data } = useBookedLessonsQuery({
    variables: { type: 'upcoming' },
  });
  const { bookedLessons = [], cancelledLessons = [] } = data?.me || {};
  const dates = bookedLessons
    .map((lesson) => lesson.start)
    .map((start) =>
      format(utcToZonedTime(new Date(start), 'Asia/Hong_Kong'), 'yyyy-MM-dd')
    );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const modifiers: Record<string, (x: Date) => boolean> = {
    disabled: (date) => {
      if (isPast(date)) return true;
      if (!dates.includes(format(date, 'yyyy-MM-dd'))) return true;
      return false;
    },
    highlight: (date) => dates.includes(format(date, 'yyyy-MM-dd')),
  };
  const modifiersClassNames = {
    highlight: classes.dateHighlight,
  };
  return (
    <Layout view="home">
      <MainContainer>
        <Typography variant="h4">My Schedule</Typography>
        <Grid container>
          <Grid item xs={12} sm>
            <Calendar
              date={selectedDate}
              onDateChange={setSelectedDate}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <List
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Upcoming schedule
                </ListSubheader>
              }
            >
              {bookedLessons.map((lesson) => (
                <ListItem
                  button
                  key={lesson.id}
                  onClick={() => openDialog(lesson)}
                >
                  <ListItemText
                    primary={getLessonStrings(lesson).date}
                    secondary={`${getLessonStrings(lesson).start} - ${
                      getLessonStrings(lesson).end
                    }`}
                  />
                </ListItem>
              ))}
            </List>
            <List
              subheader={
                <ListSubheader component="div" id="list-subheader">
                  Cancelled Lessons
                </ListSubheader>
              }
            >
              {cancelledLessons.map((lesson) => (
                <ListItem key={lesson.id} button>
                  <ListItemText
                    primary={getLessonStrings(lesson).date}
                    secondary={`${getLessonStrings(lesson).start} - ${
                      getLessonStrings(lesson).end
                    }`}
                    primaryTypographyProps={{ color: 'textSecondary' }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </MainContainer>
      <LessonDialogComponent />
    </Layout>
  );
};

export default Home;
