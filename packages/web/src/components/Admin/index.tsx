import { MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import AddUser from './AddUser';
import './main.scss';
import Overview from './Overview';
import Teachers from './Teachers';
import theme from './theme';
import UserDetail from './UserDetail';
import Users from './Users';
import Visibility from './Visibility';

const Admin = () => (
  <MuiThemeProvider theme={theme}>
    <Switch>
      <Route exact path="/admin" component={Overview} />
      <Route path="/admin/visibility" component={Visibility} />
      <Route path="/admin/teachers" component={Teachers} />
      <Route path="/admin/addUser" exact component={AddUser} />
      <Route path="/admin/users" exact component={Users} />
      <Route path="/admin/user/:id" component={UserDetail} />
      <Redirect to="/admin" />
    </Switch>
  </MuiThemeProvider>
);

export default Admin;
