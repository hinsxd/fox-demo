import { useAuthContext } from 'context/auth';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { UserRole } from 'types/graphql';
export const PublicRoute: React.FC<RouteProps> = ({ component, ...rest }) => {
  const { me } = useAuthContext();
  return !me ? <Route {...rest} component={component} /> : <Redirect to="/" />;
};

export const PrivateRoute: React.FC<RouteProps> = ({ component, ...rest }) => {
  const { me } = useAuthContext();

  if (!me) {
    return <Redirect to="/login" />;
  }

  if (me.role === UserRole.NewUser) {
    return <Redirect to="/newUser" />;
  }

  if (me.role === UserRole.Admin) {
    return <Redirect to="/admin" />;
  }
  return <Route {...rest} component={component} />;
};

export const AdminRoute: React.FC<RouteProps> = ({ component, ...rest }) => {
  const { me } = useAuthContext();

  if (!me) {
    return <Redirect to="/login" />;
  }
  if (me.role !== UserRole.Admin) {
    return <Redirect to="/" />;
  }

  return <Route {...rest} component={component} />;
};

export const NewUserRoute: React.FC<RouteProps> = ({ component, ...rest }) => {
  const { me } = useAuthContext();

  if (!me) {
    return <Redirect to="/login" />;
  }

  if (me.role !== UserRole.NewUser) {
    return <Redirect to="/lessons" />;
  }

  return <Route {...rest} component={component} />;
};
