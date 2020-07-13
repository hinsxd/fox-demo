import {
  Card,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Person, Phone } from '@material-ui/icons';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { RouteComponentProps } from 'react-router';
import { useStudentQuery } from 'types/graphql';
import Dashboard from './Dashboard';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    // padding: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  form: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  table: {
    // minWidth: 650
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const UserDetail: React.FC<RouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id },
  },
}) => {
  const classes = useStyles();

  const { data, loading } = useStudentQuery({ variables: { id } });
  const student = data?.student;
  return (
    <Dashboard title="User Detail">
      <div className={classes.root}>
        {loading ? (
          <CircularProgress />
        ) : !student ? (
          <Typography>Error</Typography>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <Card>
                <>
                  <List dense>
                    {student && (
                      <>
                        <ListSubheader>Student detail</ListSubheader>
                        <ListItem>
                          <ListItemIcon>
                            <Person />
                          </ListItemIcon>
                          <ListItemText primary={student.name} />
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <Phone />
                          </ListItemIcon>

                          <ListItemText primary={student.phone} />
                        </ListItem>

                        <Divider />
                        <ListSubheader>Emergency Contact</ListSubheader>
                        <ListItem>
                          <ListItemIcon>
                            <Person />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${student.emergencyName} - ${student.emergencyRelation}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Phone />
                          </ListItemIcon>
                          <ListItemText primary={student.emergencyPhone} />
                        </ListItem>
                      </>
                    )}
                  </List>
                </>
              </Card>
            </Grid>
          </Grid>
        )}
      </div>
    </Dashboard>
  );
};

export default hot(UserDetail);
