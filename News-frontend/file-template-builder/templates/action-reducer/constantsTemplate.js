const constantsTemplate = reducerName =>
  `const ${reducerName}Constants = {
  // write your constants for ${reducerName} as key-value pairs here
};
export default ${reducerName}Constants;`;

module.exports = constantsTemplate;
