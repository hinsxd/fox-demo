import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  calendarWrapper: {
    // flex: 1
    // overflow: 'hidden',
    padding: theme.spacing(2),
    // marginRight: theme.spacing(2),
    maxWidth: 350,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '70vw'
    }
  },
  dateHighlight: {
    fontWeight: 800,
    color: theme.palette.primary.main
  },
  button: {
    margin: '5px'
    // width: '200px'
  },
  checkoutButton: {
    marginTop: theme.spacing(2)
  },
  lessonList: {
    padding: theme.spacing(3)
  }
}));
