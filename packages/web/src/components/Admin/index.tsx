import { MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import './main.scss';
import Overview from './Overview';
import StudentDetail from './StudentDetail';
import Students from './Students';
import Teachers from './Teachers';
import theme from './theme';

const Admin = () => (
  <MuiThemeProvider theme={theme}>
    <Switch>
      <Route exact path="/admin" component={Overview} />
      <Route path="/admin/teachers" component={Teachers} />
      {/* <Route path="/admin/addUser" exact component={AddUser} /> */}
      <Route path="/admin/students" exact component={Students} />
      <Route path="/admin/student/:id" component={StudentDetail} />
      <Redirect to="/admin" />
    </Switch>
  </MuiThemeProvider>
);

export default Admin;
