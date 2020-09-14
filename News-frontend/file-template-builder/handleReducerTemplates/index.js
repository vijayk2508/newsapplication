const path = require("path");
const chalk = require("chalk");
const writeFiles = require("../helpers/writeFiles");
const doesFilesExist = require("../helpers/doesFilesExists");
const reducerTemplates = require("../templates/action-reducer");
const updateAppReducer = require("./updateAppReducer");

const log = console.log;

const reducerSuffixes = ["Actions.js", "Constants.js", "Reducer.js"];
const reducerTemplateItems = [
  { fileSuffix: "Actions.js", templateFunc: reducerTemplates.actionsTemplate },
  { fileSuffix: "Reducer.js", templateFunc: reducerTemplates.reducerTemplate },
  { fileSuffix: "Constants.js", templateFunc: reducerTemplates.constantsTemplate }
];

const handleReducerTemplates = reducerPath => {
  // const reducerName = path.basename(reducerPath).replace(/.*\/action-reducer\//, "");
  const reducerName = path.basename(reducerPath);
  const doesTemplateFilesExist = doesFilesExist(reducerPath, reducerName, reducerSuffixes);

  if (!doesTemplateFilesExist) {
    log(chalk.bold.yellow(`Detected an empty directory ${reducerName} in src/action-reducer`));
    log();
    log();
    writeFiles(reducerPath, reducerName, reducerTemplateItems);
    updateAppReducer(reducerName);
  }
};

module.exports = handleReducerTemplates;
