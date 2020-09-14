/*
    Redirect to /home if logged in otherwise open the given route
*/

import React from "react";
import { Route, Redirect } from "react-router-dom";
import { cookies } from "../services/auth";

function CommonRoute({ render: Component, ...rest }) {
  function renderComponent(props) {
    return cookies.get("SID") ? (
      <Redirect to={{ pathname: "/home", state: { from: props.location } }} />
    ) : (
      <Component {...props} {...rest} />
    );
  }

  return <Route {...rest} render={renderComponent} />;
}

export default CommonRoute;
