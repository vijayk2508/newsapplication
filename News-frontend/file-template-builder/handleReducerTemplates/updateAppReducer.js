const fs = require("fs");
const chalk = require("chalk");
const appReducerTemplate = require("../templates/action-reducer/appReducerTemplate");
const log = console.log;

const getDirectories = source =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

function updateAppReducer(reducerName, isUnlink = false) {
  const directoryList = getDirectories("src/action-reducer");
  log(chalk.bold.green(`Updating appReducer.js...`));
  log(chalk.bold.green("-------------------"));
  fs.writeFile(`src/action-reducer/appReducer.js`, appReducerTemplate(directoryList), err => {
    if (err) throw err;
    if (isUnlink) {
      log(chalk.bold.green(`Updated appReducer.js: ${reducerName}Reducer is removed.`));
    } else {
      log(chalk.bold.green(`appReducer.js updated with ${reducerName}Reducer`));
    }
    log(chalk.bold.green("-------------------"));
    return true;
  });
}

module.exports = updateAppReducer;
