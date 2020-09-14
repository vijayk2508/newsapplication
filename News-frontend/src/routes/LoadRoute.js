import React from "react";
import LazyLoader from "../common/LazyLoader";

function LoadRoute(props) {
  return (
    <LazyLoader
      componentPath={props.routeComponentPath}
      componentParent={props.routeComponentParent}
      fallback={<h1>Loading...</h1>}
      {...props}
    />
  );
}

export default LoadRoute;
