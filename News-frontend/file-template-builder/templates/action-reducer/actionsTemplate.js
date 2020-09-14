const actionsTemplate = reducerName =>
  `import ${reducerName}Constants from "./${reducerName}Constants";\n\n`;

module.exports = actionsTemplate;
