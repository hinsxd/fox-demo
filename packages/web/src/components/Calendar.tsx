import React from 'react';
import { DatePickerCalendar } from 'react-nice-dates';
import { enUS } from 'date-fns/locale';
import { makeStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  calendarWrapper: {
    // flex: 1
    // overflow: 'hidden',
    padding: theme.spacing(2),
    // marginRight: theme.spacing(2),
    maxWidth: 350,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '85vw'
    }
  }
}));
const Calendar: React.FC<any> = ({ modifiers, ...props }) => {
  const classes = useStyles();
  const mergedModifiers: Record<string, (x: Date) => boolean> = {
    ...modifiers,
    disabled: date => {
      if (modifiers.disabled) return modifiers.disabled(date);
      return false;
    }
  };
  return (
    <Paper className={classes.calendarWrapper} elevation={1}>
      <DatePickerCalendar
        locale={enUS}
        {...props}
        modifiers={mergedModifiers}
      />
    </Paper>
  );
};
export default Calendar;
