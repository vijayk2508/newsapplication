const fs = require("fs");
const chalk = require("chalk");
const log = console.log;

/*
  fileItems = [
    {
      fileSuffix: "Actions.js", templateFunc: reducerTemplates.action
    }
  ]
*/
function writeFiles(path, filePrefix, fileItems, directoryName) {
  fileItems.forEach(fileItem => {
    log(chalk.bold.yellow(`Creating ${filePrefix}${fileItem.fileSuffix} template for ${path}...`));
    log(chalk.bold.yellow("-------------------"));
    fs.writeFile(
      `${path}/${filePrefix}${fileItem.fileSuffix}`,
      fileItem.templateFunc(filePrefix, directoryName),
      err => {
        if (err) throw err;
        log(
          chalk.bold.green(`Created ${filePrefix}${fileItem.fileSuffix} template for ${path}...`)
        );
        log(chalk.bold.green("-------------------"));
        return true;
      }
    );
  });
}

module.exports = writeFiles;
