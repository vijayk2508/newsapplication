/*
  Use this component to lazily load any other component
  Props:
    1. componentParent: oneOf(["containers", "components", "UIComponents", "common"])
    2. componentPath: String
    3. fallback: Component/HTML
*/

import React, { Suspense, lazy, memo } from "react";
import { string, oneOfType, element, node, oneOf } from "prop-types";

function lazyLoadComponent(componentParent, componentPath) {
  let Component;
  switch (componentParent) {
    case "containers":
      Component = lazy(() => import(`../../containers/${componentPath}`));
      break;
    case "components":
      Component = lazy(() => import(`../../components/${componentPath}`));
      break;
    case "common":
      Component = lazy(() => import(`../../common/${componentPath}`));
      break;
    case "UIComponents":
      Component = lazy(() => import(`../../UIComponents/${componentPath}`));
      break;
    default:
      throw new Error(
        `Component Parents can be only one of ["containers", "components", "UIComponents", "common"] but you provided ${componentParent} instead.`
      );
  }

  return Component;
}

// Don't re-lazyload the component after it is already loaded
// Component reloads because fallback gives a new HTMLElement instance everytime
function arePropsEqual() {
  return true;
}

function LazyLoader({ componentPath, fallback, componentParent, ...restProps }) {
  const ComponentToRender = lazyLoadComponent(componentParent, componentPath);
  return (
    <Suspense fallback={<>{fallback}</>}>
      <ComponentToRender {...restProps} />
    </Suspense>
  );
}

LazyLoader.defaultProps = {
  componentParent: "containers",
  fallback: <h1>Loading...</h1>
};

LazyLoader.propTypes = {
  componentParent: oneOf(["containers", "components", "UIComponents", "common"]),
  componentPath: string.isRequired,
  fallback: oneOfType([node, element])
};

export default memo(LazyLoader, arePropsEqual);
