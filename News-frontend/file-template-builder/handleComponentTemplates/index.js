const path = require("path");
const chalk = require("chalk");
const writeFiles = require("../helpers/writeFiles");
const doesFilesExist = require("../helpers/doesFilesExists");
const componentTemplates = require("../templates/components");

const log = console.log;

const reducerSuffixes = ["index.js"];
const reducerTemplateItems = [
  { fileSuffix: "index.js", templateFunc: componentTemplates.reactComponentTemplate }
];

// category is one of "components" or "containers"

const handleComponentTemplates = (componentPath, category) => {
  // const categoryRegex = new RegExp(`.*\/${category}\/`);
  // const directoryName = componentPath.replace(categoryRegex, "");
  const directoryName = path.basename(componentPath);
  const doesTemplateFilesExist = doesFilesExist(componentPath, "", reducerSuffixes);

  if (!doesTemplateFilesExist) {
    log(chalk.bold.yellow(`Detected an empty directory ${directoryName} in src/${category}`));
    log();
    log();
    writeFiles(componentPath, "", reducerTemplateItems, directoryName);
  }
};

module.exports = handleComponentTemplates;
