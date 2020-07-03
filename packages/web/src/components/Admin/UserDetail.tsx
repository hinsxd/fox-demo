import React from 'react';
import { RouteComponentProps } from 'react-router';
import Dashboard from './Dashboard';
import {
  makeStyles,
  List,
  ListItem,
  Card,
  Divider,
  Grid,
  CircularProgress,
  ListItemText,
  Typography,
  ListItemIcon,
  ListSubheader,
} from '@material-ui/core';
import { hot } from 'react-hot-loader/root';

import { useUserQuery } from 'types/graphql';
import { Person, Email, PinDrop, Phone } from '@material-ui/icons';
import { getLessonStrings } from 'utils/getLessonStrings';

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

  const { data, loading } = useUserQuery({ variables: { id } });
  const user = data?.user;
  return (
    <Dashboard title="User Detail">
      <div className={classes.root}>
        {loading ? (
          <CircularProgress />
        ) : !user ? (
          <Typography>Error</Typography>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <Card>
                <>
                  <List dense>
                    {!user.profile && (
                      <>
                        <ListSubheader>Student detail</ListSubheader>
                        <ListItem>
                          <ListItemIcon>
                            <Person />
                          </ListItemIcon>
                          <ListItemText primary={user.username} />
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <Email />
                          </ListItemIcon>
                          <ListItemText primary={user.email} />
                        </ListItem>
                      </>
                    )}
                    {user.profile && (
                      <>
                        <ListSubheader>Student detail</ListSubheader>
                        <ListItem>
                          <ListItemIcon>
                            <Person />
                          </ListItemIcon>
                          <ListItemText primary={user.profile.name} />
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <Email />
                          </ListItemIcon>
                          <ListItemText primary={user.profile.email} />
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <Phone />
                          </ListItemIcon>

                          <ListItemText primary={user.profile.phone} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <PinDrop />
                          </ListItemIcon>

                          {/* <ListItemText
                            primary={`${user.profile.region} - ${user.profile.district}`}
                            secondary={user.profile.street}
                          /> */}
                          <ListItemText
                            primary={user.profile.detailedAddress}
                          />
                        </ListItem>
                        <Divider />
                        <ListSubheader>Emergency Contact</ListSubheader>
                        <ListItem>
                          <ListItemIcon>
                            <Person />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${user.profile.emergencyName} (${user.profile.emergencyRelation})`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Phone />
                          </ListItemIcon>
                          <ListItemText primary={user.profile.emergencyPhone} />
                        </ListItem>
                      </>
                    )}
                  </List>
                </>
              </Card>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Typography variant="h3" gutterBottom>
                Booked Lessons
              </Typography>
              <Card>
                <List>
                  {user.bookedLessons.map((lesson) => (
                    <ListItem button key={lesson.id}>
                      <ListItemText
                        primary={getLessonStrings(lesson).date}
                        secondary={`${getLessonStrings(lesson).start} - ${
                          getLessonStrings(lesson).end
                        }`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          </Grid>
        )}
      </div>
    </Dashboard>
  );
};

export default hot(UserDetail);
