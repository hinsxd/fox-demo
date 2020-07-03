import { Button, Paper, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker } from '@material-ui/pickers';
// import TextField from '@material-ui/core/TextField';
import { startOfMonth, addMonths } from 'date-fns';
import React, { useState, useCallback } from 'react';
import { useSetLessonsStatusMutation, LessonStatus } from 'types/graphql';
import Dashboard from './Dashboard';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  paper: {
    maxWidth: '300px'
  }
}));

// const thisDay = DateTime.local().weekday;

const useSelectMonth = (initialDate: Date) => {
  const [start, setStart] = useState(startOfMonth(initialDate));
  const end = addMonths(start, 1);
  const setDate = (date: Date) => {
    setStart(startOfMonth(date));
  };
  return {
    start,
    end,
    setDate
  };
};

const Visibility: React.FC = () => {
  // Styles
  const classes = useStyles();

  const { start, end, setDate } = useSelectMonth(new Date());
  // const [setBookable] = useSetLessonsBookableMutation();
  // const [setVisible] = useSetLessonsVisibleMutation();
  const [setLessonsStatusMutation] = useSetLessonsStatusMutation();

  const handleSet = useCallback(
    (status: LessonStatus) => () =>
      setLessonsStatusMutation({
        variables: { from: start, to: end, status }
      }),
    [end, setLessonsStatusMutation, start]
  );
  return (
    <Dashboard title="Manage Visibility">
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Box flexDirection="column" display="flex">
            <DatePicker
              value={start}
              autoOk
              openTo="month"
              onChange={date => {
                if (date) setDate(date);
              }}
              views={['year', 'month']}
            />
            <Button onClick={handleSet(LessonStatus.Hidden)}>Hide</Button>
            <Button onClick={handleSet(LessonStatus.DisplayOnly)}>
              Display Only
            </Button>
            <Button onClick={handleSet(LessonStatus.Bookable)}>
              Allow Booking
            </Button>
          </Box>
        </Paper>
      </div>
    </Dashboard>
  );
};
export default Visibility;
