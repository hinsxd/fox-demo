import {
  Avatar,
  Button,
  Container,
  makeStyles,
  TextField
} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { useAuthContext } from 'context/auth';
import React, { useState } from 'react';
const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },

  formField: {
    marginTop: theme.spacing(1)
  },
  button: {
    marginTop: theme.spacing(1)
  }
}));
const Login = () => {
  const classes = useStyles();
  const [creds, setCreds] = useState({ username: '', password: '' });
  const { login } = useAuthContext();

  const handleChange = (name: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.persist();
    setCreds(oldCred => ({ ...oldCred, [name]: e.target.value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(creds);
  };
  const loginAsDemoUser = async () => {
    await login({
      username: 'demo-user',
      password: 'demo-user'
    });
  };
  const loginAsDemoAdmin = async () => {
    await login({
      username: 'demo-admin',
      password: 'demo-admin'
    });
  };
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <form onSubmit={handleSubmit}>
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            onChange={handleChange('username')}
            className={classes.formField}
            fullWidth
          />
          <TextField
            name="password"
            label="Password"
            variant="outlined"
            type="password"
            onChange={handleChange('password')}
            className={classes.formField}
            fullWidth
          />
          <Button
            variant="contained"
            fullWidth
            color="primary"
            type="submit"
            className={classes.button}
          >
            Sign in
          </Button>
          <Button
            variant="contained"
            fullWidth
            color="secondary"
            onClick={() => {
              loginAsDemoUser();
            }}
            className={classes.button}
          >
            Sign in as Demo User
          </Button>
          <Button
            variant="contained"
            fullWidth
            color="secondary"
            onClick={() => {
              loginAsDemoAdmin();
            }}
            className={classes.button}
          >
            Sign in as Demo Admin
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
