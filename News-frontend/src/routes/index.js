import React from "react";
import { Switch } from "react-router-dom";
import routes from "./routeConstants";
import CommonRoute from "./CommonRoute";
import PrivateRoute from "./PrivateRoute";
import LoadRoute from "./LoadRoute";

function Routes(props) {
  return (
    <Switch>
      {Object.keys(routes).map(routeKey => {
        return !routes[routeKey].isAuthenticated ? (
          <CommonRoute
            key={routeKey}
            render={LoadRoute}
            importPath={routes[routeKey].path}
            {...routes[routeKey]}
          />
        ) : (
          <PrivateRoute
            key={routeKey}
            render={LoadRoute}
            importPath={routes[routeKey].path}
            {...routes[routeKey]}
          />
        );
      })}
    </Switch>
  );
}

export default Routes;
