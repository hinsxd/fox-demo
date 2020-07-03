import { makeStyles } from '@material-ui/core';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { useUserQuery } from 'types/graphql';
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

const AddUser: React.FC<RouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id },
  },
}) => {
  const classes = useStyles();

  const { data, loading } = useUserQuery({ variables: { id } });
  const user = data?.user;
  return (
    <Dashboard title="User Detail">
      <div className={classes.root}> ̰</div>
    </Dashboard>
  );
};

export default AddUser;
