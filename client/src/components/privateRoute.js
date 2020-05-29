import React, { Component } from "react";
import { Route, Redirect } from 'react-router-dom';

import useAuth from '../services/authentication';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = useAuth();

  return (
    <Route {...rest} render = {props => auth.loggedIn
      ? <Component {...props} />
      : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
    } />
  );
}

export default PrivateRoute;