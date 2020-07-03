import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import { Switch, Route, Redirect } from 'react-router';
import Overview from './Overview';
import Visibility from './Visibility';
import Teachers from './Teachers';
import Users from './Users';
import UserDetail from './UserDetail';
import './main.scss';

const Admin = () => (
  <MuiThemeProvider theme={theme}>
    <Switch>
      <Route exact path="/admin" component={Overview} />
      <Route path="/admin/visibility" component={Visibility} />
      <Route path="/admin/teachers" component={Teachers} />
      <Route path="/admin/users" exact component={Users} />
      <Route path="/admin/user/:id" component={UserDetail} />
      <Redirect to="/admin" />
    </Switch>
  </MuiThemeProvider>
);

export default Admin;
