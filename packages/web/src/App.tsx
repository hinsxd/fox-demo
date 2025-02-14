import DateFnsUtils from '@date-io/date-fns';
// import DatefnsUtils from '@date-io/date-fns';
import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { loadStripe } from '@stripe/stripe-js';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { AdminRoute, PrivateRoute, PublicRoute } from 'auth/AuthRoutes';
import { AuthProvider } from 'context/auth';
import React, { lazy, Suspense } from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from 'views/Login';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

const Admin = lazy(() => import('components/Admin'));

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT!;

// const client = new ApolloClient({
//   uri: `${API_ENDPOINT}/graphql`,
//   credentials: 'include'
// });
const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: `${API_ENDPOINT}/graphql`,
      credentials: 'include',
    }),
  ]),
  cache: new InMemoryCache(),
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#136a8c',
    },
  },
});

const App: React.FC<{}> = () => {
  return (
    <>
      <CssBaseline />
      <ApolloProvider client={client}>
        <MuiThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            {/* <SnackbarProvider maxSnack={2} autoHideDuration={3000}> */}
            <Router>
              <AuthProvider>
                {/* <CheckoutDialogProvider> */}
                {/* <LessonDialogProvider> */}
                <Switch>
                  <PublicRoute path="/login" exact component={Login} />
                  <AdminRoute path="/admin">
                    <Suspense fallback={null}>
                      <Admin />
                    </Suspense>
                  </AdminRoute>
                  <PrivateRoute path="/" />
                  {/* <PrivateRoute exact path="/" component={Home} />
                        <PrivateRoute exact path="/cart" component={Cart} />
                        <PrivateRoute
                          exact
                          path="/lessons"
                          component={Lessons}
                        />
                        <PrivateRoute path="/settings" component={Settings} />
                        <NewUserRoute
                          exact
                          path="/newUser"
                          component={NewUser}
                        /> */}
                  <Route component={() => <div>Not Found</div>} />
                </Switch>
                {/* <Elements stripe={stripePromise} options={{ locale: 'en' }}>
                  <CheckoutDialog />
                </Elements> */}
                {/* </LessonDialogProvider> */}
                {/* </CheckoutDialogProvider> */}
              </AuthProvider>
            </Router>
            {/* </SnackbarProvider> */}
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
      </ApolloProvider>
    </>
  );
};

export default App;
