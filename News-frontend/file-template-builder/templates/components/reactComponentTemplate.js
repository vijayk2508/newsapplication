const reactComponentTemplate = (prefix, reactComponentName) =>
  `import React from "react";

function ${reactComponentName}(props) {
  return (
    <h5>${reactComponentName}</h5>
  );
};

export default ${reactComponentName};`;

module.exports = reactComponentTemplate;
