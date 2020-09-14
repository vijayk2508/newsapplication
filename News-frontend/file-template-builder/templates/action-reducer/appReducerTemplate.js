const appReducerTemplate = reducerNames =>
  `${reducerNames
    .map(
      reducerName =>
        `import { ${reducerName}Reducer } from "./${reducerName}/${reducerName}Reducer";\n`
    )
    .join("")}
export default {
${reducerNames
  .map((reducerName, index) =>
    index !== reducerNames.length - 1
      ? ` ${reducerName}: ${reducerName}Reducer,\n`
      : ` ${reducerName}: ${reducerName}Reducer`
  )
  .join("")}
};
`;

module.exports = appReducerTemplate;
